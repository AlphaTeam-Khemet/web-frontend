import { SendHorizonal } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ChatInput({
  onSend,
  disabled,
}) {
  const { t } = useTranslation();

  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmed = message.trim();

    if (!trimmed || disabled) return;

    onSend(trimmed);

    setMessage('');
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={t('chat.placeholder')}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <button type="submit" disabled={disabled}>
        <SendHorizonal size={18} />
      </button>
    </form>
  );
}