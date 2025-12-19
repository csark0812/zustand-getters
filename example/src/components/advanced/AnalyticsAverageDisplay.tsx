import { memo } from 'react';
import { useAdvancedAnalyticsStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const AnalyticsAverageDisplay = memo(function AnalyticsAverageDisplay() {
  const average = useAdvancedAnalyticsStore((state) => state.average);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #3f51b5', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 Average renders: {renderCount}
      </div>
      <div>
        Average: <strong>{average.toFixed(2)}</strong>
      </div>
    </div>
  );
});
