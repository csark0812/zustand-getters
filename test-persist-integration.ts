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

console.log('========================================');
console.log('✅ All persist integration tests passed!\n');
