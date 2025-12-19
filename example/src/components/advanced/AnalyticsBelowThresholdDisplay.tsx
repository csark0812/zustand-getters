import { memo } from 'react';
import { useAdvancedAnalyticsStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const AnalyticsBelowThresholdDisplay = memo(function AnalyticsBelowThresholdDisplay() {
  const belowThreshold = useAdvancedAnalyticsStore((state) => state.belowThreshold);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #3f51b5', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 BelowThreshold renders: {renderCount}
      </div>
      <div>
        Below Threshold: <strong>{belowThreshold}</strong>
      </div>
    </div>
  );
});
