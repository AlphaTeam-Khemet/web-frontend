export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={isUser ? 'chat-message user' : 'chat-message ai'}>
      {!isUser && <div className="chat-avatar">K</div>}

      <div className="chat-bubble">
        <p>{message.content}</p>
      </div>

      {isUser && <div className="chat-avatar user-avatar">U</div>}
    </div>
  );
}