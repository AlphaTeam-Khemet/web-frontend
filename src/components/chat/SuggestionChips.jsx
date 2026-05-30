const suggestions = [
  'Tell me about Tutankhamun',
  'Who is Ramesses?',
  'Explain the Grand Egyptian Museum',
];

export default function SuggestionChips({ onSelect }) {
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