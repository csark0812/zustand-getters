import { memo } from 'react';
import { useAdvancedAnalyticsStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const AnalyticsMaximumDisplay = memo(function AnalyticsMaximumDisplay() {
  const maximum = useAdvancedAnalyticsStore((state) => state.maximum);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #3f51b5', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 Maximum renders: {renderCount}
      </div>
      <div>
        Max: <strong>{maximum.toFixed(2)}</strong>
      </div>
    </div>
  );
});
