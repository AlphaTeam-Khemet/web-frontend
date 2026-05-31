import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Footer from '../components/home/Footer';

import ChatInput from '../components/chat/ChatInput';
import ChatMessage from '../components/chat/ChatMessage';
import SuggestionChips from '../components/chat/SuggestionChips';
import TypingIndicator from '../components/chat/TypingIndicator';

import { getMockChatResponse } from '../data/mockChatResponses';

import '../styles/chat-ai.css';

export default function ChatAI() {
  const { t } = useTranslation();

  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);

  const initialMessages = [
    {
      id: 1,
      role: 'ai',
      content: t('chat.welcome'),
    },
  ];

  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem('khemet-chat-messages');

    if (!savedMessages) {
      return initialMessages;
    }

    try {
      return JSON.parse(savedMessages);
    } catch {
      return initialMessages;
    }
  });

  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content: getMockChatResponse(text, t),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1400);
  };

  useEffect(() => {
    sessionStorage.setItem(
      'khemet-chat-messages',
      JSON.stringify(messages)
    );
  }, [messages]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const container = document.querySelector('.chat-messages-container');

    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  return (
    <main className="chat-ai-page">
      <section className="chat-ai-container">
        <div className="chat-main-panel">
          <div className="chat-header">
            <h1>{t('chat.title')}</h1>

            <p>{t('chat.description')}</p>
          </div>

          <div className="chat-messages-container">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          <SuggestionChips onSelect={handleSendMessage} />

          <ChatInput onSend={handleSendMessage} disabled={isTyping} />
        </div>

        <aside className="chat-side-panel">
          <div className="chat-side-image">
            <img
              src="https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=1200&auto=format&fit=crop"
              alt="Ancient Egyptian artifact"
            />

            <div className="chat-side-overlay" />
          </div>

          <div className="chat-side-content">
            <span>
              <Sparkles size={15} />
              {t('chat.side.badge')}
            </span>

            <h3>{t('chat.side.title')}</h3>

            <p>{t('chat.side.description')}</p>

            <div className="chat-side-features">
              <div>
                <strong>{t('chat.side.feature1.title')}</strong>
                <p>{t('chat.side.feature1.description')}</p>
              </div>

              <div>
                <strong>{t('chat.side.feature2.title')}</strong>
                <p>{t('chat.side.feature2.description')}</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}