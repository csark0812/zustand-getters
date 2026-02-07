/**
 * Test suite for stale getter values bug
 * 
 * This test reproduces and verifies the fix for the issue where getters
 * would return stale values when accessed through getState() after state updates.
 * 
 * Issue: Getters that access state properties via 'this' would return stale values
 * because the spread operator was evaluating getters and converting them to regular properties.
 */

import { create } from 'zustand';
import { getters } from './src/index';

console.log('🧪 Test Suite: Stale Getter Values Bug');
console.log('==========================================\n');

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, message: string) {
  testsRun++;
  if (condition) {
    console.log(`  ✅ ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ ${message}`);
    testsFailed++;
  }
}

// =============================================================================
// Test 1: Basic getter staleness - Simple conditional getter
// =============================================================================
console.log('Test 1: Basic Conditional Getter');
console.log('---------------------------------');

const getSystemTheme = (fallback: string) => fallback;

interface ThemeStore {
  preference: 'system' | 'light' | 'dark';
  themeId: string;
  setPreference: (value: 'system' | 'light' | 'dark') => void;
}

const useThemeStore = create<ThemeStore>()(
  getters((set) => ({
    preference: 'system',
    get themeId() {
      return this.preference === 'system' 
        ? getSystemTheme('light-default') 
        : this.preference;
    },
    setPreference: (value) => set({ preference: value }),
  }))
);

// Initial state should resolve system to light-default
let state = useThemeStore.getState();
assert(state.preference === 'system', 'Initial preference is "system"');
assert(state.themeId === 'light-default', 'Initial themeId resolves system to "light-default"');

// After updating to 'dark', getter should return 'dark'
state.setPreference('dark');
state = useThemeStore.getState();
assert(state.preference === 'dark', 'After update, preference is "dark"');
assert(state.themeId === 'dark', 'After update, themeId getter returns "dark" (not stale)');

// After updating to 'light', getter should return 'light'
state.setPreference('light');
state = useThemeStore.getState();
assert(state.preference === 'light', 'After second update, preference is "light"');
assert(state.themeId === 'light', 'After second update, themeId getter returns "light" (not stale)');

// After updating back to system, should resolve to light-default again
state.setPreference('system');
state = useThemeStore.getState();
assert(state.preference === 'system', 'After third update, preference is "system"');
assert(state.themeId === 'light-default', 'After third update, themeId resolves back to "light-default"');

console.log();

// =============================================================================
// Test 2: Chained getters - Getter depends on another getter
// =============================================================================
console.log('Test 2: Chained Getters');
console.log('------------------------');

interface ChainedStore {
  value: number;
  double: number;
  quadruple: number;
  setValue: (n: number) => void;
}

const useChainedStore = create<ChainedStore>()(
  getters((set) => ({
    value: 5,
    get double() {
      return this.value * 2;
    },
    get quadruple() {
      return this.double * 2; // Depends on another getter
    },
    setValue: (n) => set({ value: n }),
  }))
);

state = useChainedStore.getState();
assert(state.value === 5, 'Initial value is 5');
assert(state.double === 10, 'Initial double is 10');
assert(state.quadruple === 20, 'Initial quadruple is 20 (getter depending on getter)');

state.setValue(10);
state = useChainedStore.getState();
assert(state.value === 10, 'After update, value is 10');
assert(state.double === 20, 'After update, double is 20 (not stale)');
assert(state.quadruple === 40, 'After update, quadruple is 40 (chained getter not stale)');

console.log();

// =============================================================================
// Test 3: Multiple property access - Getter depends on multiple properties
// =============================================================================
console.log('Test 3: Multiple Property Access');
console.log('----------------------------------');

interface UserStore {
  firstName: string;
  lastName: string;
  age: number;
  fullName: string;
  displayName: string;
  updateFirstName: (name: string) => void;
  updateAge: (age: number) => void;
}

const useUserStore = create<UserStore>()(
  getters((set) => ({
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    get displayName() {
      return `${this.fullName} (${this.age})`;
    },
    updateFirstName: (name) => set({ firstName: name }),
    updateAge: (age) => set({ age }),
  }))
);

state = useUserStore.getState();
assert(state.fullName === 'John Doe', 'Initial fullName is "John Doe"');
assert(state.displayName === 'John Doe (30)', 'Initial displayName is "John Doe (30)"');

state.updateFirstName('Jane');
state = useUserStore.getState();
assert(state.fullName === 'Jane Doe', 'After firstName update, fullName is "Jane Doe"');
assert(state.displayName === 'Jane Doe (30)', 'After firstName update, displayName updates correctly');

