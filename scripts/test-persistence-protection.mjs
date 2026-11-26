import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localRuntime } from './helpers/local-runtime.mjs';

const stamp = '2026-01-01T10:00:00.000Z';
const idea = { id: 'idea', text: 'Original thought', status: 'archived', createdAt: stamp, updatedAt: stamp, extra: { retained: true } };
const content = { id: 'piece', title: 'Original title', body: 'Original writing', status: 'published', platform: 'whatsapp-status', sourceIdeaId: 'idea', createdAt: stamp, updatedAt: stamp, extra: { retained: true } };
const snapshot = { version: 1, extra: { workspace: true }, ideas: [{ ...idea, body: idea.text }], content: [{ ...content, platform: 'whatsapp', status: 'draft' }] };
const initial = () => ({ 'morrow:ideas': JSON.stringify([idea]), 'morrow:content': JSON.stringify([content]), 'morrow.workspace.v1': JSON.stringify(snapshot) });
const legacyMutations = (api) => [
  () => api.createIdea({ text: 'New thought' }), () => api.updateIdea('idea', { text: 'Edited thought' }), () => api.deleteIdea('idea'),
  () => api.createContent({ title: 'New', body: 'Writing' }), () => api.updateContent('piece', { body: 'Edited writing' }), () => api.deleteContent('piece'),
];
const workspaceMutations = (api) => [
  () => api.createIdea('New thought'), () => api.updateIdea('idea', 'Edited thought'), () => api.deleteIdea('idea'),
  () => api.createContent({ body: 'New writing' }), () => api.updateContent('piece', { body: 'Edited writing' }), () => api.deleteContent('piece'),
];

test('all legacy writers reject unreadable target collections without touching either format', () => {
  for (const raw of ['', 'broken JSON', '{}', '[{}]']) {
    for (let index = 0; index < 6; index++) {
      const key = index < 3 ? 'morrow:ideas' : 'morrow:content';
      const runtime = localRuntime({ ...initial(), [key]: raw });
      const before = [...runtime.values];
      const api = runtime.load('lib/storage.ts');
      assert.throws(legacyMutations(api)[index]);
      assert.deepEqual([...runtime.values], before);
    }
  }
});

test('legacy readers report unreadable data instead of returning empty lists or missing items', () => {
  const runtime = localRuntime({ 'morrow:ideas': 'broken', 'morrow:content': 'broken' });
  const api = runtime.load('lib/storage.ts');
  for (const read of [() => api.getIdeas(), () => api.getIdea('idea'), () => api.getContentItems(), () => api.getContentItem('piece'), () => api.getContentBySourceIdea('idea')]) assert.throws(read);
});

test('legacy validation rejects status arrays rather than coercing them to valid status strings', () => {
  const runtime = localRuntime({ 'morrow:ideas': JSON.stringify([{ ...idea, status: ['active'] }]), 'morrow:content': JSON.stringify([{ ...content, status: ['published'] }]) });
  const api = runtime.load('lib/storage.ts');
  const before = [...runtime.values];
  assert.equal(api.readIdeas().ok, false);
  assert.equal(api.readContentItems().ok, false);
  assert.throws(() => api.updateIdea('idea', { text: 'Edit' }));
  assert.throws(() => api.updateContent('piece', { body: 'Edit' }));
  assert.deepEqual([...runtime.values], before);
});

test('every legacy writer rejects server execution, blocked getters, and read failures', () => {
  for (const failure of ['server', 'getter', 'getItem']) {
    for (let index = 0; index < 6; index++) {
      const runtime = localRuntime(initial());
      const before = [...runtime.values];
      const api = runtime.load('lib/storage.ts');
      if (failure === 'server') delete runtime.context.window;
      if (failure === 'getter') Object.defineProperty(runtime.context.window, 'localStorage', { get() { throw new Error('blocked'); } });
      if (failure === 'getItem') runtime.storage.getItem = () => { throw new Error('read failed'); };
      assert.throws(legacyMutations(api)[index]);
      assert.deepEqual([...runtime.values], before);
    }
  }
});

