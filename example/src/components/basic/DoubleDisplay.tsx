import { memo } from 'react';
import { useBasicCounterStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const DoubleDisplay = memo(function DoubleDisplay() {
  const double = useBasicCounterStore((state) => state.double);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #4caf50', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 Double renders: {renderCount}
      </div>
      <div>
        Double: <strong style={{ color: '#4caf50' }}>{double}</strong>
      </div>
    </div>
  );
});