state.updateAge(25);
state = useUserStore.getState();
assert(state.displayName === 'Jane Doe (25)', 'After age update, displayName updates correctly');

console.log();

// =============================================================================
// Test 4: Immediate access after set - Access within action
// =============================================================================
console.log('Test 4: Immediate Access After Set');
console.log('------------------------------------');

interface ImmediateStore {
  count: number;
  double: number;
  incrementAndCheck: () => { beforeDouble: number; afterDouble: number };
}

const useImmediateStore = create<ImmediateStore>()(
  getters((set, get) => ({
    count: 0,
    get double() {
      return this.count * 2;
    },
    incrementAndCheck: () => {
      const beforeDouble = get().double;
      set({ count: get().count + 1 });
      const afterDouble = get().double;
      return { beforeDouble, afterDouble };
    },
  }))
);

state = useImmediateStore.getState();
const result = state.incrementAndCheck();
assert(result.beforeDouble === 0, 'Before increment, double is 0');
assert(result.afterDouble === 2, 'Immediately after set, double is 2 (not stale)');

console.log();

// =============================================================================
// Test 5: Complex object comparison - Getter returns computed object
// =============================================================================
console.log('Test 5: Complex Object in Getter');
console.log('----------------------------------');

interface Item {
  id: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: Item[];
  summary: {
    total: number;
    itemCount: number;
  };
  addItem: (item: Item) => void;
  clear: () => void;
}

const useCartStore = create<CartStore>()(
  getters((set) => ({
    items: [],
    get summary() {
      return {
        total: this.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0),
      };
    },
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    clear: () => set({ items: [] }),
  }))
);

state = useCartStore.getState();
assert(state.summary.total === 0, 'Initial total is 0');
assert(state.summary.itemCount === 0, 'Initial itemCount is 0');

state.addItem({ id: '1', price: 10, quantity: 2 });
state = useCartStore.getState();
assert(state.summary.total === 20, 'After adding item, total is 20');
assert(state.summary.itemCount === 2, 'After adding item, itemCount is 2');

state.addItem({ id: '2', price: 5, quantity: 3 });
state = useCartStore.getState();
assert(state.summary.total === 35, 'After adding second item, total is 35');
assert(state.summary.itemCount === 5, 'After adding second item, itemCount is 5');

console.log();

// =============================================================================
// Test 6: Nested state updates - Getter with nested property access
// =============================================================================
console.log('Test 6: Nested Property Access');
console.log('--------------------------------');

interface Settings {
  theme: string;
  language: string;
}

interface NestedStore {
  settings: Settings;
  displayText: string;
  updateTheme: (theme: string) => void;
}

const useNestedStore = create<NestedStore>()(
  getters((set) => ({
    settings: { theme: 'light', language: 'en' },
    get displayText() {
      return `Theme: ${this.settings.theme}, Language: ${this.settings.language}`;
    },
    updateTheme: (theme) =>
      set((state) => ({
        settings: { ...state.settings, theme },
      })),
  }))
);

state = useNestedStore.getState();
assert(
  state.displayText === 'Theme: light, Language: en',
  'Initial displayText is "Theme: light, Language: en"'
);

state.updateTheme('dark');
state = useNestedStore.getState();
assert(
  state.displayText === 'Theme: dark, Language: en',
  'After theme update, displayText updates correctly'
);

console.log();

// =============================================================================
// Test 7: Subscription callback - Getter accessed in subscription
// =============================================================================
console.log('Test 7: Getter in Subscription Callback');
console.log('-----------------------------------------');

interface SubStore {
  value: number;
  doubled: number;
  setValue: (n: number) => void;
}

const useSubStore = create<SubStore>()(
  getters((set) => ({
    value: 1,
    get doubled() {
      return this.value * 2;
    },
    setValue: (n) => set({ value: n }),
  }))
);

let subscriptionDoubled: number | null = null;
const unsubscribe = useSubStore.subscribe((state) => {
  subscriptionDoubled = state.doubled;
});

state = useSubStore.getState();
state.setValue(5);

// Give subscription a moment to fire
setTimeout(() => {
  assert(
    subscriptionDoubled === 10,
    'Subscription callback receives updated getter value (not stale)'
  );
  unsubscribe();
  
  // =============================================================================
  // Summary
  // =============================================================================
  console.log();
  console.log('==========================================');
  console.log('Test Summary');
  console.log('==========================================');
  console.log(`Total tests: ${testsRun}`);
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log();

  if (testsFailed === 0) {
    console.log('🎉 All tests passed! The stale getter bug is fixed.');
    process.exit(0);
  } else {
    console.error('❌ Some tests failed. The bug may not be fully fixed.');
    process.exit(1);
  }
}, 100);
