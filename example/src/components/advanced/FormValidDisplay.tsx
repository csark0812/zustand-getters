import { memo } from 'react';
import { useAdvancedFormStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const FormValidDisplay = memo(function FormValidDisplay() {
  const isFormValid = useAdvancedFormStore((state) => state.isFormValid);
  const renderCount = useRenderCount();

  return (
    <div
      style={{
        border: '2px solid #e91e63',
        padding: '0.5em',
        margin: '0.25em 0',
        fontSize: '1.2em',
      }}
    >
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 FormValid renders: {renderCount}
      </div>
      <div>
        Form Valid: <strong>{isFormValid ? '✅' : '❌'}</strong>
      </div>
    </div>
  );
});
