import { useState } from 'react';
import {
  BasicCounterExample,
  BasicUserExample,
  IntermediateCartExample,
  TodoExample,
  AdvancedAnalyticsExample,
  AdvancedFormExample,
  ReadonlyDemo,
} from './components';

function App() {
  const [activeTab, setActiveTab] = useState<'basic' | 'intermediate' | 'advanced' | 'readonly'>(
    'basic',
  );

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '2em' }}>
        <h1>Zustand Getters Middleware - Comprehensive Examples</h1>
        <p style={{ maxWidth: '800px', margin: '0 auto' }}>
          Demonstrating reactive computed values at different complexity levels, with and without
          immer, showing automatic rerenders and readonly behavior
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2em' }}>
        <button
          className={activeTab === 'basic' ? 'tab-active' : ''}
          onClick={() => setActiveTab('basic')}
          style={{ margin: '0 0.5em' }}
        >
          Basic Examples
        </button>
        <button
          className={activeTab === 'intermediate' ? 'tab-active' : ''}
          onClick={() => setActiveTab('intermediate')}
          style={{ margin: '0 0.5em' }}
        >
          Intermediate Examples
        </button>
        <button
          className={activeTab === 'advanced' ? 'tab-active' : ''}
          onClick={() => setActiveTab('advanced')}
          style={{ margin: '0 0.5em' }}
        >
          Advanced Examples
        </button>
        <button
          className={activeTab === 'readonly' ? 'tab-active' : ''}
          onClick={() => setActiveTab('readonly')}
          style={{ margin: '0 0.5em' }}
        >
          Readonly Demo
        </button>
      </div>

      {activeTab === 'basic' && (
        <>
          <BasicCounterExample />
          <BasicUserExample />
        </>
      )}

      {activeTab === 'intermediate' && (
        <>
          <IntermediateCartExample />
          <TodoExample />
        </>
      )}

      {activeTab === 'advanced' && (
        <>
          <AdvancedAnalyticsExample />
          <AdvancedFormExample />
        </>
      )}

      {activeTab === 'readonly' && <ReadonlyDemo />}
    </div>
  );
}

export default App;
