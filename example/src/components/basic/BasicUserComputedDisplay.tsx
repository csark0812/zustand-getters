import { memo } from 'react';
import { FullNameDisplay } from './FullNameDisplay';
import { InitialsDisplay } from './InitialsDisplay';

export const BasicUserComputedDisplay = memo(function BasicUserComputedDisplay() {
  return (
    <div style={{ border: '2px solid #9c27b0', padding: '1em', margin: '1em 0' }}>
      <div style={{ fontSize: '1.5em' }}>
        <FullNameDisplay />
        <InitialsDisplay />
      </div>
    </div>
  );
});
