/**
 * Comprehensive React component tests using happy-dom
 * 
 * Tests getter behavior in actual React components with:
 * - Hook with no selector: const { themeId } = useStore()
 * - Hook with selector: const themeId = useStore(s => s.themeId)
 * - Multiple re-renders
 * - Persist middleware integration
 */

import React, { useEffect, useState } from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { Window } from 'happy-dom';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { getters } from './src/index';

// Setup happy-dom
const window = new Window();
const document = window.document;
global.window = window as any;
global.document = document as any;

console.log('🧪 React Component Tests with happy-dom');
console.log('=========================================\n');

// Mock storage
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
  preference: 'system' | 'dark-plus' | 'light-plus' | 'academic-blue';
  themeId: string;
  setThemeId: (value: 'system' | 'dark-plus' | 'light-plus' | 'academic-blue') => void;
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
      name: 'theme-component-test',
      storage: createJSONStorage(() => mockStorage),
      partialize: (state) => ({ preference: state.preference }),
    }
  )
);

// Test 1: Component using hook with NO selector
function ThemeDisplayNoSelector() {
  const { preference, themeId, setThemeId } = useThemeStore();
  
  return (
    <div>
      <div data-testid="preference">Preference: {preference}</div>
      <div data-testid="themeId">ThemeId: {themeId}</div>
      <button onClick={() => setThemeId('dark-plus')}>Set Dark</button>
      <button onClick={() => setThemeId('academic-blue')}>Set Academic</button>
    </div>
  );
}

// Test 2: Component using hook WITH selector
function ThemeDisplayWithSelector() {
  const preference = useThemeStore((s) => s.preference);
  const themeId = useThemeStore((s) => s.themeId);
  const setThemeId = useThemeStore((s) => s.setThemeId);
  
  return (
    <div>
      <div data-testid="preference">Preference: {preference}</div>
      <div data-testid="themeId">ThemeId: {themeId}</div>
      <button onClick={() => setThemeId('light-plus')}>Set Light</button>
    </div>
  );
}

// Test 3: Component with multiple renders and effects
function ThemeDisplayWithEffects() {
  const { preference, themeId, setThemeId } = useThemeStore();
  const [renderCount, setRenderCount] = useState(0);
  
  useEffect(() => {
    setRenderCount(c => c + 1);
  }, [preference, themeId]);
  
  return (
    <div>
      <div data-testid="preference">Preference: {preference}</div>
      <div data-testid="themeId">ThemeId: {themeId}</div>
      <div data-testid="renderCount">Renders: {renderCount}</div>
      <button onClick={() => setThemeId('dark-plus')}>Update</button>
    </div>
  );
}