test('every legacy writer retains all bytes on quota failure and succeeds on retry', () => {
  for (let index = 0; index < 6; index++) {
    const runtime = localRuntime(initial());
    const api = runtime.load('lib/storage.ts');
    const originalWrite = runtime.storage.setItem;
    const before = [...runtime.values];
    runtime.storage.setItem = () => { throw new Error('quota'); };
    assert.throws(legacyMutations(api)[index]);
    assert.deepEqual([...runtime.values], before);
    runtime.storage.setItem = originalWrite;
    assert.ok(legacyMutations(api)[index]());
  }
});

test('legacy edits preserve creation, identity, provenance, statuses and unknown fields', () => {
  const runtime = localRuntime(initial());
  const api = runtime.load('lib/storage.ts');
  const editedIdea = api.updateIdea('idea', { text: '  Exact edit\n', id: 'replace', createdAt: 'replace', extra: 'replace' });
  const editedPiece = api.updateContent('piece', { body: '  Exact writing\n', id: 'replace', createdAt: 'replace', sourceIdeaId: 'replace', extra: 'replace' });
  assert.equal(editedIdea.text, '  Exact edit\n');
  assert.equal(editedPiece.body, '  Exact writing\n');
  for (const [edited, original] of [[editedIdea, idea], [editedPiece, content]]) {
    assert.equal(edited.createdAt, stamp);
    assert.equal(edited.id, original.id);
    assert.equal(edited.status, original.status);
    assert.equal(JSON.stringify(edited.extra), JSON.stringify(original.extra));
    assert.notEqual(edited.updatedAt, stamp);
  }
  assert.equal(editedPiece.sourceIdeaId, 'idea');
  assert.equal(editedPiece.platform, 'whatsapp-status');
  assert.equal(runtime.values.get('morrow.workspace.v1'), initial()['morrow.workspace.v1']);
});

test('invalid edits and no-op edits never update timestamps or write storage', () => {
  const runtime = localRuntime(initial());
  const api = runtime.load('lib/storage.ts');
  const before = [...runtime.values];
  runtime.storage.setItem = () => { throw new Error('No write expected'); };
  assert.equal(api.updateIdea('idea', { text: idea.text }).updatedAt, stamp);
  assert.equal(api.updateContent('piece', { body: content.body }).updatedAt, stamp);
  assert.throws(() => api.updateIdea('idea', { text: '   ' }));
  assert.throws(() => api.updateContent('piece', { platform: 'unknown' }));
  assert.equal(api.updateContent('missing', { body: 'Text' }), null);
  assert.deepEqual([...runtime.values], before);
});

test('legacy idea deletion keeps linked writing byte-for-byte with its source reference', () => {
  const runtime = localRuntime(initial());
  const api = runtime.load('lib/storage.ts');
  assert.equal(api.deleteIdea('idea'), true);
  assert.equal(runtime.values.get('morrow:content'), initial()['morrow:content']);
  assert.equal(api.getIdea('idea'), null);
  assert.equal(api.getContentItem('piece').sourceIdeaId, 'idea');
});

test('all workspace mutations reject corrupt snapshots and preserve legacy keys', () => {
  for (const raw of ['', 'broken JSON', '{}', JSON.stringify({ ...snapshot, content: [{ ...snapshot.content[0], status: 'published' }] })]) {
    const runtime = localRuntime({ ...initial(), 'morrow.workspace.v1': raw });
    const api = runtime.load('lib/workspace/repository.ts');
    const before = [...runtime.values];
    for (const mutate of workspaceMutations(api)) assert.equal(mutate().ok, false);
    assert.deepEqual([...runtime.values], before);
  }
});

