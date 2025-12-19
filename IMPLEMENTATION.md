# Implementation: Reactive JavaScript Getters for Zustand

## Overview

This document describes the implementation of the `zustand-getters` middleware that makes regular JavaScript object getters reactive in Zustand.

## Goal

Enable developers to write derived state using native JavaScript `get propertyName()` syntax, with automatic React component updates when the underlying data changes.

## Implementation Approach

### Core Concept

The middleware wraps JavaScript getters to trigger `set(state => state)` when accessed. This notifies Zustand's subscribers (React components) to re-evaluate their selectors, causing re-renders when values change.

### Key Insight

When a getter calls `set(state => state)`:

1. It schedules a React update (via Zustand's subscription system)
2. The getter still returns the current computed value immediately
3. React components using selectors that access this getter are notified
4. Components re-render if their selector's return value changed (per Zustand's equality check)

This creates lazy, reactive derived state without manual subscriptions or computed state management.

## Code Structure

### Main Function: `wrapAllGetters`

```typescript
function wrapAllGetters<T extends object>(obj: T, triggerUpdate: () => void): T {
  // Process each property in the object
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];

    // Recursively wrap nested objects (but skip functions)
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      wrapAllGetters(value, triggerUpdate);
    }

    // Check if this property is a getter
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (descriptor && typeof descriptor.get === 'function') {
      const originalGetter = descriptor.get;

      // Wrap the getter to trigger updates when accessed
      Object.defineProperty(obj, key, {
        get() {
          // Trigger update first (schedules React re-render)
          triggerUpdate();
          // Then return the computed value
          return originalGetter.call(this);
        },
        configurable: true,
        enumerable: descriptor.enumerable,
      });
    }
  }

  return obj;
}
```

### Middleware Implementation

```typescript
export const getters: GettersMiddleware = (stateCreator) => {
  return (set, get, store) => {
    const state = stateCreator(set, get, store);

    // Wrap all getters in the state to make them reactive
    wrapAllGetters(state, () => set((currentState) => currentState));

    return state;
  };
};
```

## How It Works

### 1. Detection Phase

- Uses `Object.getOwnPropertyDescriptor()` to inspect each property
- Identifies properties with a `get` function (JavaScript getters)
- Recursively processes nested objects

### 2. Wrapping Phase

- Replaces each getter with a wrapped version using `Object.defineProperty()`
- The wrapper:
  1. Calls `triggerUpdate()` → `set(state => state)`
  2. Calls the original getter and returns its value
- Preserves the original getter's enumerable property

### 3. Runtime Behavior

When a React component accesses a getter:

```typescript
function MyComponent() {
  const double = useStore((state) => state.counter.double);
  // ...
}
```

1. The selector function runs: `state => state.counter.double`
2. Accessing `.double` triggers the wrapped getter
3. The wrapper calls `set(state => state)`, notifying Zustand
4. The original getter computes and returns `this.count * 2`
5. Zustand checks if the selector's return value changed
6. If changed, the component re-renders with the new value

## Performance Considerations

### What Gets Wrapped

- ✅ JavaScript getters (defined with `get propertyName()`)
- ❌ Plain values (left untouched)
- ❌ Methods (left untouched)

### Why This Is Efficient

1. **Lazy Evaluation**: Getters only compute when accessed, not on every state change
2. **Minimal Overhead**: Only getters have wrapper overhead, plain values remain fast
3. **Zustand's Optimization**: Uses Zustand's built-in equality checking to prevent unnecessary re-renders
4. **No Proxies**: Direct property descriptor manipulation, no proxy overhead

## Usage Patterns

### Basic Example

```typescript
const useStore = create(
  getters((set) => ({
    count: 5,
    get double() {
      return this.count * 2;
    },
    increment: () =>
      set((state) => ({
        ...state,
        count: state.count + 1,
      })),
  })),
);
```

### Multiple Field Getters

```typescript
const useStore = create(
  getters((set) => ({
    firstName: 'Chris',
    lastName: 'Sarkissian',
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    get initials() {
      return `${this.firstName[0]}${this.lastName[0]}`;
    },
  })),
);
```

