import { useState } from 'react';
import { useBasicCounterStore } from '../../store';
import { ComputedDisplay } from './ComputedDisplay';
import { useRenderCount } from '../useRenderCount';

export function BasicCounterExample() {
  const renderCount = useRenderCount();

  const count = useBasicCounterStore((state) => state.count);
  const increment = useBasicCounterStore((state) => state.increment);
  const decrement = useBasicCounterStore((state) => state.decrement);
  const reset = useBasicCounterStore((state) => state.reset);

  return (
    <div className="example-section">
      <div className="card">
        <h2>1. Basic Counter (without immer)</h2>
        <div style={{ fontSize: '0.8em', color: '#888', marginBottom: '1em' }}>
          Parent renders: {renderCount}
        </div>

        <div className="counter-display">
          <div style={{ fontSize: '2em', marginBottom: '0.5em' }}>Count: {count}</div>
        </div>

        <div className="controls">
          <button onClick={decrement}>-1</button>
          <button onClick={reset}>Reset</button>
          <button onClick={increment}>+1</button>
        </div>

        <ComputedDisplay />

        <div className="info-display">
          <strong>Implementation:</strong>
          <pre style={{ textAlign: 'left', fontSize: '0.85em' }}>
            {`const useBasicCounterStore = create(
  getters((set) => ({
    count: 0,
    get double() { return this.count * 2; },
    get triple() { return this.count * 3; },
    increment: () => set(state => ({ 
      ...state, count: state.count + 1 
    }))
  }))
);`}
          </pre>
          <p>
            ✨ Watch each component's render counter - only the DoubleDisplay and TripleDisplay
            components rerender when you click buttons, not the parent!
          </p>
        </div>
      </div>
    </div>
  );
}
