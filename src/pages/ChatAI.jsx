import { useCallback, useEffect, useRef, useState } from 'react';
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

const LEGACY_CHAT_MESSAGES_KEY = 'khemet-chat-messages';
const LEGACY_RECENT_CHATS_KEY = 'khemet-recent-chats';
const LEGACY_ACTIVE_CHAT_KEY = 'khemet-active-chat-id';

const createLocalMessageId = () =>
  `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeConversation = (conversation) => ({
  id: conversation.id,
  title: conversation.title || 'New Chat',
  updated_at: conversation.updated_at,
  created_at: conversation.created_at,
  last_message_preview: conversation.last_message_preview || '',
});

const normalizeMessage = (message) => ({
  id: message.id || createLocalMessageId(),
  role: message.role === 'assistant' ? 'ai' : message.role,
  content: message.content || '',
  sources: message.sources || [],
  created_at: message.created_at,
});

export default function ChatAI() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);
  const initialArtifactPromptSent = useRef(false);

  const getWelcomeMessages = useCallback(() => [
    {
      id: 'welcome',
      role: 'ai',
      content: t('chat.welcome'),
    },
  ], [t]);

  const [chatSessions, setChatSessions] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState(() => getWelcomeMessages());
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState('');

  const artifactName = searchParams.get('artifact');

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    setChatError('');

    try {
      const { data } = await aiGuideApi.getConversations();
      const conversations = Array.isArray(data) ? data.map(normalizeConversation) : [];
      setChatSessions(conversations);
      return conversations;
    } catch (error) {
      setChatError(getApiErrorMessage(error, 'Unable to load recent chats.'));
      return [];
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    // Chat history now lives in PostgreSQL through the backend history APIs.
    localStorage.removeItem(LEGACY_RECENT_CHATS_KEY);
    localStorage.removeItem(LEGACY_ACTIVE_CHAT_KEY);
    sessionStorage.removeItem(LEGACY_CHAT_MESSAGES_KEY);
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    setMessages((current) => {
      if (current.length === 1 && current[0].id === 'welcome') {
        return getWelcomeMessages();
      }

      return current;
    });
  }, [getWelcomeMessages]);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages(getWelcomeMessages());
    setChatError('');
  };

  const handleSelectChat = async (sessionId) => {
    if (!sessionId || sessionId === activeChatId) return;

    setActiveChatId(sessionId);
    setIsLoadingMessages(true);
    setChatError('');

    try {
      const { data } = await aiGuideApi.getConversationMessages(sessionId);
      const loadedMessages = Array.isArray(data?.messages)
        ? data.messages.map(normalizeMessage)
        : [];

      setMessages(loadedMessages.length > 0 ? loadedMessages : getWelcomeMessages());

      if (data?.conversation) {
        setChatSessions((prev) =>
          prev.map((session) =>
            session.id === data.conversation.id
              ? { ...session, title: data.conversation.title || session.title }
              : session
          )
        );
      }
    } catch (error) {
      setMessages(getWelcomeMessages());
      setChatError(getApiErrorMessage(error, 'Unable to load this conversation.'));
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const upsertConversation = (conversation) => {
    if (!conversation?.id) return;

    const normalized = normalizeConversation(conversation);

    setChatSessions((prev) => [
      normalized,
      ...prev
        .filter((session) => session.id !== normalized.id)
        .map((session) => ({ ...session })),
    ]);
  };

  const handleSendMessage = async (text) => {
    if (isTyping || isLoadingMessages) return;

    const conversationIdAtSend = activeChatId;
    const userMessage = {
      id: createLocalMessageId(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setChatError('');

    try {
      const { data } = await aiGuideApi.ask({
        question: text,
        topic: 'museum',
        conversation_id: conversationIdAtSend || undefined,
      });

      const backendConversationId = data.conversation_id || conversationIdAtSend;
      const backendConversationTitle = data.conversation_title || 'New Chat';

      const aiResponse = {
        id: createLocalMessageId(),
        role: 'ai',
        content: data.answer || data.response || t('chat.mock.default'),
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, aiResponse]);

      if (backendConversationId) {
        setActiveChatId(backendConversationId);
        upsertConversation({
          id: backendConversationId,
          title: backendConversationTitle,
          updated_at: new Date().toISOString(),
          last_message_preview: aiResponse.content,
        });
      }

      await loadConversations();
    } catch (error) {
      const errorResponse = {
        id: createLocalMessageId(),
        role: 'ai',
        content: getApiErrorMessage(
          error,
          'The AI Guide is unavailable right now. Please try again.'
        ),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDeleteRecent = async (event, sessionId) => {
    event.stopPropagation();
    if (!sessionId) return;

    const wasActive = sessionId === activeChatId;
    const previousSessions = chatSessions;

    setChatSessions((prev) => prev.filter((item) => item.id !== sessionId));

    if (wasActive) {
      setActiveChatId(null);
      setMessages(getWelcomeMessages());
    }

    try {
      await aiGuideApi.deleteConversation(sessionId);
      await loadConversations();
    } catch (error) {
      setChatSessions(previousSessions);
      setChatError(getApiErrorMessage(error, 'Unable to delete this conversation.'));
    }
  };

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
  }, [messages, isTyping, isLoadingMessages]);

  const inputDisabled = isTyping || isLoadingMessages;

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
              {isLoadingConversations && (
                <div className="chat-recent-empty">Loading chats...</div>
              )}

              {!isLoadingConversations && chatSessions.length === 0 && (
                <div className="chat-recent-empty">No saved chats yet</div>
              )}

              {chatSessions.map((item) => (
                <div
                  className={
                    item.id === activeChatId
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
                    onClick={(event) => handleDeleteRecent(event, item.id)}
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
              {isLoadingMessages ? (
                <TypingIndicator />
              ) : (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              )}

              {isTyping && <TypingIndicator />}

              {chatError && (
                <ChatMessage
                  message={{
                    id: 'chat-error',
                    role: 'ai',
                    content: chatError,
                  }}
                />
              )}

              <div ref={messagesEndRef} />
            </div>

            <SuggestionChips onSelect={handleSendMessage} />

            <ChatInput onSend={handleSendMessage} disabled={inputDisabled} />
          </section>
        </div>
      </section>

      <Footer />
    </main>
  );
}
