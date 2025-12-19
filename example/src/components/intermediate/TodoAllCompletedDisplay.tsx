import { memo } from 'react';
import { useTodoStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const TodoAllCompletedDisplay = memo(function TodoAllCompletedDisplay() {
  const allCompleted = useTodoStore((state) => state.allCompleted);
  const totalCount = useTodoStore((state) => state.totalCount);
  const renderCount = useRenderCount();

  if (!allCompleted || totalCount === 0) {
    return null;
  }

  return (
    <div style={{ border: '1px solid #4caf50', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 AllCompleted renders: {renderCount}
      </div>
      <div style={{ color: '#4caf50' }}>🎉 All tasks completed!</div>
    </div>
  );
});
