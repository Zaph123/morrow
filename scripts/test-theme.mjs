import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { localRuntime } from './helpers/local-runtime.mjs';

function documentFixture() {
  const classes = new Set(['dark']);
  const root = { dataset: { theme: 'dark' }, style: { colorScheme: 'dark' }, classList: { remove: name => classes.delete(name) } };
  return { document: { documentElement: root }, root, classes };
}

test('theme bootstrap paints Light without reading or writing a saved preference', () => {
  const { themeBootstrapScript } = localRuntime().load('lib/theme.ts');
  const fixture = documentFixture();
  vm.runInNewContext(themeBootstrapScript, { document: fixture.document, window: new Proxy({}, { get() { throw new Error('bootstrap accessed browser preference'); } }) });
  assert.equal(fixture.root.dataset.theme, 'light');
  assert.equal(fixture.root.style.colorScheme, 'light');
  assert.equal(fixture.classes.has('dark'), false);
});

test('applying any retained preference uses Light without accessing browser storage or OS theme', () => {
  const runtime = localRuntime();
  const fixture = documentFixture();
  runtime.context.document = fixture.document;
  runtime.context.window = new Proxy({}, { get() { throw new Error('presentation accessed browser preferences'); } });
  const { applyThemePreference, THEME_PREFERENCES, THEME_STORAGE_KEY } = runtime.load('lib/theme.ts');
  assert.equal(THEME_STORAGE_KEY, 'morrow.theme');
  assert.equal([...THEME_PREFERENCES].join(','), 'light,dark,system');
  for (const preference of THEME_PREFERENCES) {
    applyThemePreference(preference);
    assert.equal(fixture.root.dataset.theme, 'light');
    assert.equal(fixture.root.style.colorScheme, 'light');
    assert.equal(fixture.classes.has('dark'), false);
  }
});
