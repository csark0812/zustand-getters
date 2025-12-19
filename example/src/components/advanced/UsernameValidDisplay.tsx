import { memo } from 'react';
import { useAdvancedFormStore } from '../../store';
import { useRenderCount } from '../useRenderCount';

export const UsernameValidDisplay = memo(function UsernameValidDisplay() {
  const isUsernameValid = useAdvancedFormStore((state) => state.isUsernameValid);
  const renderCount = useRenderCount();

  return (
    <div style={{ border: '1px solid #e91e63', padding: '0.5em', margin: '0.25em 0' }}>
      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '0.25em' }}>
        🔄 UsernameValid renders: {renderCount}
      </div>
      <div>Username: {isUsernameValid ? '✅' : '❌'} </div>
    </div>
  );
});
