# Debugging Guide for zustand-getters

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Build the Package

```bash
bun run build
```

### 3. Run the Example App

```bash
cd example
bun install
bun run dev
```

Open http://localhost:5173 in your browser.

## Development Workflow

### Watch Mode (Auto-rebuild on changes)

```bash
# Terminal 1: Watch and rebuild the middleware
bun run dev

# Terminal 2: Run the example app
cd example && bun run dev
```

### Type Checking

```bash
# Check types without building
bun run typecheck

# Check types in example
cd example && bun run build
```

### Linting & Formatting

```bash
# Lint and auto-fix issues
bun run lint

# Format code
bun run format
```

## Debugging Techniques

### 1. Console Logging in the Middleware

Edit `src/index.ts` and add console logs:

```typescript
export const getters: GettersMiddleware = (stateCreator) => {
  return (set, get, store) => {
    const state = stateCreator(set, get, store);

    console.log('🔍 Initial state:', state);

    // Wrap all getters to make them reactive
    wrapAllGetters(state, () => set((currentState) => currentState));

    console.log('🔍 State after wrapping getters:', state);

    return state;
  };
};
```

### 2. Test in Example App

The example app (`example/src/App.tsx`) has several examples:

- Basic counter with reactive getters
- User store with fullName and initials getters
- Shopping cart with chained getters
- Todo list with immer integration

Add your own test cases in `example/src/store.ts`:

```typescript
export const useDebugStore = create<DebugStore>()(
  getters((set) => ({
    // Your test state here
    value: 'test',
    count: 0,
    // Reactive getter
    get double() {
      return this.count * 2;
    },
  })),
);
```

### 3. Inspect Store State

In the browser console:

```javascript
// Get the store
const store = window.useCounterStore || useCounterStore;

// Check current state
console.log(store.getState());

// Check available getters
console.log(Object.keys(store.getState()).filter((k) => k.startsWith('get')));

// Call a getter
console.log(store.getState().getCount());
```

### 4. React DevTools

1. Install React DevTools browser extension
2. Open DevTools → Components tab
3. Select a component using the store
4. View props and state in real-time

### 5. Zustand DevTools (Optional)

Add devtools middleware to debug state changes:

```typescript
import { devtools } from 'zustand/middleware';
import { getters } from '@csark0812/zustand-getters';

const useStore = create<Store>()(
  devtools(
    getters((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    })),
    { name: 'MyStore' },
  ),
);
```

Then open Redux DevTools extension to see state changes.

## Common Issues

### Issue: "Cannot find module"

**Solution:** Run `bun install` in both root and example directories

### Issue: Changes not reflecting

**Solution:**

1. Stop the dev server
2. Run `bun run build` in root
3. Restart example app

### Issue: Type errors

**Solution:**

1. Check `tsconfig.json` settings
2. Run `bun run typecheck`
3. Ensure Zustand version is compatible (^4.0.0 || ^5.0.0)

### Issue: ESLint/Prettier conflicts

**Solution:**

1. Run `bun run format` to format with Prettier
2. Run `bun run lint` to fix ESLint issues
3. Check `.vscode/settings.json` for editor config

### Issue: Getters not updating components

**Solution:**

1. Make sure you're selecting the getter in your component: `useStore((state) => state.myGetter)`
2. Verify the getter is defined with `get propertyName()` syntax
3. Check that the getter dependencies are being updated immutably
4. Log the wrapped getters (see technique #1)

## Testing Changes

### Manual Testing Checklist

- [ ] Build succeeds: `bun run build`
- [ ] Types are valid: `bun run typecheck`
- [ ] Linting passes: `bun run lint`
- [ ] Formatting is clean: `bun run format`
- [ ] Example app runs: `cd example && bun run dev`
- [ ] Getters work in browser console
- [ ] State updates trigger re-renders

### Test Different Scenarios

1. **Basic usage** - Simple getters with single dependencies
2. **Chained getters** - Getters that depend on other getters
3. **Nested objects** - Getters in nested object structures
4. **With other middleware** - devtools, persist, immer
5. **Complex computations** - Array operations, mathematical calculations

## Build Output

After running `bun run build`, check the `dist/` folder:

```
dist/
├── index.js       # ESM build
├── index.cjs      # CommonJS build
├── index.d.ts     # TypeScript types
└── index.d.ts.map # Source map for types
```

Verify the build:

```bash
# Check file sizes
ls -lh dist/

# Inspect the output
cat dist/index.js | head -20
```

## Publishing Checklist

Before publishing:

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped
- [ ] Build is clean
- [ ] Example app works with built version

## Need Help?

- Check the [README.md](./README.md) for usage examples
- Review [GETTING_STARTED.md](./GETTING_STARTED.md) for basics
- Look at the [example app](./example) for working code
- Open an issue on GitHub
