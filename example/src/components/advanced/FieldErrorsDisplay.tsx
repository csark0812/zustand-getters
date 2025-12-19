import { memo } from 'react';
import { useAdvancedFormStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const FieldErrorsDisplay = memo(function FieldErrorsDisplay() {
  const fieldErrors = useAdvancedFormStore((state) => state.fieldErrors);
  const renderCount = useRenderCount();

  if (fieldErrors.length === 0) {
    return null;
  }

  return (
    <div style={{ border: '1px solid #f44336', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 FieldErrors renders: {renderCount}
      </div>
      <div>
        <strong>Errors:</strong>
        {fieldErrors.map((error, i) => (
          <div key={i} style={{ color: '#f44336', fontSize: '0.9em' }}>
            • {error}
          </div>
        ))}
      </div>
    </div>
  );
});
