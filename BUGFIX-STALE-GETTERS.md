# Bug Fix: Stale Getter Values

## Issue Summary

Getters that accessed state properties via `this` would return stale values when accessed through `getState()` after state updates. The getter's `this` context appeared to be bound to an old state snapshot, causing it to read outdated property values.

## Root Cause

The bug was caused by using the JavaScript spread operator (`...`) when merging state updates:

```typescript
const mergedState = { ...actualState };
```

**Why this caused the bug:**
1. When you spread an object with getters, JavaScript **evaluates the getters** and converts them to regular properties
2. For example, if `actualState.themeId` was a getter that returned `"light-plus"`, the spread operation would:
   - Call the getter function
   - Get the result `"light-plus"`
   - Create a regular property `themeId: "light-plus"` in `mergedState`
3. The getter was permanently lost, replaced by a static property value
4. Subsequent accesses returned the frozen value instead of recomputing from current state

## Example of the Bug

```typescript
const useStore = create(
  getters((set) => ({
    preference: "system",
    get themeId() {
      return this.preference === "system" ? "light-plus" : this.preference;
    },
    setPreference: (value) => set({ preference: value }),
  }))
);

// Initial state
const state1 = useStore.getState();
console.log(state1.themeId); // "light-plus" ✅ Correct

// Update preference
state1.setPreference("dark-plus");

// Bug: Getter returns stale value
const state2 = useStore.getState();
console.log(state2.preference); // "dark-plus" ✅ Updated correctly
console.log(state2.themeId);    // "light-plus" ❌ STALE - should be "dark-plus"
```

## The Fix

Changed the state merging logic in `src/index.ts` to preserve property descriptors instead of spreading:

### Before (Buggy Code):
```typescript
const mergedState = { ...actualState };

for (const key in nextState) {
  if (Object.prototype.hasOwnProperty.call(nextState, key)) {
    const originalDescriptor = Object.getOwnPropertyDescriptor(actualState, key);
    
    if (originalDescriptor && typeof originalDescriptor.get === 'function') {
      Object.defineProperty(mergedState, key, originalDescriptor);
    } else {
      mergedState[key] = nextState[key];
    }
  }
}
```

### After (Fixed Code):
```typescript
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
```

### Key Changes:
1. **Use `Object.create()` and `Object.defineProperty()`** instead of spread operator
2. **Copy property descriptors** explicitly to preserve getters as getters
3. **Never evaluate getters** during state merging - they stay as getter functions
4. **Getters remain reactive** and always read from current state via `this`

## Test Coverage

Created comprehensive test suite in `test-stale-values.ts` covering:

1. ✅ Basic conditional getters
2. ✅ Chained getters (getter depending on another getter)
3. ✅ Multiple property access
4. ✅ Immediate access after state updates
5. ✅ Complex object returns from getters
6. ✅ Nested property access
7. ✅ Getter access in subscription callbacks

**All 30 tests pass** with the fix applied.

## Verification

### Before Fix:
```bash
$ node test-stale-getters.js
❌ BUG CONFIRMED: Getter returned stale value!
   Expected: "dark-plus"
   Got: "light-plus"
```

### After Fix:
```bash
$ npx tsx test-stale-values.ts
🎉 All tests passed! The stale getter bug is fixed.
Total tests: 30
✅ Passed: 30
❌ Failed: 0
```

## Impact

This fix ensures that:
- ✅ `getState().getterName` returns current values, not stale snapshots
- ✅ `useStore((state) => state.getterName)` returns current values in React hooks
- ✅ Subscription callbacks receive updated getter values
- ✅ Getters can safely depend on other getters (chaining)
- ✅ All existing functionality continues to work without regression

## Files Changed

- `src/index.ts` - Fixed state merging logic to preserve getter descriptors
- `test-stale-values.ts` - Comprehensive test suite for the bug (30 tests)
- `BUGFIX-STALE-GETTERS.md` - This documentation

## Technical Details

### JavaScript Property Descriptors

A getter is defined as a property descriptor with a `get` function:

```javascript
const descriptor = {
  get: function() { return this.value * 2; },
  enumerable: true,
  configurable: true
};
```

When you spread an object:
```javascript
const obj = { get computed() { return this.value * 2; } };
const spread = { ...obj }; // ❌ Evaluates getter, creates regular property
```

The `spread` object has:
```javascript
{
  computed: 4, // Regular property, not a getter!
  enumerable: true,
  writable: true,
  configurable: true
}
```

### Correct Approach

Use `Object.defineProperty()` to copy descriptors:
```javascript
const newObj = {};
const descriptor = Object.getOwnPropertyDescriptor(obj, 'computed');
Object.defineProperty(newObj, 'computed', descriptor); // ✅ Preserves getter
```

## Compatibility

This fix:
- ✅ Maintains backward compatibility
- ✅ Works with all Zustand middlewares (immer, devtools, persist, etc.)
- ✅ No API changes required
- ✅ All existing tests pass
