import { test } from 'node:test';
import assert from 'node:assert/strict';
import { componentRuntime, elementText } from './helpers/local-runtime.mjs';

const stamp = '2026-01-01T10:00:00.000Z';
const idea = { id: 'idea', text: 'Original thought', status: 'active', createdAt: stamp, updatedAt: stamp, retained: true };
const piece = { id: 'piece', title: 'Original title', body: 'Original writing', status: 'ready', platform: 'linkedin', sourceIdeaId: 'idea', createdAt: stamp, updatedAt: stamp, retained: true };
const legacy = () => ({ 'morrow:ideas': JSON.stringify([idea]), 'morrow:content': JSON.stringify([piece]) });
const workspace = () => ({ 'morrow.workspace.v1': JSON.stringify({ version: 1, ideas: [], content: [{ ...piece, status: 'draft', sourceIdeaId: null }] }) });
const saveButtons = (runtime) => runtime.nodes('button').filter((node) => /Save changes|Retry save/.test(elementText(node)));

test('Idea detail exposes dirty header Save and retains text through a failed-save retry', async () => {
  const runtime = componentRuntime(legacy());
  await runtime.mount('components/ideas/idea-detail.tsx', 'IdeaDetail', { ideaId: 'idea' });
  await runtime.change('textarea', 'First edit');
  assert.equal(saveButtons(runtime).length, 2, 'header and lower Save actions are available');
  assert.match(runtime.text(), /Unsaved changes/);
  const before = runtime.values.get('morrow:ideas');
  const write = runtime.storage.setItem;
  runtime.storage.setItem = () => { throw new Error('quota'); };
  await runtime.click('Save changes');
  assert.equal(runtime.nodes('textarea')[0].props.value, 'First edit');
  assert.equal(runtime.values.get('morrow:ideas'), before);
  assert.equal(saveButtons(runtime)[0].props.disabled, false);
  assert.match(runtime.text(), /Retry save/);
  runtime.storage.setItem = write;
  await runtime.click('Retry save');
  assert.match(runtime.text(), /Saved on this device/);
  assert.equal(JSON.parse(runtime.values.get('morrow:ideas'))[0].text, 'First edit');
  assert.equal(JSON.parse(runtime.values.get('morrow:ideas'))[0].createdAt, stamp);
});

test('Idea detail later edits stay unsaved after a successful save; whitespace edits also stay dirty', async () => {
  const runtime = componentRuntime(legacy());
  const timers = [];
  runtime.context.setTimeout = (callback) => timers.push(callback);
  await runtime.mount('components/ideas/idea-detail.tsx', 'IdeaDetail', { ideaId: 'idea' });
  await runtime.change('textarea', 'Saved edit');
  await runtime.click('Save changes');
  assert.match(runtime.text(), /Saved on this device/);
  await runtime.change('textarea', 'Saved edit\n');
  for (const timer of timers) timer();
  await runtime.render();
  assert.equal(timers.length, 0, 'save success schedules no timer');
  assert.match(runtime.text(), /Unsaved changes/);
  assert.equal(saveButtons(runtime)[0].props.disabled, false);
  assert.equal(JSON.parse(runtime.values.get('morrow:ideas'))[0].text, 'Saved edit');
});

test('Studio retries failed saving without retyping and later title/body/platform edits are dirty', async () => {
  const runtime = componentRuntime(legacy(), { query: 'contentId=piece' });
  await runtime.mount('components/studio/studio-page.tsx', 'StudioPage');
  assert.match(runtime.text(), /Saved on this device/);
  await runtime.change('textarea', 'Edited writing');
  const write = runtime.storage.setItem;
  runtime.storage.setItem = () => { throw new Error('quota'); };
  await runtime.click('Save changes');
  assert.equal(runtime.nodes('textarea')[0].props.value, 'Edited writing');
  assert.equal(saveButtons(runtime)[0].props.disabled, false);
  runtime.storage.setItem = write;
  await runtime.click('Retry save');
  assert.match(runtime.text(), /Saved on this device/);
  await runtime.change('input', 'Changed title');
  assert.match(runtime.text(), /Unsaved changes/);
  await runtime.click('Save changes');
  await runtime.change('select', 'x');
  assert.match(runtime.text(), /Unsaved changes/);
  await runtime.click('Save changes');
  await runtime.change('textarea', 'A later edit');
  assert.match(runtime.text(), /Unsaved changes/);
  const saved = JSON.parse(runtime.values.get('morrow:content'))[0];
  assert.equal(saved.body, 'Edited writing');
  assert.equal(saved.status, 'ready');
  assert.equal(saved.createdAt, stamp);
  assert.equal(saved.retained, true);
});

test('Studio creation failure retains writing and retry creates exactly one draft', async () => {
  const runtime = componentRuntime(legacy());
  await runtime.mount('components/studio/studio-page.tsx', 'StudioPage');
  await runtime.change('textarea', 'New writing');
  const write = runtime.storage.setItem;
  runtime.storage.setItem = () => { throw new Error('quota'); };
  await runtime.click('Save draft');
  assert.equal(runtime.nodes('textarea')[0].props.value, 'New writing');
  runtime.storage.setItem = write;
  await runtime.click('Retry save');
  await runtime.click('Save changes');
  assert.equal(JSON.parse(runtime.values.get('morrow:content')).length, 2);
});

