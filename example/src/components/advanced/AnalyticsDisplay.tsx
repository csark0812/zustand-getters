import { memo } from 'react';
import { AnalyticsFilteredDataCountDisplay } from './AnalyticsFilteredDataCountDisplay';
import { AnalyticsAverageDisplay } from './AnalyticsAverageDisplay';
import { AnalyticsMinimumDisplay } from './AnalyticsMinimumDisplay';
import { AnalyticsMaximumDisplay } from './AnalyticsMaximumDisplay';
import { AnalyticsAboveThresholdDisplay } from './AnalyticsAboveThresholdDisplay';
import { AnalyticsBelowThresholdDisplay } from './AnalyticsBelowThresholdDisplay';
import { AnalyticsStandardDeviationDisplay } from './AnalyticsStandardDeviationDisplay';
import { AnalyticsTrendDisplay } from './AnalyticsTrendDisplay';

export const AnalyticsDisplay = memo(function AnalyticsDisplay() {
  return (
    <div style={{ border: '2px solid #3f51b5', padding: '1em', margin: '1em 0' }}>
      <div style={{ fontSize: '0.85em', color: '#888', marginBottom: '0.5em' }}>
        ✅ Each component subscribes to a single computed getter
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5em' }}>
        <AnalyticsFilteredDataCountDisplay />
        <AnalyticsAverageDisplay />
        <AnalyticsMinimumDisplay />
        <AnalyticsMaximumDisplay />
        <AnalyticsAboveThresholdDisplay />
        <AnalyticsBelowThresholdDisplay />
        <AnalyticsStandardDeviationDisplay />
        <AnalyticsTrendDisplay />
      </div>
    </div>
  );
});
