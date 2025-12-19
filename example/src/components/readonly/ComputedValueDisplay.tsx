import { memo } from 'react';
import { useReadonlyDemoStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const ComputedValueDisplay = memo(function ComputedValueDisplay() {
  const computedValue = useReadonlyDemoStore((state) => state.computedValue);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '2px solid #f44336', padding: '1em', margin: '1em 0' }}>
      <div style={{ fontSize: '0.8em', color: '#888', marginBottom: '0.5em' }}>
        🔄 Component renders: {renderCount}
      </div>
      <div style={{ fontSize: '2em' }}>
        Computed Value: <strong style={{ color: '#f44336' }}>{computedValue}</strong>
      </div>
      <div style={{ fontSize: '0.9em', color: '#888', marginTop: '0.5em' }}>
        This is always value × 2
      </div>
    </div>
  );
});
