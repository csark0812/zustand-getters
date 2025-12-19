import { useBasicUserStore } from '../../store';
import { BasicUserComputedDisplay } from './BasicUserComputedDisplay';
import { useRenderCount } from '../useRenderCount';

export function BasicUserExample() {
  const renderCount = useRenderCount();

  const firstName = useBasicUserStore((state) => state.firstName);
  const lastName = useBasicUserStore((state) => state.lastName);
  const updateFirstName = useBasicUserStore((state) => state.updateFirstName);
  const updateLastName = useBasicUserStore((state) => state.updateLastName);

  return (
    <div className="example-section">
      <div className="card">
        <h2>2. Basic User Info (without immer)</h2>
        <div style={{ fontSize: '0.8em', color: '#888', marginBottom: '1em' }}>
          Parent renders: {renderCount}
        </div>

        <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', margin: '1em 0' }}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => updateFirstName(e.target.value)}
              style={{ margin: '0.5em', padding: '0.5em', display: 'block' }}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => updateLastName(e.target.value)}
              style={{ margin: '0.5em', padding: '0.5em', display: 'block' }}
            />
          </div>
        </div>

        <BasicUserComputedDisplay />

        <div className="info-display">
          <strong>Implementation:</strong>
          <pre style={{ textAlign: 'left', fontSize: '0.85em' }}>
            {`get fullName() { 
  return \`\${this.firstName} \${this.lastName}\`; 
}
get initials() { 
  return \`\${this.firstName[0]}\${this.lastName[0]}\`; 
}`}
          </pre>
          <p>
            ✨ Watch each component's render counter - only the components subscribing to changed
            getters rerender!
          </p>
        </div>
      </div>
    </div>
  );
}
