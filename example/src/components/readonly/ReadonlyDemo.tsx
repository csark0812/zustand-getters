import { useState } from 'react';
import { useReadonlyDemoStore } from '../../store';
import { ComputedValueDisplay } from './ComputedValueDisplay';

export function ReadonlyDemo() {
  const [attemptCount, setAttemptCount] = useState(0);

  const value = useReadonlyDemoStore((state) => state.value);
  const lastError = useReadonlyDemoStore((state) => state.lastError);
  const setValue = useReadonlyDemoStore((state) => state.setValue);
  const attemptToSetGetter = useReadonlyDemoStore((state) => state.attemptToSetGetter);

  return (
    <div className="example-section">
      <div className="card">
        <h2>🔒 Readonly Demo - Getters Cannot Be Set</h2>

        <div style={{ fontSize: '1.5em', margin: '1.5em 0' }}>
          <div>
            Base Value: <strong>{value}</strong>
          </div>
        </div>

        <div style={{ margin: '1em 0' }}>
          <label>
            Set Base Value: {value}
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              style={{ marginLeft: '1em' }}
            />
          </label>
        </div>

        <ComputedValueDisplay />

        <div style={{ margin: '2em 0' }}>
          <h3>Try to Set the Computed Value:</h3>
          <p style={{ color: '#888' }}>
            Click below to attempt setting the getter to 999. Watch what happens!
          </p>
          <button
            onClick={() => {
              attemptToSetGetter(999);
              setAttemptCount((prev) => prev + 1);
            }}
            style={{ fontSize: '1.1em', padding: '0.8em 1.5em' }}
          >
            ⚠️ Try to Set Getter to 999
          </button>
          {attemptCount > 0 && (
            <div style={{ marginTop: '1em', color: '#888' }}>
              Attempts made: <strong>{attemptCount}</strong>
            </div>
          )}
        </div>

        {lastError && (
          <div
            style={{
              background: '#1a1a1a',
              border: '2px solid #f44336',
              padding: '1em',
              margin: '1em 0',
            }}
          >
            <div style={{ color: '#f44336', fontWeight: 'bold', marginBottom: '0.5em' }}>
              Result:
            </div>
            <div style={{ color: '#fff' }}>{lastError}</div>
          </div>
        )}

        <div className="info-display">
          <strong>How It Works:</strong>
          <pre style={{ textAlign: 'left', fontSize: '0.85em' }}>
            {`const useReadonlyDemoStore = create(
  getters((set) => ({
    value: 10,
    get computedValue() {
      return this.value * 2;
    },
    attemptToSetGetter: (n) => set(state => {
      try {
        // This won't change the getter's behavior!
        state.computedValue = n;
        return { ...state, lastError: 'No error thrown, but getter unchanged!' };
      } catch (error) {
        return { ...state, lastError: \`Error: \${error}\` };
      }
    })
  }))
);`}
          </pre>
          <p>
            ✨ Getters are <strong>computed properties</strong>, not assignable values. They always
            execute their function. Even if you try to assign to them, the getter function still
            runs when accessed!
          </p>
          <p style={{ marginTop: '1em' }}>
            The computed value will <strong>always</strong> be <code>value × 2</code> regardless of
            assignment attempts. This is the nature of JavaScript getters - they're read-only by
            definition.
          </p>
        </div>
      </div>
    </div>
  );
}
