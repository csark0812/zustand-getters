import { memo } from 'react';
import { DoubleDisplay } from './DoubleDisplay';
import { TripleDisplay } from './TripleDisplay';

export const ComputedDisplay = memo(function ComputedDisplay() {
  return (
    <div style={{ border: '2px solid #4caf50', padding: '1em', margin: '1em 0' }}>
      <div style={{ fontSize: '0.9em', marginBottom: '0.5em', color: '#888' }}>
        ✅ These components only subscribe to getters, not to count directly
      </div>
      <div style={{ fontSize: '1.5em' }}>
        <DoubleDisplay />
        <TripleDisplay />
      </div>
    </div>
  );
});
