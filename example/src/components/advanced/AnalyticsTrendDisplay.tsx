import { memo } from 'react';
import { useAdvancedAnalyticsStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const AnalyticsTrendDisplay = memo(function AnalyticsTrendDisplay() {
  const trend = useAdvancedAnalyticsStore((state) => state.trend);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #3f51b5', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 Trend renders: {renderCount}
      </div>
      <div>
        Trend:{' '}
        <strong
          style={{
            color: trend === 'increasing' ? '#4caf50' : trend === 'decreasing' ? '#f44336' : '#888',
          }}
        >
          {trend}
        </strong>
      </div>
    </div>
  );
});
