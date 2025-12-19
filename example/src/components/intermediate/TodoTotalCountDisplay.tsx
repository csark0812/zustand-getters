import { memo } from 'react';
import { useTodoStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const TodoTotalCountDisplay = memo(function TodoTotalCountDisplay() {
  const totalCount = useTodoStore((state) => state.totalCount);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #00bcd4', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 TotalCount renders: {renderCount}
      </div>
      <div>
        Total: <strong>{totalCount}</strong>
      </div>
    </div>
  );
});
