import { useTranslation } from 'react-i18next';

export default function SuggestionChips({ onSelect }) {
  const { t } = useTranslation();

  const suggestions = [
    t('chat.suggestion.tutankhamun'),
    t('chat.suggestion.ramesses'),
    t('chat.suggestion.museum'),
  ];

  return (
    <div className="chat-suggestions">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}