test('workspace editor retries a failed save without another edit and later edits remain unsaved', async () => {
  const runtime = componentRuntime(workspace());
  await runtime.mount('components/content/content-editor.tsx', 'ContentEditor', { mode: { kind: 'edit', contentId: 'piece' } });
  await runtime.change('textarea', 'First workspace edit');
  const before = runtime.values.get('morrow.workspace.v1');
  const write = runtime.storage.setItem;
  runtime.storage.setItem = () => { throw new Error('quota'); };
  await runtime.click('Save changes');
  assert.equal(runtime.nodes('textarea')[0].props.value, 'First workspace edit');
  assert.equal(runtime.values.get('morrow.workspace.v1'), before);
  assert.equal(saveButtons(runtime)[0].props.disabled, false);
  runtime.storage.setItem = write;
  await runtime.click('Retry save');
  assert.match(runtime.text(), /Saved on this device/);
  assert.equal(saveButtons(runtime)[0].props.disabled, true);
  await runtime.change('textarea', 'Later workspace edit');
  assert.match(runtime.text(), /Unsaved changes/);
  assert.equal(saveButtons(runtime)[0].props.disabled, false);
  assert.equal(JSON.parse(runtime.values.get('morrow.workspace.v1')).content[0].body, 'First workspace edit');
});

test('workspace editor retains editable text when a subsequent storage read fails', async () => {
  const runtime = componentRuntime(workspace());
  await runtime.mount('components/content/content-editor.tsx', 'ContentEditor', { mode: { kind: 'edit', contentId: 'piece' } });
  await runtime.change('textarea', 'Keep this unsaved writing');
  runtime.values.set('morrow.workspace.v1', 'broken JSON');
  await runtime.render();
  assert.equal(runtime.nodes('textarea')[0].props.value, 'Keep this unsaved writing');
  assert.match(runtime.text(), /current text is retained below/);
  await runtime.click('Save changes');
  assert.match(runtime.text(), /retry saving/);
  assert.equal(runtime.values.get('morrow.workspace.v1'), 'broken JSON');
});

test('workspace create failure retains writing and retry creates one record', async () => {
  const runtime = componentRuntime({});
  await runtime.mount('components/content/content-editor.tsx', 'ContentEditor', { mode: { kind: 'create' } });
  await runtime.change('textarea', 'Workspace new draft');
  const write = runtime.storage.setItem;
  runtime.storage.setItem = () => { throw new Error('quota'); };
  await runtime.click('Create draft');
  assert.equal(runtime.nodes('textarea')[0].props.value, 'Workspace new draft');
  runtime.storage.setItem = write;
  await runtime.click('Create draft');
  assert.equal(JSON.parse(runtime.values.get('morrow.workspace.v1')).content.length, 1);
  assert.equal(runtime.nodes('button').find((node) => elementText(node) === 'Create draft').props.disabled, true);
});

test('legacy load failures show a recoverable error instead of false missing/empty content', async () => {
  for (const [file, name, props, initial] of [
    ['components/ideas/idea-detail.tsx', 'IdeaDetail', { ideaId: 'idea' }, { ...legacy(), 'morrow:ideas': 'broken' }],
    ['components/ideas/ideas-page.tsx', 'IdeasPage', {}, { ...legacy(), 'morrow:ideas': 'broken' }],
    ['components/content/content-page.tsx', 'ContentPage', {}, { ...legacy(), 'morrow:content': 'broken' }],
  ]) {
    const runtime = componentRuntime(initial);
    await runtime.mount(file, name, props);
    assert.ok(runtime.nodes().some((node) => node.props.role === 'alert'));
    assert.doesNotMatch(runtime.text(), /Idea not found|No ideas yet|Library is empty/);
    runtime.values.set('morrow:ideas', JSON.stringify([idea]));
    runtime.values.set('morrow:content', JSON.stringify([piece]));
    await runtime.click('Try again');
    assert.equal(runtime.nodes().filter((node) => node.props.role === 'alert').length, 0);
  }
});

test('Studio refuses to treat a missing or unreadable draft as a new draft', async () => {
  for (const stored of ['broken', '[]']) {
    const runtime = componentRuntime({ ...legacy(), 'morrow:content': stored }, { query: 'contentId=piece' });
    await runtime.mount('components/studio/studio-page.tsx', 'StudioPage');
    assert.ok(runtime.nodes().some((node) => node.props.role === 'alert'));
    assert.equal(runtime.nodes('textarea').length, 0);
    assert.doesNotMatch(runtime.text(), /Save draft/);
    runtime.values.set('morrow:content', JSON.stringify([piece]));
    await runtime.click('Try again');
    assert.equal(runtime.nodes('textarea')[0].props.value, piece.body);
  }
});
