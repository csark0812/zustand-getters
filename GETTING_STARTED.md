# Getting Started with @csark0812/zustand-getters

This guide will help you get started with the @csark0812/zustand-getters middleware quickly.

## Installation

First, install the package:

```bash
bun add zustand @csark0812/zustand-getters
# or
npm install zustand @csark0812/zustand-getters
```

## Basic Example

Here's a simple counter store with reactive JavaScript getters:

```typescript
import { create } from 'zustand';
import { getters } from '@csark0812/zustand-getters';

export const useCounterStore = create(
  getters((set) => ({
    count: 0,
    // Reactive getter - automatically updates React components!
    get double() {
      return this.count * 2;
    },
    increment: () =>
      set((state) => ({
        ...state,
        count: state.count + 1,
      })),
    decrement: () =>
      set((state) => ({
        ...state,
        count: state.count - 1,
      })),
  })),
);
```

### Using in React Components

```typescript
function Counter() {
  // Selecting the getter makes this component reactive
  const double = useCounterStore((state) => state.double);
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);

  return (
    <div>
      <h1>Count: {count}</h1>
      <h2>Double: {double}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

When `count` changes, the `double` getter automatically triggers a re-render!

## Running the Example App

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   cd example && bun install
   ```
3. Run the development server:
   ```bash
   bun run dev
   ```
4. Open your browser to `http://localhost:5173`

## Building the Middleware

To build the middleware library:

```bash
bun run build
```

This will create the distributable files in the `dist/` directory.

## Next Steps

- Read the full [README](./README.md) for advanced usage
- Check out the [example app](./example) for more examples
- Explore custom getters and filtering options

## Common Patterns

### User Store with Derived Getters

```typescript
const useUserStore = create(
  getters((set) => ({
    firstName: 'John',
    lastName: 'Doe',
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

### Shopping Cart with Derived Calculations

```typescript
const useCartStore = create(
  getters((set) => ({
    items: [] as Array<{ name: string; price: number; quantity: number }>,
    taxRate: 0.08,
    // All these getters automatically update React!
    get subtotal() {
      return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    get tax() {
      return this.subtotal * this.taxRate;
    },
    get total() {
      return this.subtotal + this.tax;
    },
    addItem: (name: string, price: number) =>
      set((state) => ({
        ...state,
        items: [...state.items, { name, price, quantity: 1 }],
      })),
  })),
);
```

## Support

- Open an issue on [GitHub](https://github.com/csark0812/zustand-getters/issues)
- Check the [documentation](./README.md)
- Review the [examples](./example)
