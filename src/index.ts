import type { StateCreator, StoreMutatorIdentifier } from 'zustand';

// =============================================================================
// TYPE DEFINITIONS
// Following the "logger" pattern from Zustand's TypeScript Guide:
// https://zustand.docs.pmnd.rs/guides/typescript#common-recipes
//
// This is a TRUE PASSTHROUGH middleware - it doesn't modify the store API or
// add itself to the mutator chain. It simply passes through whatever Mps/Mcs
// the inner middleware provides. This enables proper type inference when used
// with other middlewares like immer.
// =============================================================================

/**
 * Public type signature for the getters middleware.
 *
 * This follows the logger middleware pattern - a pure passthrough that preserves
 * all type information from inner middlewares (like immer).
 *
 * @example
 * ```ts
 * // Without immer - set requires returning state
 * const useStore = create<State>()(
 *   getters((set) => ({
 *     count: 0,
 *     get double() { return this.count * 2; },
 *     increment: () => set(state => ({ ...state, count: state.count + 1 }))
 *   }))
 * );
 *
 * // With immer - place getters OUTSIDE immer for proper type inference
 * const useStore = create<State>()(
 *   getters(
 *     immer((set) => ({
 *       count: 0,
 *       get double() { return this.count * 2; },
 *       increment: () => set(state => { state.count++ })  // void return OK!
 *     }))
 *   )
 * );
 * ```
 */
type Getters = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
) => StateCreator<T, Mps, Mcs>;

/**
 * Internal implementation type.
 * Uses simple types for flexibility since the public type handles proper typing.
 */
type GettersImpl = <T>(storeInitializer: StateCreator<T, [], []>) => StateCreator<T, [], []>;

// =============================================================================
// IMPLEMENTATION
// =============================================================================

/**
 * Creates a Proxy that intercepts property access to detect and handle getters.
 * When a getter is accessed, it triggers a Zustand update for React reactivity.
 *
 * @param getCurrentState - Function to get the current state from Zustand
 * @param triggerUpdate - Function to call when a getter is accessed (triggers React updates)
 * @param getterCache - Shared cache for getter results to prevent infinite loops
 * @returns A Proxy that wraps the state with reactive getters
 */
function createReactiveProxy<T extends object>(
  getCurrentState: () => T,
  triggerUpdate: () => void,
  getterCache: Map<string | symbol, any>,
): T {
  // Cache for nested proxies to avoid creating new proxies on every access
  const nestedProxies = new WeakMap<object, object>();

  return new Proxy({} as T, {
    get(_, prop) {
      const currentState = getCurrentState();
      const descriptor = Object.getOwnPropertyDescriptor(currentState as object, prop);

      // Check if this property is a getter
      if (descriptor && typeof descriptor.get === 'function') {
        const cacheKey = String(prop);

        // Check if we have a cached result for this getter
        // The cache is cleared whenever state changes, so if it exists, it's valid
        if (getterCache.has(cacheKey)) {
          return getterCache.get(cacheKey);
        }

        // Trigger React update
        triggerUpdate();

        // Call the getter with current state as context
        const result = descriptor.get.call(currentState);

        // Cache the result if it's an array or object to prevent infinite loops
        // Primitives don't need caching since they're compared by value
        if (result && (typeof result === 'object' || Array.isArray(result))) {
          getterCache.set(cacheKey, result);
        }

        return result;
      }

      // For regular properties, get the value
      const value = currentState[prop as keyof T];

      // Recursively wrap nested objects (but not functions or arrays)
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        typeof value !== 'function'
      ) {
        // Check cache first
        if (!nestedProxies.has(value as object)) {
          nestedProxies.set(
            value as object,
            createReactiveProxy(
              () => getCurrentState()[prop as keyof T] as object,
              triggerUpdate,
              getterCache,
            ),
          );
        }
        return nestedProxies.get(value as object);
      }

      return value;
    },

    // Handle Object.keys(), for...in, etc.
    ownKeys() {
      const currentState = getCurrentState();
      return Reflect.ownKeys(currentState as object);
    },

    // Handle Object.getOwnPropertyDescriptor
    getOwnPropertyDescriptor(_, prop) {
      const currentState = getCurrentState();
      return Reflect.getOwnPropertyDescriptor(currentState as object, prop);
    },

    // Handle 'in' operator
    has(_, prop) {
      const currentState = getCurrentState();
      return prop in (currentState as object);
    },
  });
}

