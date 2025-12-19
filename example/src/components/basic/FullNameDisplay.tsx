import { memo } from 'react';
import { useBasicUserStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const FullNameDisplay = memo(function FullNameDisplay() {
  const fullName = useBasicUserStore((state) => state.fullName);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #9c27b0', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 FullName renders: {renderCount}
      </div>
      <div>
        Full Name: <strong style={{ color: '#9c27b0' }}>{fullName}</strong>
      </div>
    </div>
  );
});
