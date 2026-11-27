import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Isolated browser-storage fixture. No real browser keys or user data are read.
export function localRuntime(initial = {}, overrides = {}) {
  const values = new Map(Object.entries(initial));
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const context = vm.createContext({
    window: {
      localStorage: storage,
      location: { hash: '', pathname: '/ideas', search: '' },
      history: { state: null, replaceState() {} },
      requestAnimationFrame(callback) { callback(); return 1; },
      cancelAnimationFrame() {},
      addEventListener() {}, removeEventListener() {},
    }, localStorage: storage,
    queueMicrotask, console, confirm: () => true,
  });
  const modules = new Map();
  function load(filename) {
    const absolute = path.resolve(filename);
    if (modules.has(absolute)) return modules.get(absolute).exports;
    const source = fs.readFileSync(absolute, 'utf8');
    const code = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
      },
      fileName: absolute,
    }).outputText;
    const loadedModule = { exports: {} };
    modules.set(absolute, loadedModule);
    const requireModule = (name) => {
      if (Object.hasOwn(overrides, name)) return overrides[name];
      const base = name.startsWith('@/') ? path.resolve(name.slice(2)) : path.resolve(path.dirname(absolute), name);
      const resolved = ['', '.ts', '.tsx'].map((suffix) => base + suffix).find((file) => fs.existsSync(file));
      if (!resolved) throw new Error(`Unexpected test import: ${name}`);
      return load(resolved);
    };
    const wrapper = vm.runInContext(`(function(require,module,exports){${code}\n})`, context, { filename: absolute });
    wrapper(requireModule, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return { load, values, storage, context };
}