/**
 * Internal implementation of the getters middleware.
 *
 * This implementation:
 * 1. Wraps the `set` function to preserve getter descriptors
 * 2. Creates a reactive proxy that triggers updates when getters are accessed
 * 3. Properly forwards all parameters to the stateCreator
 *
 * The implementation uses loose typing (`any`) because:
 * - The public type signature handles proper type checking for users
 * - Middleware implementations need flexibility to work with the varied signatures
 *   that upstream middlewares (like immer) might provide
 * - This pattern is used by Zustand's own middlewares
 */
const gettersImpl: GettersImpl = (stateCreator) => (set, get, store) => {
  // We'll store the actual unwrapped state here
  let actualState: any;

  // Cache for getter results - shared across all proxy instances
  const getterCache = new Map<string | symbol, any>();

  // Function to clear the getter cache when state changes
  const clearCache = () => {
    getterCache.clear();
  };

  // Create a wrapper for set that updates our actualState reference
  // We preserve the original set's signature by forwarding parameters
  const wrappedSet = (partial: any, replace?: any) => {
    // Clear getter cache when state changes
    clearCache();

    // Compute the new state - handle both function and object partial
    const nextState = typeof partial === 'function' ? partial(actualState) : partial;

    // Handle void returns from immer-style updates
    // When using immer, the function mutates state and returns void
    if (nextState === undefined) {
      // Immer has already mutated the draft, Zustand's immer middleware handles this
      // We just need to call the original set to trigger the update
      set(partial, replace);
      return;
    }

    // Update our actualState reference with the new state
    // IMPORTANT: We must preserve getter descriptors that were lost during spread operations
    if (replace) {
      actualState = nextState;
    } else {
      // Create a new object by copying all property descriptors from actualState
      // This preserves getters instead of evaluating them
      const mergedState = Object.create(Object.getPrototypeOf(actualState));
      
      // Copy all properties from actualState with their descriptors
      for (const key of Object.keys(actualState)) {
        const descriptor = Object.getOwnPropertyDescriptor(actualState, key);
        if (descriptor) {
          Object.defineProperty(mergedState, key, descriptor);
        }
      }

      // Update properties from nextState, but preserve getters from actualState
      for (const key in nextState) {
        if (Object.prototype.hasOwnProperty.call(nextState, key)) {
          // Check if this property was a getter in the original actualState
          const originalDescriptor = Object.getOwnPropertyDescriptor(actualState, key);

          if (originalDescriptor && typeof originalDescriptor.get === 'function') {
            // Keep the getter from actualState - don't overwrite it
            // The getter will read from the updated state via 'this'
          } else {
            // Regular property - update with the new value
            Object.defineProperty(mergedState, key, {
              value: nextState[key],
              writable: true,
              enumerable: true,
              configurable: true,
            });
          }
        }
      }

      actualState = mergedState;
    }

    // Update Zustand's state - forward to original set
    if (replace) {
      set(actualState, true);
    } else {
      set(actualState);
    }
  };

  // Initialize state by calling the stateCreator with our wrapped set
  actualState = stateCreator(wrappedSet, get, store);

  // Return a Proxy that always reads from actualState
  // Pass the shared cache to the proxy
  return createReactiveProxy(
    () => actualState,
    () => set((currentState: any) => currentState),
    getterCache,
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Zustand middleware that makes regular JavaScript object getters reactive.
 *
 * This middleware uses a Proxy to intercept property access and detect getters.
 * When a getter is accessed, it triggers React updates. The Proxy always delegates
 * to the current state from Zustand, so it works correctly with immutable updates.
 *
 * Works with other middlewares like `immer`, `devtools`, `persist`, etc.
 *
 * @example
 * ```ts
 * // Basic usage without immer
 * const useStore = create<CounterState>()(
 *   getters((set) => ({
 *     count: 5,
 *     get double() { return this.count * 2; },
 *     increment: () => set(state => ({ ...state, count: state.count + 1 })),
 *   }))
 * );
 *
 * // With immer middleware - place getters OUTSIDE immer
 * const useStore = create<CounterState>()(
 *   getters(
 *     immer((set) => ({
 *       count: 5,
 *       get double() { return this.count * 2; },
 *       increment: () => set(state => { state.count++ }), // void return OK with immer!
 *     }))
 *   )
 * );
 *
 * // In a React component:
 * function MyComponent() {
 *   const double = useStore(state => state.double);
 *   const count = useStore(state => state.count);
 *   const increment = useStore(state => state.increment);
 *
 *   return (
 *     <div>
 *       Count: {count}, Double: {double}
 *       <button onClick={increment}>+</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const getters = gettersImpl as unknown as Getters;

/**
 * Alternative export for backwards compatibility
 */
export const createGetters = <T extends object>() => {
  return (stateCreator: StateCreator<T, [], []>) => getters(stateCreator);
};

export default getters;