async function runTests() {
  console.log('Test 1: Component with hook (no selector)');
  console.log('------------------------------------------');
  
  // Reset store
  useThemeStore.getState().setThemeId('system');
  
  const { container } = render(<ThemeDisplayNoSelector />);
  
  // Check initial render
  let prefElement = container.querySelector('[data-testid="preference"]');
  let themeElement = container.querySelector('[data-testid="themeId"]');
  
  console.log('Initial render:');
  console.log(`  ${prefElement?.textContent}`);
  console.log(`  ${themeElement?.textContent}`);
  
  if (prefElement?.textContent === 'Preference: system' && 
      themeElement?.textContent === 'ThemeId: light-plus') {
    console.log('  ✅ Initial render correct\n');
  } else {
    console.error('  ❌ Initial render incorrect\n');
    process.exit(1);
  }
  
  // Click button to update
  const darkButton = container.querySelector('button');
  if (darkButton) {
    console.log('Clicking "Set Dark" button...');
    await act(async () => {
      darkButton.click();
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    console.log('After click, checking store state:');
    const storeState = useThemeStore.getState();
    console.log(`  Store preference: ${storeState.preference}`);
    console.log(`  Store themeId: ${storeState.themeId}`);
  }
  
  // Check after update
  prefElement = container.querySelector('[data-testid="preference"]');
  themeElement = container.querySelector('[data-testid="themeId"]');
  
  console.log('After clicking "Set Dark":');
  console.log(`  ${prefElement?.textContent}`);
  console.log(`  ${themeElement?.textContent}`);
  
  if (prefElement?.textContent === 'Preference: dark-plus' && 
      themeElement?.textContent === 'ThemeId: dark-plus') {
    console.log('  ✅ Component re-rendered with updated getter value\n');
  } else {
    console.error('  ❌ BUG! Getter value is stale after update\n');
    console.error(`     Expected ThemeId: dark-plus, Got: ${themeElement?.textContent}\n`);
    process.exit(1);
  }
  
  console.log('Test 2: Component with hook (with selector)');
  console.log('--------------------------------------------');
  
  // Reset store
  useThemeStore.getState().setThemeId('system');
  
  const { container: container2 } = render(<ThemeDisplayWithSelector />);
  
  prefElement = container2.querySelector('[data-testid="preference"]');
  themeElement = container2.querySelector('[data-testid="themeId"]');
  
  console.log('Initial render:');
  console.log(`  ${prefElement?.textContent}`);
  console.log(`  ${themeElement?.textContent}`);
  
  if (prefElement?.textContent === 'Preference: system' && 
      themeElement?.textContent === 'ThemeId: light-plus') {
    console.log('  ✅ Initial render correct\n');
  } else {
    console.error('  ❌ Initial render incorrect\n');
    process.exit(1);
  }
  
  // Click button
  const lightButton = container2.querySelector('button');
  if (lightButton) {
    await act(async () => {
      lightButton.click();
      await new Promise(resolve => setTimeout(resolve, 10));
    });
  }
  
  prefElement = container2.querySelector('[data-testid="preference"]');
  themeElement = container2.querySelector('[data-testid="themeId"]');
  
  console.log('After clicking "Set Light":');
  console.log(`  ${prefElement?.textContent}`);
  console.log(`  ${themeElement?.textContent}`);
  
  if (prefElement?.textContent === 'Preference: light-plus' && 
      themeElement?.textContent === 'ThemeId: light-plus') {
    console.log('  ✅ Selector-based hook works correctly\n');
  } else {
    console.error('  ❌ BUG! Selector-based hook has stale value\n');
    process.exit(1);
  }
  
  console.log('Test 3: Component with effects tracking re-renders');
  console.log('----------------------------------------------------');
  
  // Reset store
  useThemeStore.getState().setThemeId('system');
  
  const { container: container3 } = render(<ThemeDisplayWithEffects />);
  
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 10));
  });
  
  let renderElement = container3.querySelector('[data-testid="renderCount"]');
  console.log('After initial mount:');
  console.log(`  ${renderElement?.textContent}`);
  
  // Update
  const updateButton = container3.querySelector('button');
  if (updateButton) {
    await act(async () => {
      updateButton.click();
      await new Promise(resolve => setTimeout(resolve, 10));
    });
  }
  
  prefElement = container3.querySelector('[data-testid="preference"]');
  themeElement = container3.querySelector('[data-testid="themeId"]');
  renderElement = container3.querySelector('[data-testid="renderCount"]');
  
  console.log('After update:');
  console.log(`  ${prefElement?.textContent}`);
  console.log(`  ${themeElement?.textContent}`);
  console.log(`  ${renderElement?.textContent}`);
  
  if (prefElement?.textContent === 'Preference: dark-plus' && 
      themeElement?.textContent === 'ThemeId: dark-plus') {
    console.log('  ✅ Component re-rendered correctly with updated getter\n');
  } else {
    console.error('  ❌ BUG! Component did not re-render with correct getter value\n');
    process.exit(1);
  }
  
  console.log('=========================================');
  console.log('✅ All React component tests passed!\n');
  console.log('Getters work correctly in React components with:');
  console.log('  ✅ Hook with no selector');
  console.log('  ✅ Hook with selector');
  console.log('  ✅ Multiple re-renders');
  console.log('  ✅ Persist middleware integration\n');
}

runTests().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});