### Complex Derived State

```typescript
const useStore = create(
  getters((set) => ({
    items: [],
    taxRate: 0.08,
    get subtotal() {
      return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    get tax() {
      return this.subtotal * this.taxRate;
    },
    get total() {
      return this.subtotal + this.tax;
    },
  })),
);
```

## Testing

### Unit Tests

The implementation includes comprehensive tests (`test.ts`):

1. **Basic Reactivity**: Verifies getters compute correct values
2. **State Updates**: Confirms getters reflect state changes
3. **Nested Objects**: Tests recursive getter wrapping
4. **Performance**: Verifies plain values aren't wrapped

### Integration Tests

The example app (`example/src/`) provides real-world testing:

1. **Counter**: Tests numeric derived values
2. **User**: Tests string concatenation getters
3. **Shopping Cart**: Tests complex calculations with multiple getters

## Design Decisions

### Why `set(state => state)` Instead of Explicit Subscriptions?

**Benefits:**

- Leverages Zustand's existing subscription system
- No manual subscriber management needed
- Works seamlessly with Zustand's middleware ecosystem
- Minimal API surface

**Trade-off:**

- Getters trigger updates even if dependencies didn't change
- Mitigated by Zustand's equality checking in selectors

### Why Wrap at Creation Time?

**Benefits:**

- One-time setup cost
- Getters are always reactive once wrapped
- No runtime conditional logic needed

**Alternative Considered:**

- Wrapping on first access: More complex, same result

### Why Recursive Processing?

**Benefits:**

- Supports nested object structures naturally
- Matches common state organization patterns
- No depth limit

**Trade-off:**

- All getters are wrapped, even if never used
- Acceptable because wrapping is lightweight

## Compatibility

### Zustand Versions

- ✅ Zustand 4.x
- ✅ Zustand 5.x

### TypeScript

- Full type safety maintained
- Getter return types inferred automatically
- Works with `readonly` property declarations

### Other Middleware

Compatible with standard Zustand middleware:

- `devtools`
- `persist`
- `immer`
- Custom middleware

## Limitations & Considerations

### 1. Immutable Updates Required

Follow Zustand's best practices for state updates - use immutable patterns:

```typescript
// ✅ Good - immutable update
increment: () => set((state) => ({
  ...state,
  count: state.count + 1
}))

// ❌ Bad - mutation (won't work with Zustand)
increment() {
  this.count += 1
  set((state) => state)
}
```

### 2. Getter Access Triggers Updates

Every getter access triggers `set()`, even if dependencies unchanged. Zustand's equality checking prevents unnecessary re-renders, but the notification still occurs.

### 3. Arrays Are Not Recursively Processed

Arrays of objects aren't recursively wrapped. Top-level getters work fine:

```typescript
// ✅ Good - top-level getters work fine
const useStore = create(
  getters((set) => ({
    items: [],
    get count() {
      return this.items.length;
    },
  })),
);

// ❌ Getters inside array items won't be reactive
const useStore = create(
  getters((set) => ({
    items: [
      {
        value: 1,
        get doubled() {
          return this.value * 2; // Won't be wrapped
        },
      },
    ],
  })),
);
```

## Future Enhancements

### Possible Improvements

1. **Dependency Tracking**: Track which state properties a getter accesses, only trigger updates when those change
2. **Memoization**: Cache getter values, recompute only when dependencies change
3. **Array Support**: Extend recursive processing to arrays of objects
4. **Dev Tools**: Add debugging to visualize getter dependencies and updates

### API Stability

The current API is minimal and stable:

- Single function: `getters(stateCreator)`
- No configuration options (by design)
- Follows Zustand middleware conventions

## Conclusion

This implementation successfully makes JavaScript object getters reactive in Zustand through a simple, performant approach that:

- ✅ Uses native JavaScript syntax
- ✅ Integrates seamlessly with Zustand
- ✅ Maintains performance for plain values
- ✅ Supports nested objects
- ✅ Requires minimal API surface
- ✅ Works with existing Zustand middleware

The result is a developer-friendly way to write derived state that automatically updates React components without manual subscription management.
