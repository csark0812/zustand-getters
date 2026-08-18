/**
 * Simple test file to verify the middleware works
 * Run with: bun run test.ts
 */

import { create } from 'zustand';
import { getters } from './src/index';

// Test 1: Basic reactive getters
console.log('Test 1: Basic Reactive Getters');
console.log('================================');

interface CounterState {
  count: number;
  double: number;
  triple: number;
  increment: () => void;
}

const useCounterStore = create<CounterState>()(
  getters((set) => ({
    count: 5,
    get double() {
      return this.count * 2;
    },
    get triple() {
      return this.count * 3;
    },
    increment: () =>
      set((state) => ({
        ...state,
        count: state.count + 1,
      })),
  })),
);

const state1 = useCounterStore.getState();
console.log('Initial count:', state1.count);
console.log('Initial double:', state1.double);
console.log('Initial triple:', state1.triple);

// Test that getters return correct values
if (state1.double === 10 && state1.triple === 15) {
  console.log('✅ Getters compute correctly');
} else {
  console.error('❌ Getters computation failed');
}

// Increment and check again
state1.increment();
const state1After = useCounterStore.getState();
console.log('After increment count:', state1After.count);
console.log('After increment double:', state1After.double);
console.log('After increment triple:', state1After.triple);

if (state1After.double === 12 && state1After.triple === 18) {
  console.log('✅ Getters update after state change');
} else {
  console.error('❌ Getters did not update correctly');
}

// Test 2: Getters with multiple fields
console.log('\nTest 2: Multiple Field Getters');
console.log('===============================');

interface UserState {
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  setFirstName: (name: string) => void;
}

const useUserStore = create<UserState>()(
  getters((set) => ({
    firstName: 'Chris',
    lastName: 'Sarkissian',
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
  })),
);

const state2 = useUserStore.getState();
console.log('Initial fullName:', state2.fullName);
console.log('Initial initials:', state2.initials);

if (state2.fullName === 'Chris Sarkissian' && state2.initials === 'CS') {
  console.log('✅ Getters work correctly');
} else {
  console.error('❌ Getters failed');
}

state2.setFirstName('John');
const state2After = useUserStore.getState();
console.log('After update fullName:', state2After.fullName);
console.log('After update initials:', state2After.initials);

if (state2After.fullName === 'John Sarkissian' && state2After.initials === 'JS') {
  console.log('✅ Getters update correctly');
} else {
  console.error('❌ Getters update failed');
}

// Test 3: Plain values remain untouched
console.log('\nTest 3: Performance Check');
console.log('=========================');

interface TestState {
  plainValue: number;
  computedValue: number;
}

const useTestStore = create<TestState>()(
  getters((_set) => ({
    plainValue: 42,
    get computedValue() {
      return this.plainValue * 2;
    },
  })),
);

const state3 = useTestStore.getState();
console.log('Plain value:', state3.plainValue);
console.log('Computed value:', state3.computedValue);

// Check that plain values are still directly accessible (not wrapped)
const plainDesc = Object.getOwnPropertyDescriptor(state3, 'plainValue');
const computedDesc = Object.getOwnPropertyDescriptor(state3, 'computedValue');

if (plainDesc && !plainDesc.get) {
  console.log('✅ Plain values are not wrapped');
} else {
  console.error('❌ Plain values were incorrectly wrapped');
}

if (computedDesc && computedDesc.get) {
  console.log('✅ Getters are wrapped');
} else {
  console.error('❌ Getters were not wrapped');
}

console.log('\nTest 4: getState snapshot stability');
console.log('==================================');

interface SnapshotState {
  count: number;
  double: number;
  increment: () => void;
}

const useSnapshotStore = create<SnapshotState>()(
  getters((set) => ({
    count: 1,
    get double() {
      return this.count * 2;
    },
    increment: () => set({ count: 2 }),
  })),
);

const snapshotA = useSnapshotStore.getState();
const snapshotB = useSnapshotStore.getState();
if (!Object.is(snapshotA, snapshotB)) {
  console.error('❌ getState returned a new object with no state change');
  process.exit(1);
}
if (snapshotA.count !== 1 || snapshotA.double !== 2) {
  console.error('❌ snapshot values are wrong before increment');
  process.exit(1);
}

snapshotA.increment();
const snapshotC = useSnapshotStore.getState();
const snapshotD = useSnapshotStore.getState();
if (Object.is(snapshotA, snapshotC)) {
  console.error('❌ getState kept the old object after increment');
  process.exit(1);
}
if (!Object.is(snapshotC, snapshotD)) {
  console.error('❌ getState returned a new object after increment with no further change');
  process.exit(1);
}
if (snapshotC.count !== 2 || snapshotC.double !== 4) {
  console.error('❌ snapshot values are wrong after increment');
  process.exit(1);
}
console.log('✅ getState keeps a stable snapshot until state changes');

console.log('\n🎉 All tests completed!');
console.log(
  '\nNote: To fully test reactivity, run the example app with: cd example && bun run dev',
);
