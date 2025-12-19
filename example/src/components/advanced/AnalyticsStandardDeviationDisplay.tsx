import { memo } from 'react';
import { useAdvancedAnalyticsStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const AnalyticsStandardDeviationDisplay = memo(function AnalyticsStandardDeviationDisplay() {
  const standardDeviation = useAdvancedAnalyticsStore((state) => state.standardDeviation);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #3f51b5', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 StandardDeviation renders: {renderCount}
      </div>
      <div>
        Std Dev: <strong>{standardDeviation.toFixed(2)}</strong>
      </div>
    </div>
  );
});
