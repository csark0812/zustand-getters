import { memo } from 'react';
import { useTodoStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const TodoCompletedCountDisplay = memo(function TodoCompletedCountDisplay() {
  const completedCount = useTodoStore((state) => state.completedCount);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #4caf50', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 CompletedCount renders: {renderCount}
      </div>
      <div>
        Completed: <strong style={{ color: '#4caf50' }}>{completedCount}</strong>
      </div>
    </div>
  );
});
