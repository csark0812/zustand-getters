import { useState, useEffect } from 'react';
import { useAdvancedAnalyticsStore } from '../../store';
import { AnalyticsDisplay } from './AnalyticsDisplay';

export function AdvancedAnalyticsExample() {
  const [autoGenerate, setAutoGenerate] = useState(false);

  const timeRange = useAdvancedAnalyticsStore((state) => state.timeRange);
  const threshold = useAdvancedAnalyticsStore((state) => state.threshold);
  const addDataPoint = useAdvancedAnalyticsStore((state) => state.addDataPoint);
  const setTimeRange = useAdvancedAnalyticsStore((state) => state.setTimeRange);
  const setThreshold = useAdvancedAnalyticsStore((state) => state.setThreshold);
  const clearData = useAdvancedAnalyticsStore((state) => state.clearData);

  // Auto-generate data points
  useEffect(() => {
    if (autoGenerate) {
      const interval = setInterval(() => {
        addDataPoint(Math.random() * 100);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [autoGenerate, addDataPoint]);

  return (
    <div className="example-section">
      <div className="card">
        <h2>5. Analytics Dashboard (without immer)</h2>

        <div style={{ margin: '1em 0' }}>
          <button onClick={() => addDataPoint(Math.random() * 100)}>Add Random Data Point</button>
          <button
            onClick={() => setAutoGenerate(!autoGenerate)}
            style={{ marginLeft: '0.5em' }}
            className={autoGenerate ? 'tab-active' : ''}
          >
            {autoGenerate ? '⏸ Stop' : '▶ Auto-Generate'}
          </button>
          <button onClick={clearData} style={{ marginLeft: '0.5em' }}>
            Clear Data
          </button>
        </div>

        <div style={{ margin: '1.5em 0' }}>
          <div style={{ marginBottom: '0.5em' }}>
            <label>
              Time Range: {timeRange / 1000}s
              <input
                type="range"
                min="5000"
                max="60000"
                step="5000"
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                style={{ marginLeft: '1em' }}
              />
            </label>
          </div>
          <div>
            <label>
              Threshold: {threshold}
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                style={{ marginLeft: '1em' }}
              />
            </label>
          </div>
        </div>

        <AnalyticsDisplay />

        <div className="info-display">
          <strong>Complex Nested Getters:</strong>
          <pre style={{ textAlign: 'left', fontSize: '0.75em' }}>
            {`get filteredData() {
  const cutoff = Date.now() - this.timeRange;
  return this.dataPoints.filter(dp => dp.timestamp >= cutoff);
}
get average() {
  if (this.filteredData.length === 0) return 0;
  return this.filteredData.reduce((sum, dp) => 
    sum + dp.value, 0) / this.filteredData.length;
}
get variance() {
  const avg = this.average; // References another getter!
  return this.filteredData.reduce((sum, dp) => 
    sum + Math.pow(dp.value - avg, 2), 0) / 
    this.filteredData.length;
}
get standardDeviation() {
  return Math.sqrt(this.variance); // Chained!
}`}
          </pre>
          <p>✨ Complex computation chains with getters referencing other getters</p>
        </div>
      </div>
    </div>
  );
}