test('workspace blocked getters return errors instead of exceptions or empty browser data', () => {
  const runtime = localRuntime(initial());
  const api = runtime.load('lib/workspace/repository.ts');
  const storage = runtime.load('lib/workspace/storage.ts');
  Object.defineProperty(runtime.context.window, 'localStorage', { get() { throw new Error('blocked'); } });
  assert.equal(storage.canUseLocalStorage(), false);
  assert.equal(storage.readWorkspace().ok, false);
  assert.equal(storage.writeWorkspace(snapshot).ok, false);
  for (const mutate of workspaceMutations(api)) assert.equal(mutate().ok, false);
});

test('all workspace mutations fail without changing bytes on quota errors, then succeed on retry', () => {
  for (let index = 0; index < 6; index++) {
    const runtime = localRuntime(initial());
    const api = runtime.load('lib/workspace/repository.ts');
    const write = runtime.storage.setItem;
    const before = [...runtime.values];
    runtime.storage.setItem = () => { throw new Error('quota'); };
    assert.equal(workspaceMutations(api)[index]().ok, false);
    assert.deepEqual([...runtime.values], before);
    runtime.storage.setItem = write;
    assert.equal(workspaceMutations(api)[index]().ok, true);
  }
});

test('workspace edits preserve existing fields and metadata, and no-op writes do not advance time', () => {
  const runtime = localRuntime(initial());
  const api = runtime.load('lib/workspace/repository.ts');
  const unchanged = api.updateContent('piece', { body: content.body });
  assert.equal(unchanged.ok, true);
  assert.equal(unchanged.data.updatedAt, stamp);
  const edited = api.updateContent('piece', { body: 'Edited body' });
  assert.equal(edited.ok, true);
  assert.equal(edited.data.createdAt, stamp);
  assert.equal(edited.data.sourceIdeaId, 'idea');
  assert.notEqual(edited.data.updatedAt, stamp);
  assert.equal(JSON.stringify(edited.data.extra), JSON.stringify(content.extra));
  const editedIdea = api.updateIdea('idea', '  Exact thought\n');
  assert.equal(editedIdea.data.body, '  Exact thought\n');
  assert.equal(editedIdea.data.createdAt, stamp);
  assert.equal(editedIdea.data.status, 'archived');
  const saved = JSON.parse(runtime.values.get('morrow.workspace.v1'));
  assert.deepEqual(saved.extra, { workspace: true });
  assert.equal(runtime.values.get('morrow:ideas'), initial()['morrow:ideas']);
  assert.equal(runtime.values.get('morrow:content'), initial()['morrow:content']);
});

test('workspace direct writes reject corrupt existing data and invalid proposed payloads', () => {
  const runtime = localRuntime(initial());
  const api = runtime.load('lib/workspace/storage.ts');
  assert.equal(api.writeWorkspace({ version: 1, ideas: [{}], content: [] }).ok, false);
  runtime.values.set('morrow.workspace.v1', 'broken');
  assert.equal(api.writeWorkspace(snapshot).ok, false);
  assert.equal(runtime.values.get('morrow.workspace.v1'), 'broken');
});

test('workspace server mutations never report persisted success', () => {
  const runtime = localRuntime(initial());
  const api = runtime.load('lib/workspace/repository.ts');
  delete runtime.context.window;
  for (const mutate of workspaceMutations(api)) assert.equal(mutate().ok, false);
  assert.deepEqual([...runtime.values], Object.entries(initial()));
});

test('workspace idea deletion keeps linked writing, metadata and timestamps', () => {
  const runtime = localRuntime(initial());
  const api = runtime.load('lib/workspace/repository.ts');
  assert.equal(api.deleteIdea('idea').ok, true);
  const saved = JSON.parse(runtime.values.get('morrow.workspace.v1'));
  assert.deepEqual(saved.content, snapshot.content);
  assert.deepEqual(saved.extra, snapshot.extra);
});
