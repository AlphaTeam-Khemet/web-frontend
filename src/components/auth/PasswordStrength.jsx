export default function PasswordStrength({ password }) {
  const score =
    password.length >= 12 ? 4 :
    password.length >= 8 ? 3 :
    password.length >= 5 ? 2 :
    password.length > 0 ? 1 : 0;

  const label =
    score >= 4 ? 'Strong' :
    score === 3 ? 'Good' :
    score === 2 ? 'Weak' :
    'Too Weak';

  return (
    <div className="cnp-strength">
      <div className="cnp-strength-header">
        <span>Password Strength</span>
        <strong>{label}</strong>
      </div>

      <div className="cnp-strength-bars">
        <i className={score >= 1 ? 'active red' : ''} />
        <i className={score >= 2 ? 'active yellow' : ''} />
        <i className={score >= 3 ? 'active green' : ''} />
        <i className={score >= 4 ? 'active bright' : ''} />
      </div>
    </div>
  );
}