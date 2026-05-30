import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  showPassword,
  onToggle,
}) {
  return (
    <div className="cnp-field">
      <label>{label}</label>

      <div className="cnp-password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />

        <button type="button" onClick={onToggle}>
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}