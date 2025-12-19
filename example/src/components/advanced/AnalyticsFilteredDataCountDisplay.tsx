import { memo } from 'react';
import { useAdvancedAnalyticsStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const AnalyticsFilteredDataCountDisplay = memo(function AnalyticsFilteredDataCountDisplay() {
  const filteredData = useAdvancedAnalyticsStore((state) => state.filteredData);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #3f51b5', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 FilteredDataCount renders: {renderCount}
      </div>
      <div>
        Data Points: <strong>{filteredData.length}</strong>
      </div>
    </div>
  );
});
