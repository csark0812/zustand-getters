import { useState } from 'react';
import { useTodoStore } from '../../store';
import { TodoStats } from './TodoStats';

export function TodoExample() {
  const [newTodoText, setNewTodoText] = useState('');
  const filteredTodos = useTodoStore((state) => state.filteredTodos);
  const filter = useTodoStore((state) => state.filter);
  const addTodo = useTodoStore((state) => state.addTodo);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const setFilter = useTodoStore((state) => state.setFilter);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const toggleAll = useTodoStore((state) => state.toggleAll);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText);
      setNewTodoText('');
    }
  };

  return (
    <div className="example-section">
      <div className="card">
        <h2>4. Todo List with Immer</h2>

        <div style={{ margin: '1em 0' }}>
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            placeholder="What needs to be done?"
            style={{ padding: '0.7em', width: '300px', marginRight: '0.5em' }}
          />
          <button onClick={handleAddTodo}>Add Todo</button>
        </div>

        <div style={{ margin: '1em 0' }}>
          <button
            className={filter === 'all' ? 'tab-active' : ''}
            onClick={() => setFilter('all')}
            style={{ margin: '0 0.25em' }}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'tab-active' : ''}
            onClick={() => setFilter('active')}
            style={{ margin: '0 0.25em' }}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'tab-active' : ''}
            onClick={() => setFilter('completed')}
            style={{ margin: '0 0.25em' }}
          >
            Completed
          </button>
        </div>

        <TodoStats />

        <div style={{ maxWidth: '600px', margin: '1em auto' }}>
          {filteredTodos.length === 0 ? (
            <div style={{ color: '#888', padding: '2em' }}>No todos to show</div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.7em',
                  borderBottom: '1px solid #333',
                  gap: '0.5em',
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#888' : 'inherit',
                  }}
                >
                  {todo.text}
                </span>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            ))
          )}
        </div>

        <div className="controls">
          <button onClick={toggleAll}>Toggle All</button>
          <button onClick={clearCompleted}>Clear Completed</button>
        </div>

        <div className="info-display">
          <strong>Using Immer (getters wraps immer for proper types):</strong>
          <pre style={{ textAlign: 'left', fontSize: '0.8em' }}>
            {`const useTodoStore = create(
  getters(  // getters wraps immer
    immer((set) => ({
      todos: [],
      filter: 'all',
      get filteredTodos() {
        if (this.filter === 'active') 
          return this.todos.filter(t => !t.completed);
        // ...
        return this.todos;
      },
      addTodo: (text) => set(state => {
        state.todos.push({ /* ... */ }); // void OK!
      })
    }))
  )
);`}
          </pre>
          <p>✨ Place getters outside immer for proper TypeScript inference!</p>
        </div>
      </div>
    </div>
  );
}
