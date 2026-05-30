import { useRef } from 'react';

export default function OTPInput({ value, onChange, length = 6 }) {
  const inputsRef = useRef([]);

  const handleChange = (index, inputValue) => {
    const digit = inputValue.replace(/\D/g, '').slice(-1);
    const nextValue = value.split('');

    nextValue[index] = digit;
    onChange(nextValue.join(''));

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);

    onChange(pasted);

    const nextIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  return (
    <div className="otp-group">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(element) => (inputsRef.current[index] = element)}
          value={value[index] || ''}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          inputMode="numeric"
          maxLength={1}
          className="otp-box"
          placeholder="-"
        />
      ))}
    </div>
  );
}