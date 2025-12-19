# @csark0812/zustand-getters

[![NPM](https://img.shields.io/npm/v/@csark0812/zustand-getters.svg)](https://www.npmjs.com/package/@csark0812/zustand-getters)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@csark0812/zustand-getters)](https://bundlephobia.com/package/@csark0812/zustand-getters)
[![License](https://img.shields.io/npm/l/@csark0812/zustand-getters.svg)](https://github.com/csark0812/zustand-getters/blob/main/LICENSE)

A lightweight, TypeScript-friendly middleware for [Zustand](https://github.com/pmndrs/zustand) that makes regular JavaScript object getters reactive. Define derived values with `get propertyName()` and they automatically trigger React updates when accessed.

> **Why Vite in root?** Vite is used as the build tool to compile the TypeScript middleware into distributable JavaScript (ESM + CJS) with type definitions. It's not a web server here—just a fast, modern bundler for library builds.

## Why?

Writing reactive derived state in Zustand typically requires manual selectors or separate computed libraries. This middleware lets you use native JavaScript getters and makes them automatically reactive:

- ✨ Use regular JavaScript `get propertyName()` syntax
- 🔄 Automatic React updates when getter dependencies change
- ⚡ Plain values remain fast (not wrapped in proxies)
- 🎯 Works recursively for nested objects
- 📦 Tiny bundle size with zero dependencies (beyond Zustand)
- 🔒 Full TypeScript support

## Install

```bash
bun add @csark0812/zustand-getters
# or
npm install @csark0812/zustand-getters
# or
pnpm add @csark0812/zustand-getters
# or
yarn add @csark0812/zustand-getters
```

## Quick Start

```typescript
import { create } from 'zustand'
import { getters } from '@csark0812/zustand-getters'

interface CounterState {
  count: number
  double: number
  increment: () => void
}

const useStore = create<CounterState>()(
  getters((set) => ({
    count: 5,
    // Define a reactive getter - it automatically updates React when accessed!
    get double() {
      return this.count * 2
    },
    increment: () => set((state) => ({
      ...state,
      count: state.count + 1
    })),
  }))
)

// In React components
function Counter() {
  // Selecting the getter automatically makes this component reactive
  const double = useStore((state) => state.double)
  const count = useStore((state) => state.count)
  const increment = useStore((state) => state.increment)

  return (
    <div>
      <div>Count: {count}</div>
      <div>Double: {double}</div>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

// When count changes, components selecting 'double' automatically re-render!
```

## Features

### 🔄 Reactive JavaScript Getters

The middleware automatically wraps JavaScript object getters (defined with `get propertyName()`) to trigger React updates when accessed:

```typescript
interface StoreState {
  count: number
  step: number
  double: number
  triple: number
  countPlusStep: number
  increment: () => void
}

const useStore = create<StoreState>()(
  getters((set) => ({
    count: 0,
    step: 1,
    // These getters are now reactive!
    get double() {
      return this.count * 2;
    },
    get triple() {
      return this.count * 3;
    },
    get countPlusStep() {
      return this.count + this.step;
    },
    increment: () => set((state) => ({
      ...state,
      count: state.count + state.step,
    })),
  }))
);

// In your component, selecting a getter makes it reactive
function MyComponent() {
  const double = useStore((state) => state.double);
  // Re-renders automatically when count changes!
  return <div>{double}</div>;
}
```

### 🎯 Nested Object Support

Works recursively with nested objects:

```typescript
interface UserState {
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  setFirstName: (name: string) => void;
}

const useStore = create<UserState>()(
  getters((set) => ({
    firstName: 'Chris',
    lastName: 'Sarkissian',
    // Reactive getters combining fields
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    get initials() {
      return `${this.firstName[0]}${this.lastName[0]}`;
    },
    setFirstName: (name: string) =>
      set((state) => ({
        ...state,
        firstName: name,
      })),
    setLastName: (name: string) =>
      set((state) => ({
        ...state,
        lastName: name,
      })),
  })),
);
```

### ⚡ Performance Optimized

Only JavaScript getters are wrapped—plain values remain fast and untouched:

```typescript
const useStore = create(
  getters((set) => ({
    count: 5, // Plain value - not wrapped, very fast
    get double() {
      // Getter - wrapped for reactivity
      return this.count * 2;
    },
  })),
);
```

## API Reference

### `getters(stateCreator)`

The main middleware function that wraps all JavaScript object getters to make them reactive.

#### Parameters

- `stateCreator`: Your Zustand state creator function

#### Returns

A wrapped state creator with reactive getters.

#### How It Works

1. Detects all JavaScript getters in your state (properties defined with `get propertyName()`)
2. Wraps each getter to call `set(state => state)` when accessed, triggering React updates
3. Leaves plain values untouched for optimal performance
4. Works recursively for nested objects

### `createGetters()`

Alternative API for creating the middleware.

```typescript
const withGetters = createGetters<Store>();

const useStore = create<Store>()(
  withGetters((set) => ({
    // your state with getters
  })),
);
```

## Usage with Other Middleware

You can combine `@csark0812/zustand-getters` with other Zustand middleware:

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { getters } from '@csark0812/zustand-getters';

const useStore = create(
  devtools(
    persist(
      getters((set) => ({
        count: 0,
        get double() {
          return this.count * 2;
        },
        increment: () =>
          set((state) => ({
            ...state,
            count: state.count + 1,
          })),
      })),
      { name: 'counter-storage' },
    ),
  ),
);
```

### With Immer

When using with `immer`, place `getters` **outside** (wrapping) `immer` for proper type inference:

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { getters } from '@csark0812/zustand-getters';

interface TodoState {
  todos: { id: string; text: string; done: boolean }[];
  activeCount: number;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
}

// ✅ Correct - getters wraps immer
const useTodoStore = create<TodoState>()(
  getters(
    immer((set) => ({
      todos: [],
      get activeCount() {
        return this.todos.filter((t) => !t.done).length;
      },
      addTodo: (text) =>
        set((state) => {
          state.todos.push({ id: Date.now().toString(), text, done: false });
        }), // void return is OK with immer!
      toggleTodo: (id) =>
        set((state) => {
          const todo = state.todos.find((t) => t.id === id);
          if (todo) todo.done = !todo.done;
        }),
    })),
  ),
);
```

This ordering ensures that:

- TypeScript properly infers that `set` accepts void-returning functions (immer's signature)
- Getters work correctly with immer's draft state
- Full type safety is preserved

## TypeScript Support

Full TypeScript support with automatic type inference:

```typescript
interface Store {
  count: number;
  readonly double: number; // Getter property
  increment: () => void;
}

const useStore = create<Store>(
  getters((set) => ({
    count: 0,
    get double() {
      return this.count * 2;
    },
    increment: () => set((state) => ({
      ...state,
      count: state.count + 1,
    })),
  }))
);

// Type-safe access in components
function MyComponent() {
  const double = useStore((state) => state.double); // number
  const count = useStore((state) => state.count); // number
  return <div>{double}</div>;
}
```

## Examples

Check out the `example/` directory for a full React application demonstrating:

- Counter with reactive derived getters (double, triple, countPlusStep)
- User store with fullName and initials getters
- Shopping cart with automatic subtotal, tax, and total calculations
- Nested object support and performance optimization

To run the example:

```bash
# Install dependencies
bun install
cd example && bun install

# Run the example
bun run dev
```

## How It Works

The middleware wraps your state creator and:

1. Recursively traverses your state object
2. Detects JavaScript getters (properties defined with `get propertyName()`)
3. Wraps each getter to trigger `set(state => state)` when accessed
4. Leaves plain values and methods untouched for optimal performance
5. React components selecting wrapped getters automatically re-render when the underlying data changes

**Key Insight**: When a getter is accessed, it first triggers a state update via `set(state => state)`, then returns the computed value. This ensures React components using that getter are notified to re-render, but the getter still returns the current value immediately.

## Development & Debugging

See [DEBUG.md](./DEBUG.md) for a comprehensive debugging guide including:

- Development workflow
- Console logging techniques
- Browser debugging
- Common issues and solutions

Quick test:

```bash
bun run test
```

## Examples

The `example/` directory contains comprehensive demonstrations of the getters middleware at different complexity levels:

### 🎮 Interactive Demo

```bash
cd example
bun install
bun run dev
```

### 📚 Example Categories

**Basic Examples** (without immer)

- Simple counter with computed values (`double`, `triple`)
- User info with string manipulation (`fullName`, `initials`)

**Intermediate Examples**

- Shopping cart with chained getters (subtotal → discount → tax → total)
- Todo list with immer showing filtered views and stats

**Advanced Examples**

- Analytics dashboard with complex statistical calculations
- Form validation with cross-field validation and error aggregation

**Special Demos**

- Readonly demo proving getters cannot be set

Each example includes:

- 🔄 Render counters to demonstrate selective rerendering
- 📊 Isolated components showing getter reactivity
- 💡 Code snippets explaining the implementation
- ✨ Both immer and non-immer approaches

See [`example/EXAMPLES.md`](./example/EXAMPLES.md) for detailed documentation.

## Troubleshooting

### Getter not updating my component

**Problem:** Component doesn't re-render when getter dependencies change.

**Solution:** Make sure you're selecting the getter in your component:

```typescript
// ✅ Correct - selects the getter
const double = useStore((state) => state.double);

// ❌ Wrong - doesn't trigger updates
const store = useStore();
const double = store.double; // Won't update!
```

### TypeScript errors with immer

**Problem:** TypeScript complains about `set` returning void.

**Solution:** Place `getters` **outside** `immer`:

```typescript
// ✅ Correct
create<State>()(
  getters(
    immer((set) => ({
      /* ... */
    })),
  ),
);

// ❌ Wrong
create<State>()(
  immer(
    getters((set) => ({
      /* ... */
    })),
  ),
);
```

### Infinite loop or maximum call stack error

**Problem:** Getter creates infinite recursion.

**Solution:** Avoid circular dependencies in getters:

```typescript
// ❌ Bad - circular dependency
get a() { return this.b + 1; }
get b() { return this.a + 1; }

// ✅ Good - no circular dependency
get double() { return this.count * 2; }
get quadruple() { return this.double * 2; }
```

### Performance issues with complex getters

**Problem:** Getter computation is slow.

**Solution:** Optimize the computation itself or consider memoizing expensive operations outside the getter:

```typescript
// Optimize the computation
get filteredItems() {
  // Use efficient algorithms
  return this.items.filter(/* optimized filter */);
}
```

### Getter returns wrong value after state update

**Problem:** State updated but getter shows old value.

**Solution:** Use immutable updates (follow Zustand best practices):

```typescript
// ✅ Correct - immutable update
increment: () =>
  set((state) => ({
    ...state,
    count: state.count + 1,
  }));

// ❌ Wrong - mutation
increment: () => {
  this.count++; // Don't mutate!
  set((state) => state);
};
```

### Still having issues?

1. Check the [examples directory](./example) for working code
2. Search [existing issues](https://github.com/csark0812/zustand-getters/issues)
3. Open a [new issue](https://github.com/csark0812/zustand-getters/issues/new) with a minimal reproduction

## Comparison with zustand-computed

While [zustand-computed](https://github.com/chrisvander/zustand-computed) computes derived state eagerly on every state change, `@csark0812/zustand-getters` makes JavaScript getters reactive and lazy—they only trigger updates when accessed by a React component. This provides:

- **Lazy evaluation**: Getters only compute when needed
- **Native syntax**: Use standard `get propertyName()` syntax
- **Performance**: Plain values remain fast, only getters are wrapped
- **Simplicity**: No separate computed config needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request at [https://github.com/csark0812/zustand-getters](https://github.com/csark0812/zustand-getters).

## License

MIT © Christopher Sarkissian

## Credits

Inspired by [zustand-computed](https://github.com/chrisvander/zustand-computed) by @chrisvander.
