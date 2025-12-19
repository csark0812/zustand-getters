import { memo } from 'react';
import { useTodoStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const TodoActiveCountDisplay = memo(function TodoActiveCountDisplay() {
  const activeCount = useTodoStore((state) => state.activeCount);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #ff9800', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 ActiveCount renders: {renderCount}
      </div>
      <div>
        Active: <strong style={{ color: '#ff9800' }}>{activeCount}</strong>
      </div>
    </div>
  );
});
