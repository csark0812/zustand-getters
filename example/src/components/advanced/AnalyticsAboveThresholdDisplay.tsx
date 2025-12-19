import { memo } from 'react';
import { useAdvancedAnalyticsStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const AnalyticsAboveThresholdDisplay = memo(function AnalyticsAboveThresholdDisplay() {
  const aboveThreshold = useAdvancedAnalyticsStore((state) => state.aboveThreshold);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #3f51b5', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 AboveThreshold renders: {renderCount}
      </div>
      <div>
        Above Threshold: <strong>{aboveThreshold}</strong>
      </div>
    </div>
  );
});
