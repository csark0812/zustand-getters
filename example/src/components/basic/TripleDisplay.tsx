import { memo } from 'react';
import { useBasicCounterStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const TripleDisplay = memo(function TripleDisplay() {
  const triple = useBasicCounterStore((state) => state.triple);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #2196f3', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 Triple renders: {renderCount}
      </div>
      <div>
        Triple: <strong style={{ color: '#2196f3' }}>{triple}</strong>
      </div>
    </div>
  );
});
