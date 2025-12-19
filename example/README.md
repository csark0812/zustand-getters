# Zustand Getters - Live Examples

This is a comprehensive demonstration of the `zustand-getters` middleware showcasing reactive computed values at different complexity levels.

## Quick Start

```bash
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## What's Demonstrated

### 7 Complete Stores

1. **Basic Counter** (no immer) - Simple `double` and `triple` computed values
2. **Basic User** (no immer) - String manipulation with `fullName` and `initials`
3. **Shopping Cart** (no immer) - Chained getters for price calculations
4. **Todo List** (with immer) - Filtered views and aggregate statistics
5. **Analytics Dashboard** (no immer) - Complex statistical calculations
6. **Form Validation** (with immer) - Cross-field validation and error reporting
7. **Readonly Demo** - Proves getters cannot be set

### Key Features Shown

✅ **Reactive Getters** - Computed values update automatically when dependencies change  
✅ **Selective Rerendering** - Only components subscribing to getters rerender  
✅ **Chained Getters** - Getters can reference other getters  
✅ **Immer Integration** - Works seamlessly with immer middleware  
✅ **No Manual Subscriptions** - Just use `get propertyName()` syntax  
✅ **Readonly by Nature** - Attempting to set getters fails gracefully

## Interactive UI

### Tabs

- **Basic** - Simple examples for getting started
- **Intermediate** - More complex real-world scenarios
- **Advanced** - Sophisticated computations and validations
- **Readonly** - Demonstrates getter immutability

### Render Tracking

Each example includes **render counters** that prove:

- Parent components rerender when state changes
- Child components (subscribed only to getters) rerender when computed values change
- Getters are truly reactive and efficient

## Code Structure

```typescript
// Without immer
const useStore = create<State>()(
  getters((set) => ({
    value: 0,
    get double() {
      return this.value * 2;
    },
    increment: () =>
      set((state) => ({
        ...state,
        value: state.value + 1,
      })),
  })),
);

// With immer - place getters OUTSIDE immer for proper type inference
const useStore = create<State>()(
  getters(
    immer((set) => ({
      todos: [],
      get filtered() {
        return this.todos.filter((t) => !t.done);
      },
      addTodo: (text) =>
        set((state) => {
          state.todos.push({ text, done: false }); // void return OK with immer!
        }),
    })),
  ),
);
```

## Testing Reactivity

Try these interactions to see reactivity in action:

1. **Basic Counter**: Click increment → watch render counter in green box → only getter component rerenders
2. **Shopping Cart**: Add items → adjust discount/tax → see chained calculations update
3. **Todo List**: Add todos → change filter → see filtered view update (immer in action)
4. **Analytics**: Click "Auto-Generate" → adjust time range → watch stats recalculate in real-time
5. **Form**: Type in fields → watch validation indicators update instantly
6. **Readonly**: Click "Try to Set Getter" → see it doesn't change the computed value

## Best Practices Demonstrated

- **Type Safety**: All stores fully typed with TypeScript
- **Component Isolation**: Display components separate from controls
- **Performance**: Selective subscriptions prevent unnecessary rerenders
- **Clean Syntax**: Native `get` syntax is intuitive and readable
- **Middleware Composition**: Works with immer and other middlewares

## Documentation

- [`EXAMPLES.md`](./EXAMPLES.md) - Detailed documentation of each example
- [`../README.md`](../README.md) - Main library documentation
- [`../EXAMPLES_OVERVIEW.md`](../EXAMPLES_OVERVIEW.md) - High-level overview

## Learn More

This example demonstrates that `zustand-getters` makes computed state management:

- **Simple** - Use native JavaScript getter syntax
- **Reactive** - Automatic React updates when dependencies change
- **Performant** - Only computed components rerender
- **Flexible** - Works with or without immer

Ready to add reactive getters to your Zustand stores? Check out the [main README](../README.md) for installation and usage instructions!
