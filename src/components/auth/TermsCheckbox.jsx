export default function TermsCheckbox({ checked, onChange }) {
  return (
    <label className="register-terms">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      <span>
        I agree to the <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </span>
    </label>
  );
}