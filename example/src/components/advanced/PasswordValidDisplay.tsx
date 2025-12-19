import { memo } from 'react';
import { useAdvancedFormStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const PasswordValidDisplay = memo(function PasswordValidDisplay() {
  const isPasswordValid = useAdvancedFormStore((state) => state.isPasswordValid);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #e91e63', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 PasswordValid renders: {renderCount}
      </div>
      <div>Password: {isPasswordValid ? '✅' : '❌'} </div>
    </div>
  );
});
