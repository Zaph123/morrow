import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localRuntime, componentRuntime } from './helpers/local-runtime.mjs';

test('shared sorter returns a new array and preserves order for equal timestamps', () => {
  const { sortByUpdatedDesc } = localRuntime().load('lib/sort.ts');
  const items = Object.freeze([
    Object.freeze({ id: 'first-tie', updatedAt: '2026-11-20T12:00:00Z' }),
    Object.freeze({ id: 'older', updatedAt: '2026-11-19T12:00:00Z' }),
    Object.freeze({ id: 'second-tie', updatedAt: '2026-11-20T12:00:00Z' }),
    Object.freeze({ id: 'latest', updatedAt: '2026-11-24T12:00:00Z' }),
  ]);
  const sorted = sortByUpdatedDesc(items);
  assert.notEqual(sorted, items);
  assert.equal(sorted.map(item => item.id).join(','), 'latest,first-tie,second-tie,older');
  assert.equal(items.map(item => item.id).join(','), 'first-tie,older,second-tie,latest');
  assert.equal(sorted[1], items[0]);
  const empty = [];
  assert.notEqual(sortByUpdatedDesc(empty), empty);
});

test('Home retains its three-item limit per collection after stable sorting without writing data', async () => {
  const dates = ['2026-11-20T12:00:00Z', '2026-11-19T12:00:00Z', '2026-11-20T12:00:00Z', '2026-11-24T12:00:00Z', '2026-11-18T12:00:00Z'];
  const ideas = dates.map((date, index) => ({ id: `idea-${index}`, text: `Test idea ${index}`, status: 'active', createdAt: date, updatedAt: date }));
  const content = dates.map((date, index) => ({ id: `piece-${index}`, title: `Test draft ${index}`, body: '', status: 'draft', platform: null, sourceIdeaId: null, createdAt: date, updatedAt: date }));
  const initial = { 'morrow:ideas': JSON.stringify(ideas), 'morrow:content': JSON.stringify(content) };
  const runtime = componentRuntime(initial);
  await runtime.mount('components/home/home-page.tsx', 'HomePageClient');
  assert.equal(runtime.nodes('a').filter(node => /^\/ideas\//.test(node.props.href)).map(node => node.props.href).join(','), '/ideas/idea-3,/ideas/idea-0,/ideas/idea-2');
  assert.equal(runtime.nodes('a').filter(node => /^\/studio\?contentId=/.test(node.props.href)).map(node => node.props.href).join(','), '/studio?contentId=piece-3,/studio?contentId=piece-0,/studio?contentId=piece-2');
  assert.deepEqual([...runtime.values], Object.entries(initial));
});
