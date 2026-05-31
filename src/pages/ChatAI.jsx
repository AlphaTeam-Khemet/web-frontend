import { useEffect, useRef, useState } from 'react';
import { Bot, MessageSquarePlus, Sparkles, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import Footer from '../components/home/Footer';

import ChatInput from '../components/chat/ChatInput';
import ChatMessage from '../components/chat/ChatMessage';
import SuggestionChips from '../components/chat/SuggestionChips';
import TypingIndicator from '../components/chat/TypingIndicator';

import { aiGuideApi } from '../api/aiGuideApi';
import { getApiErrorMessage } from '../utils/apiData';

import '../styles/chat-ai.css';

const CHAT_MESSAGES_KEY = 'khemet-chat-messages';
const RECENT_CHATS_KEY = 'khemet-recent-chats';
const ACTIVE_CHAT_KEY = 'khemet-active-chat-id';

const createChatId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getChatTitle = (text) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 3).join(' ') || 'New Chat';
};

export default function ChatAI() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);
  const initialArtifactPromptSent = useRef(false);

  const initialMessages = [
    {
      id: 1,
      role: 'ai',
      content: t('chat.welcome'),
    },
  ];

  const savedMessages = (() => {
    const savedMessages = sessionStorage.getItem(CHAT_MESSAGES_KEY);

    if (!savedMessages) {
      return initialMessages;
    }

    try {
      return JSON.parse(savedMessages);
    } catch {
      return initialMessages;
    }
  })();

  const [chatSessions, setChatSessions] = useState(() => {
    const savedChats = localStorage.getItem(RECENT_CHATS_KEY);

    if (!savedChats) {
      return [
        {
          id: createChatId(),
          title: getChatTitle(t('chat.suggestion.tutankhamun')),
          messages: savedMessages,
        },
        {
          id: createChatId(),
          title: getChatTitle(t('chat.suggestion.ramesses')),
          messages: initialMessages,
        },
        {
          id: createChatId(),
          title: 'Tutankhamun Mask',
          messages: initialMessages,
        },
      ];
    }

    try {
      const parsedChats = JSON.parse(savedChats);

      if (parsedChats.every((item) => typeof item === 'string')) {
        return parsedChats.map((item) => ({
          id: createChatId(),
          title: getChatTitle(item),
          messages: initialMessages,
        }));
      }

      return parsedChats.map((item) => ({
        id: item.id || createChatId(),
        title: getChatTitle(item.title || 'New Chat'),
        messages: Array.isArray(item.messages) ? item.messages : initialMessages,
      }));
    } catch {
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem(ACTIVE_CHAT_KEY);
  });

  const [isTyping, setIsTyping] = useState(false);
  const artifactName = searchParams.get('artifact');

  const activeSession =
    chatSessions.find((session) => session.id === activeChatId) ||
    chatSessions[0];

  const messages = activeSession?.messages || initialMessages;

  const updateSessionMessages = (sessionId, updater) => {
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: updater(session.messages || initialMessages),
            }
          : session
      )
    );
  };

  const updateSessionTitle = (sessionId, text) => {
    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId || session.title !== 'New Chat') {
          return session;
        }

        return {
          ...session,
          title: getChatTitle(text),
        };
      })
    );
  };

  useEffect(() => {
    if (!activeSession && chatSessions.length > 0) {
      setActiveChatId(chatSessions[0].id);
    }
  }, [activeSession, chatSessions]);

  const handleSelectChat = (sessionId) => {
    setActiveChatId(sessionId);
  };

  const handleSendMessage = async (text) => {
    let targetSessionId = activeSession?.id;

    if (!targetSessionId) {
      targetSessionId = createChatId();

      setChatSessions((prev) => [
        {
          id: targetSessionId,
          title: getChatTitle(text),
          messages: initialMessages,
        },
        ...prev,
      ]);

      setActiveChatId(targetSessionId);
    } else {
      updateSessionTitle(targetSessionId, text);
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
    };

    updateSessionMessages(targetSessionId, (prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const { data } = await aiGuideApi.ask({
        question: text,
        topic: 'museum',
      });

      const aiResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content:
          data.answer ||
          data.response ||
          t('chat.mock.default'),
      };

      updateSessionMessages(targetSessionId, (prev) => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content: getApiErrorMessage(
          error,
          'The AI Guide is unavailable right now. Please try again.'
        ),
      };

      updateSessionMessages(targetSessionId, (prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    const nextSession = {
      id: createChatId(),
      title: 'New Chat',
      messages: initialMessages,
    };

    setChatSessions((prev) => [nextSession, ...prev]);
    setActiveChatId(nextSession.id);
  };

  const handleDeleteRecent = (sessionId) => {
    setChatSessions((prev) => {
      const next = prev.filter((item) => item.id !== sessionId);

      if (sessionId === activeChatId) {
        setActiveChatId(next[0]?.id || null);
      }

      return next;
    });
  };

  useEffect(() => {
    sessionStorage.setItem(
      CHAT_MESSAGES_KEY,
      JSON.stringify(messages)
    );
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem(ACTIVE_CHAT_KEY, activeChatId);
    } else {
      localStorage.removeItem(ACTIVE_CHAT_KEY);
    }
  }, [activeChatId]);

  useEffect(() => {
    if (!artifactName || initialArtifactPromptSent.current) {
      return;
    }

    initialArtifactPromptSent.current = true;
    handleSendMessage(`Tell me more about ${artifactName}`);
  }, [artifactName]);

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
      <section className="chat-ai-shell">
        <div className="chat-page-heading">
          <h1>{t('chat.title')}</h1>
          <p>{t('chat.description')}</p>
        </div>

        <div className="chat-ai-container">
          <aside className="chat-history-panel">
            <div className="chat-history-brand">
              <div className="chat-history-icon">
                <Bot size={20} />
              </div>

              <strong>Khemet</strong>
            </div>

            <button
              type="button"
              className="chat-new-btn"
              onClick={handleNewChat}
            >
              <MessageSquarePlus size={20} />
              New Chat
            </button>

            <h2>Recent Chat</h2>

            <div className="chat-recent-list">
              {chatSessions.map((item) => (
                <div
                  className={
                    item.id === activeSession?.id
                      ? 'chat-recent-item active'
                      : 'chat-recent-item'
                  }
                  key={item.id}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectChat(item.id)}
                  >
                    {item.title}
                  </button>

                  <button
                    type="button"
                    className="chat-delete-recent"
                    onClick={() => handleDeleteRecent(item.id)}
                    aria-label="Delete recent chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="chat-history-spark">
              <Sparkles size={24} />
            </div>
          </aside>

          <section className="chat-main-panel">
            <div className="chat-watermark" />

            <div className="chat-messages-container">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            <SuggestionChips onSelect={handleSendMessage} />

            <ChatInput onSend={handleSendMessage} disabled={isTyping} />
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
