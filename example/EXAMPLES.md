# Zustand Getters - Comprehensive Examples

This example app demonstrates the `zustand-getters` middleware at various complexity levels, showcasing both standalone usage and integration with immer.

## Examples Overview

### Basic Examples (Without Immer)

#### 1. Basic Counter

- **File**: `store.ts` - `useBasicCounterStore`
- **Features**: Simple computed values (`double`, `triple`)
- **Demonstrates**: Basic getter reactivity, component-level render tracking

#### 2. Basic User Info

- **File**: `store.ts` - `useBasicUserStore`
- **Features**: String manipulation (`fullName`, `initials`)
- **Demonstrates**: Multiple getters depending on same state

### Intermediate Examples

#### 3. Shopping Cart (Without Immer)

- **File**: `store.ts` - `useIntermediateCartStore`
- **Features**: Chained getters for price calculations
- **Demonstrates**:
  - Getters depending on other getters
  - Complex array operations
  - Multi-step calculations (subtotal → discount → tax → total)

#### 4. Todo List (With Immer)

- **File**: `store.ts` - `useTodoStore`
- **Features**: Filtered views, aggregated stats
- **Demonstrates**:
  - Immer + getters middleware integration
  - Conditional filtering
  - Boolean computed properties

### Advanced Examples

#### 5. Analytics Dashboard (Without Immer)

- **File**: `store.ts` - `useAdvancedAnalyticsStore`
- **Features**: Statistical calculations, trend analysis
- **Demonstrates**:
  - Time-based filtering
  - Complex mathematical computations
  - Deeply nested getter chains (variance → standard deviation)
  - Real-time data processing

#### 6. Form Validation (With Immer)

- **File**: `store.ts` - `useAdvancedFormStore`
- **Features**: Multi-field validation, error aggregation
- **Demonstrates**:
  - Regex-based validation
  - Conditional logic in getters
  - Cross-field validation (password matching)
  - Error collection and reporting

### Special Examples

#### 7. Readonly Demo

- **File**: `store.ts` - `useReadonlyDemoStore`
- **Features**: Attempts to set getter values
- **Demonstrates**:
  - Getters are read-only computed properties
  - Assignment attempts don't change getter behavior
  - The immutable nature of JavaScript getters

## Key Concepts Demonstrated

### 1. Render Tracking

Each example includes isolated components that display their render counts, proving that:

- Components only rerender when their subscribed getters' dependencies change
- Getters are truly reactive
- Performance is maintained (no unnecessary rerenders)

### 2. Immer Integration

Examples show that the getters middleware works seamlessly with immer.

**Important**: Place `getters` **outside** (wrapping) `immer` for proper type inference:

```typescript
// ✅ Correct - getters wraps immer
const useTodoStore = create<TodoState>()(
  getters(
    immer((set) => ({
      todos: [] as Todo[],
      get filteredTodos() {
        /* ... */
      },
      addTodo: (text) =>
        set((state) => {
          state.todos.push({
            /* ... */
          }); // Immer mutation - void return is OK!
        }),
    })),
  ),
);

// ❌ Avoid - immer wrapping getters may cause type inference issues
const useTodoStore = create<TodoState>()(
  immer(
    getters((set) => ({
      /* ... */
    })),
  ),
);
```

### 3. Chained Getters

Getters can reference other getters:

```typescript
get subtotal() { return this.items.reduce(...); }
get discount() { return this.subtotal * this.discountPercent; }
get total() { return this.subtotal - this.discount + this.tax; }
```

### 4. Complex Computations

Getters can perform sophisticated operations:

- Array filtering and mapping
- Statistical calculations
- Regular expression validation
- Conditional logic

### 5. Readonly Behavior

The readonly demo proves that getters cannot be set:

- Attempting to assign to a getter doesn't change its behavior
- The getter function always executes when accessed
- This is a fundamental JavaScript property, not a middleware limitation

## Running the Examples

```bash
cd example
bun install
bun run dev
```

Navigate through the tabs to see each example in action. Interact with the controls and watch:

- Computed values update automatically
- Render counters show selective rerendering
- Complex calculations happen seamlessly
- The readonly demo shows getter immutability

## Best Practices Shown

1. **Type Safety**: All stores are fully typed with TypeScript
2. **Separation of Concerns**: Display components isolate computed value subscriptions
3. **Performance**: Only components using getters rerender
4. **Composition**: Getters can build on other getters
5. **Flexibility**: Works with or without immer
6. **Clarity**: Getter syntax is clean and intuitive
