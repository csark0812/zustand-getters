import { memo } from 'react';
import { useBasicUserStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const InitialsDisplay = memo(function InitialsDisplay() {
  const initials = useBasicUserStore((state) => state.initials);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #ff5722', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 Initials renders: {renderCount}
      </div>
      <div>
        Initials: <strong style={{ color: '#ff5722' }}>{initials}</strong>
      </div>
    </div>
  );
});
