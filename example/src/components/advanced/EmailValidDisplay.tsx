import { memo } from 'react';
import { useAdvancedFormStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const EmailValidDisplay = memo(function EmailValidDisplay() {
  const isEmailValid = useAdvancedFormStore((state) => state.isEmailValid);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #e91e63', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 EmailValid renders: {renderCount}
      </div>
      <div>Email: {isEmailValid ? '✅' : '❌'} </div>
    </div>
  );
});
