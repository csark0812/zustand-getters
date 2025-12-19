import { memo } from 'react';
import { EmailValidDisplay } from './EmailValidDisplay';
import { PasswordValidDisplay } from './PasswordValidDisplay';
import { PasswordsMatchDisplay } from './PasswordsMatchDisplay';
import { UsernameValidDisplay } from './UsernameValidDisplay';
import { FormValidDisplay } from './FormValidDisplay';
import { CanSubmitDisplay } from './CanSubmitDisplay';
import { FieldErrorsDisplay } from './FieldErrorsDisplay';

export const FormValidation = memo(function FormValidation() {
  return (
    <div style={{ border: '2px solid #e91e63', padding: '1em', margin: '1em 0' }}>
      <div style={{ fontSize: '0.85em', color: '#888', marginBottom: '0.5em' }}>
        ✅ Each component subscribes to a single computed getter
      </div>
      <div style={{ marginBottom: '1em' }}>
        <EmailValidDisplay />
        <PasswordValidDisplay />
        <PasswordsMatchDisplay />
        <UsernameValidDisplay />
        <FormValidDisplay />
        <CanSubmitDisplay />
      </div>
      <FieldErrorsDisplay />
    </div>
  );
});
