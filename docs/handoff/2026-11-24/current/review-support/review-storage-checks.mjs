import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';

const source = fs.readFileSync('lib/storage.ts', 'utf8');
const names = [...source.matchAll(/export function (\w+)/g)].map(match => match[1]);
const code = stripTypeScriptTypes(source).replace(/export function /g, 'function ') +
  '\nObject.assign(exports, {' + names.join(',') + '});';

function setup(initial = {}) {
  const values = new Map(Object.entries(initial));
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const context = { exports: {}, window: { localStorage: storage }, localStorage: storage };
  vm.runInNewContext(code, context);
  return { api: context.exports, context, values, storage };
}

test('capture saves, reopens, and preserves existing idea text', () => {
  const { api } = setup();
  const first = api.createIdea({ text: 'An original thought' });
  const second = api.createIdea({ text: 'Another thought' });
  assert.equal(api.readIdeas().data.length, 2);
  assert.equal(api.getIdea(first.id).text, 'An original thought');
  assert.equal(api.getIdea(second.id).text, 'Another thought');
});

test('corrupt or unexpected idea data cannot be overwritten by capture', () => {
  for (const raw of ['broken JSON', '{}', '[{"id":"old","text":"Keep me"}]']) {
    const { api, values } = setup({ 'morrow:ideas': raw });
    assert.equal(api.readIdeas().ok, false);
    assert.throws(() => api.createIdea({ text: 'New thought' }));
    assert.equal(values.get('morrow:ideas'), raw);
  }
});

test('blocked storage returns a load error and never reports capture success', () => {
  const { api, context } = setup();
  Object.defineProperty(context.window, 'localStorage', { get() { throw new Error('blocked'); } });
  assert.equal(api.readIdeas().ok, false);
  assert.throws(() => api.createIdea({ text: 'Keep this text' }));
});

test('quota failure leaves existing stored ideas intact', () => {
  const { api, storage, values } = setup();
  api.createIdea({ text: 'Existing thought' });
  const original = values.get('morrow:ideas');
  storage.setItem = () => { throw new Error('quota exceeded'); };
  assert.throws(() => api.createIdea({ text: 'Unsaved thought' }));
  assert.equal(values.get('morrow:ideas'), original);
});

test('existing publication statuses remain readable and unchanged', () => {
  const records = ['draft', 'ready', 'published'].map((status) => ({
    id: status, status, title: 'Existing work', body: 'Original writing',
    platform: 'whatsapp-status', sourceIdeaId: null,
    createdAt: '2026-11-24T10:00:00Z', updatedAt: '2026-11-24T10:00:00Z',
  }));
  const raw = JSON.stringify(records);
  const { api, values } = setup({ 'morrow:content': raw });
  assert.equal(api.readContentItems().ok, true);
  assert.equal(api.readContentItems().data.length, 3);
  assert.equal(values.get('morrow:content'), raw);
});

test('server reads and empty captures never claim persistence', () => {
  const { api, context } = setup();
  assert.throws(() => api.createIdea({ text: '   ' }));
  delete context.window;
  assert.equal(api.readIdeas().ok, false);
  assert.throws(() => api.createIdea({ text: 'Server-side thought' }));
});

// Characterization checks: these confirm defects, not desired behavior.
test('review confirms createContent replaces corrupt stored content', () => {
  const raw = 'broken JSON';
  const { api, values } = setup({ 'morrow:content': raw });
  api.createContent({ title: 'New piece', body: 'New writing' });
  assert.notEqual(values.get('morrow:content'), raw);
  assert.equal(JSON.parse(values.get('morrow:content')).length, 1);
});
test('review confirms createContent returns a record without a browser write', () => {
  const { api, context, values } = setup();
  delete context.window;
  assert.equal(api.createContent({ title: 'Server', body: 'Writing' }).title, 'Server');
  assert.equal(values.has('morrow:content'), false);
});
