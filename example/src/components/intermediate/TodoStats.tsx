import { memo } from 'react';
import { TodoTotalCountDisplay } from './TodoTotalCountDisplay';
import { TodoActiveCountDisplay } from './TodoActiveCountDisplay';
import { TodoCompletedCountDisplay } from './TodoCompletedCountDisplay';
import { TodoAllCompletedDisplay } from './TodoAllCompletedDisplay';

export const TodoStats = memo(function TodoStats() {
  return (
    <div style={{ border: '2px solid #00bcd4', padding: '1em', margin: '1em 0' }}>
      <div style={{ fontSize: '0.85em', color: '#888', marginBottom: '0.5em' }}>
        ✅ Each component subscribes to a single computed getter
      </div>
      <div style={{ display: 'flex', gap: '2em', justifyContent: 'center', flexWrap: 'wrap' }}>
        <TodoTotalCountDisplay />
        <TodoActiveCountDisplay />
        <TodoCompletedCountDisplay />
      </div>
      <TodoAllCompletedDisplay />
    </div>
  );
});
