import { useAdvancedFormStore } from '../../store';
import { FormValidation } from './FormValidation';

export function AdvancedFormExample() {
  const fields = useAdvancedFormStore((state) => state.fields);
  const setFieldValue = useAdvancedFormStore((state) => state.setFieldValue);
  const setFieldTouched = useAdvancedFormStore((state) => state.setFieldTouched);
  const canSubmit = useAdvancedFormStore((state) => state.canSubmit);
  const submitForm = useAdvancedFormStore((state) => state.submitForm);
  const resetForm = useAdvancedFormStore((state) => state.resetForm);

  return (
    <div className="example-section">
      <div className="card">
        <h2>6. Form Validation with Immer</h2>

        <div style={{ maxWidth: '400px', margin: '1em auto', textAlign: 'left' }}>
          <div style={{ marginBottom: '1em' }}>
            <label>Email</label>
            <input
              type="email"
              value={fields.email.value}
              onChange={(e) => setFieldValue('email', e.target.value)}
              onBlur={() => setFieldTouched('email')}
              style={{ width: '100%', padding: '0.5em', display: 'block', marginTop: '0.3em' }}
            />
          </div>
          <div style={{ marginBottom: '1em' }}>
            <label>Username</label>
            <input
              type="text"
              value={fields.username.value}
              onChange={(e) => setFieldValue('username', e.target.value)}
              onBlur={() => setFieldTouched('username')}
              style={{ width: '100%', padding: '0.5em', display: 'block', marginTop: '0.3em' }}
            />
          </div>
          <div style={{ marginBottom: '1em' }}>
            <label>Password</label>
            <input
              type="password"
              value={fields.password.value}
              onChange={(e) => setFieldValue('password', e.target.value)}
              onBlur={() => setFieldTouched('password')}
              style={{ width: '100%', padding: '0.5em', display: 'block', marginTop: '0.3em' }}
            />
          </div>
          <div style={{ marginBottom: '1em' }}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={fields.confirmPassword.value}
              onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
              onBlur={() => setFieldTouched('confirmPassword')}
              style={{ width: '100%', padding: '0.5em', display: 'block', marginTop: '0.3em' }}
            />
          </div>
        </div>

        <FormValidation />

        <div className="controls">
          <button onClick={submitForm} disabled={!canSubmit}>
            Submit
          </button>
          <button onClick={resetForm}>Reset</button>
        </div>

        <div className="info-display">
          <strong>Conditional Validation Getters:</strong>
          <pre style={{ textAlign: 'left', fontSize: '0.75em' }}>
            {`get isEmailValid() {
  const email = this.fields.email.value;
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}
get doPasswordsMatch() {
  return this.fields.password.value === 
    this.fields.confirmPassword.value &&
    this.fields.password.value.length > 0;
}
get isFormValid() {
  return this.isEmailValid && this.isPasswordValid && 
    this.doPasswordsMatch && this.isUsernameValid;
}
get fieldErrors() {
  const errors = [];
  if (this.fields.email.touched && !this.isEmailValid) {
    errors.push('Invalid email');
  }
  // ... more validations
  return errors;
}`}
          </pre>
          <p>✨ Complex conditional logic all computed reactively!</p>
        </div>
      </div>
    </div>
  );
}
