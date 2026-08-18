/**
 * Test persist + getters integration
 */

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { getters } from './src/index';

console.log('🧪 Testing persist + getters integration');
console.log('========================================\n');

class MockStorage implements StateStorage {
  private storage = new Map<string, string>();
  getItem(name: string): string | null {
    return this.storage.get(name) ?? null;
  }
  setItem(name: string, value: string): void {
    this.storage.set(name, value);
  }
  removeItem(name: string): void {
    this.storage.delete(name);
  }
}

const mockStorage = new MockStorage();
const getSystemThemeId = (fallback: string) => fallback;

interface ThemeStore {
  preference: 'system' | 'dark-plus' | 'light-plus';
  themeId: string;
  setThemeId: (value: 'system' | 'dark-plus' | 'light-plus') => void;
}

const useThemeStore = create<ThemeStore>()(
  persist(
    getters((set) => ({
      preference: 'system',
      get themeId() {
        return this.preference === 'system'
          ? getSystemThemeId('light-plus')
          : this.preference;
      },
      setThemeId: (value) => set({ preference: value }),
    })),
    {
      name: 'theme-persist-test',
      storage: createJSONStorage(() => mockStorage),
      partialize: (state) => ({ preference: state.preference }),
    }
  )
);

console.log('Test 1: Basic functionality');
let state = useThemeStore.getState();
console.log(`  preference: "${state.preference}", themeId: "${state.themeId}"`);
if (state.preference === 'system' && state.themeId === 'light-plus') {
  console.log('  ✅\n');
} else {
  console.error('  ❌\n');
  process.exit(1);
}

console.log('Test 2: Update and verify getter');
state.setThemeId('dark-plus');
state = useThemeStore.getState();
console.log(`  preference: "${state.preference}", themeId: "${state.themeId}"`);
if (state.preference === 'dark-plus' && state.themeId === 'dark-plus') {
  console.log('  ✅\n');
} else {
  console.error('  ❌\n');
  process.exit(1);
}

interface PersistGetterStore {
  typeBasePx: number;
  mode: string;
  setTypeBasePx: (px: number) => void;
}

function createPersistGetterStore(
  storage: StateStorage,
  extraOptions: { skipHydration?: boolean; name: string },
) {
  return create<PersistGetterStore>()(
    persist(
      getters((set) => ({
        typeBasePx: 16,
        setTypeBasePx: (px: number) => set({ typeBasePx: px }),
        get mode() {
          return 'dark';
        },
      })),
      {
        name: extraOptions.name,
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({ typeBasePx: state.typeBasePx }),
        skipHydration: extraOptions.skipHydration,
      },
    ),
  );
}

function assertIssue9Set(
  label: string,
  storage: StateStorage,
  extraOptions: { skipHydration?: boolean; name: string },
) {
  console.log(label);
  const useStore = createPersistGetterStore(storage, extraOptions);
  try {
    useStore.getState().setTypeBasePx(20);
  } catch (error) {
    console.error(`  ❌ setTypeBasePx threw ${error}\n`);
    process.exit(1);
  }

  const afterSet = useStore.getState();
  if (afterSet.typeBasePx !== 20) {
    console.error(`  ❌ typeBasePx is ${afterSet.typeBasePx}, expected 20\n`);
    process.exit(1);
  }
  if (afterSet.mode !== 'dark') {
    console.error(`  ❌ mode is ${afterSet.mode}, expected dark\n`);
    process.exit(1);
  }
  console.log('  ✅\n');
}

assertIssue9Set('Test 3: persist plus native getter with skipHydration (issue 9)', mockStorage, {
  name: 'demo-skip-hydration',
  skipHydration: true,
});

class AsyncMockStorage implements StateStorage {
  private storage = new Map<string, string>();
  getItem(name: string): Promise<string | null> {
    return Promise.resolve(this.storage.get(name) ?? null);
  }
  setItem(name: string, value: string): Promise<void> {
    this.storage.set(name, value);
    return Promise.resolve();
  }
  removeItem(name: string): Promise<void> {
    this.storage.delete(name);
    return Promise.resolve();
  }
}

assertIssue9Set('Test 4: persist plus native getter with async storage (issue 9)', new AsyncMockStorage(), {
  name: 'demo-async',
});

console.log('========================================');
console.log('✅ All persist integration tests passed!\n');
