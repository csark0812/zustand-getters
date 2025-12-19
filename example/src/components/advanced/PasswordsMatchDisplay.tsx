import { memo } from 'react';
import { useAdvancedFormStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const PasswordsMatchDisplay = memo(function PasswordsMatchDisplay() {
  const doPasswordsMatch = useAdvancedFormStore((state) => state.doPasswordsMatch);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #e91e63', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 PasswordsMatch renders: {renderCount}
      </div>
      <div>Passwords Match: {doPasswordsMatch ? '✅' : '❌'} </div>
    </div>
  );
});