// Runs actual component handlers with isolated React hook state and semantic
// element trees. This is controller coverage, not DOM/browser verification.
export function componentRuntime(initial = {}, options = {}) {
  let current;
  let dirty = false;
  let effects = [];
  const instances = new Map();
  const sameDeps = (left, right) => left && right && left.length === right.length && left.every((item, index) => Object.is(item, right[index]));
  const react = {
    useId() {
      return `test-id-${current.cursor++}`;
    },
    useState(initialValue) {
      const instance = current;
      const index = instance.cursor++;
      if (!(index in instance.hooks)) instance.hooks[index] = typeof initialValue === 'function' ? initialValue() : initialValue;
      return [instance.hooks[index], (next) => {
        const value = typeof next === 'function' ? next(instance.hooks[index]) : next;
        if (!Object.is(value, instance.hooks[index])) { instance.hooks[index] = value; dirty = true; }
      }];
    },
    useRef(value) {
      const index = current.cursor++;
      return current.hooks[index] ??= { current: value };
    },
    useEffect(callback, deps) {
      const instance = current;
      const index = instance.cursor++;
      const previous = instance.hooks[index];
      if (!sameDeps(previous?.deps, deps)) {
        instance.hooks[index] = { deps };
        effects.push(() => { previous?.cleanup?.(); instance.hooks[index].cleanup = callback(); });
      }
    },
    useLayoutEffect(callback, deps) {
      const instance = current;
      const index = instance.cursor++;
      const previous = instance.hooks[index];
      if (!sameDeps(previous?.deps, deps)) {
        instance.hooks[index] = { deps };
        effects.push(() => { previous?.cleanup?.(); instance.hooks[index].cleanup = callback(); });
      }
    },
    useCallback(callback, deps) {
      const index = current.cursor++;
      if (!sameDeps(current.hooks[index]?.deps, deps)) current.hooks[index] = { deps, callback };
      return current.hooks[index].callback;
    },
    useSyncExternalStore(_subscribe, getSnapshot, getServerSnapshot) {
      return getServerSnapshot ? getServerSnapshot() : getSnapshot()
    },
  };
  const element = (type, props, key) => ({ type, props: props ?? {}, key });
  const navigation = { push: () => {}, replace: () => {}, ...options.navigation };
  const overrides = {
    react,
    'react/jsx-runtime': { jsx: element, jsxs: element, Fragment: 'fragment' },
    'next/link': { __esModule: true, default: 'a' },
    'next/navigation': { useRouter: () => navigation, useSearchParams: () => new URLSearchParams(options.query ?? '') },
    '@base-ui/react/alert-dialog': { AlertDialog: { Root: 'alert-dialog-root', Portal: 'portal', Backdrop: 'alert-dialog-backdrop', Popup: 'alert-dialog-popup', Title: 'alert-dialog-title', Description: 'alert-dialog-description' } },
    '@radix-ui/react-dialog': new Proxy({}, { get: (_, name) => `radix-dialog-${String(name)}` }),
    '@/components/arc/alert/alert': { Alert: ({ title, children, ...props }) => element('div', { ...props, role: 'alert', children: [title, children] }) },
    '@/components/arc/dialog/dialog': {
      Dialog: ({ children }) => element('div', { children }),
      DialogContent: ({ children, ...props }) => element('div', { ...props, children }),
    },
    '@/components/arc/toast-stack/toast-stack': { useToastStack: () => ({ toast() {} }), ToastStackProvider: 'div', ToastStack: 'div' },
    '@/components/arc/breadcrumb/breadcrumb': { Breadcrumb: 'nav' },
    '@/components/arc/copy-button/copy-button': { CopyButton: 'button' },
    '@/components/workspace/save-status': {
      SaveStatus: ({ status, error, ...props }) => element('p', {
        ...props,
        role: status === 'error' ? 'alert' : 'status',
        children: status === 'error'
          ? `${error || 'Could not save. Your latest changes are still on this page.'} Keep or copy your current text before leaving, then retry saving.`
          : ({ idle: 'Saved on this device', dirty: 'Unsaved changes', saving: 'Saving…', saved: 'Saved on this device' })[status],
      }),
    },
    '@/components/ideas/idea-capture-context': { useIdeaCapture: () => ({ openCapture() {} }), IdeaCaptureProvider: 'div' },
    // Rail gestures and layout are exercised in Edge; keep controller tests
    // focused on Home's records and handlers without simulating browser motion.
    '@/components/home/horizontal-card-rail': { HorizontalCardRail: ({ children, label }) => element('div', { role: 'region', 'aria-label': label, children }) },
    'lucide-react': new Proxy({}, { get: (_, name) => `icon-${String(name)}` }),
    '@/components/ui/button': { Button: 'button', buttonVariants: () => '' },
    '@/components/ui/input': { Input: 'input' },
    '@/components/ui/select': { Select: 'select' },
    '@/components/arc/segmented-control/segmented-control': { __esModule: true, default: 'div' },
    'motion/react': { AnimatePresence: ({ children }) => children, motion: new Proxy({}, { get: (_, name) => name === 'create' ? (component) => component : `motion-${String(name)}` }), useReducedMotion: () => true },
    '@/components/ui/textarea': { Textarea: 'textarea' },
    '@/lib/utils': { cn: (...values) => values.filter(Boolean).join(' ') },
    '@/lib/format': { formatDateTime: () => 'date', formatDate: () => 'date', formatRelativeTime: () => 'date' },
  };
  const runtime = localRuntime(initial, overrides);
  const repository = runtime.load('lib/workspace/repository.ts');
  overrides['@/hooks/use-workspace'] = {
    notifyWorkspaceChanged() {},
    useContentItem(id) {
      const result = repository.getContent(id);
      const source = result.ok && result.data?.sourceIdeaId ? repository.getIdea(result.data.sourceIdeaId) : null;
      return { status: result.ok ? 'ready' : 'error', item: result.ok ? result.data : null,
        error: result.ok ? null : result.error, sourceIdea: source?.ok ? source.data : null,
        sourceMissing: Boolean(source?.ok && !source.data), reload() {} };
    },
    useIdea(id) {
      const result = id ? repository.getIdea(id) : { ok: true, data: null };
      return { status: result.ok ? 'ready' : 'error', idea: result.ok ? result.data : null, error: result.ok ? null : result.error, reload() {} };
    },
  };
  function expand(node, location = 'root') {
    if (Array.isArray(node)) return node.map((child, index) => expand(child, `${location}/${index}`));
    if (!node || typeof node !== 'object') return node;
    if (typeof node.type === 'function') {
      const id = `${location}:${node.type.name}:${node.key ?? ''}`;
      const instance = instances.get(id) ?? { hooks: [], cursor: 0 };
      instances.set(id, instance);
      instance.cursor = 0;
      current = instance;
      return expand(node.type(node.props), `${id}/result`);
    }
    return { ...node, props: { ...node.props, children: expand(node.props.children, `${location}/children`) } };
  }
  let root;
  let tree;
  async function render() {
    for (let count = 0; count < 15; count++) {
      dirty = false;
      effects = [];
      tree = expand(root);
      for (const effect of effects) effect();
      await Promise.resolve();
      if (!dirty) return tree;
    }
    throw new Error('Component did not settle');
  }
  function nodes(type) {
    const found = [];
    function visit(node) {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node || typeof node !== 'object') return;
      if (!type || node.type === type) found.push(node);
      visit(node.props.children);
    }
    visit(tree);
    return found;
  }
  return { ...runtime, nodes, render,
    async mount(filename, name, props = {}) { root = element(runtime.load(filename)[name], props); return render(); },
    async click(label) {
      const button = nodes('button').find((node) => elementText(node).trim() === label);
      if (!button) throw new Error(`Button missing: ${label}`);
      if (button.props.disabled) throw new Error(`Button disabled: ${label}`);
      await button.props.onClick();
      return render();
    },
    async change(type, value, index = 0) { nodes(type)[index].props.onChange({ target: { value } }); return render(); },
    text: () => elementText(tree),
  };
}

export function elementText(node) {
  if (Array.isArray(node)) return node.map(elementText).join('');
  if (!node || typeof node === 'boolean') return '';
  if (typeof node !== 'object') return String(node);
  return elementText(node.props.children);
}
