import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Check, MessageSquarePlus, Pencil, Sparkles, Trash2, X } from 'lucide-react';
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

const normalizeConversation = (conversation, defaultTitle = 'New Chat') => ({
  id: conversation.id,
  title: conversation.title || defaultTitle,
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

const TITLE_PREFIX_PATTERNS = [
  /^(please\s+)?(tell me more about|tell me about|who is|what is|explain|describe|give me|show me)\s+/i,
  /^(please\s+)?(can you|could you|would you)\s+/i,
  /^(من هو|ما هو|اشرح|حدثني عن|تكلم عن|اعرفني على)\s+/u,
];

const buildConversationTitle = (text, fallbackTitle) => {
  const cleaned = text
    .replace(/\s+/g, ' ')
    .replace(/[?!.,;:،؛؟]+$/u, '')
    .trim();

  if (!cleaned) return fallbackTitle;

  const withoutPromptPrefix = TITLE_PREFIX_PATTERNS.reduce(
    (value, pattern) => value.replace(pattern, ''),
    cleaned
  ).trim();

  const titleSource = withoutPromptPrefix || cleaned;
  const words = titleSource.split(' ').filter(Boolean);
  const title = words.slice(0, 6).join(' ');

  return title || fallbackTitle;
};

const shouldPreferGeneratedTitle = (backendTitle, generatedTitle, fallbackTitle, question) => {
  if (!backendTitle) return true;

  const normalizedBackendTitle = backendTitle.trim().toLowerCase();
  const normalizedFallbackTitle = fallbackTitle.trim().toLowerCase();
  const normalizedQuestion = question.trim().toLowerCase();

  if (
    normalizedBackendTitle === normalizedFallbackTitle ||
    normalizedBackendTitle === 'new chat'
  ) {
    return true;
  }

  const backendWordCount = normalizedBackendTitle.split(/\s+/).filter(Boolean).length;

  return backendWordCount <= 3 &&
    generatedTitle.trim().toLowerCase() !== normalizedBackendTitle &&
    normalizedQuestion.startsWith(normalizedBackendTitle);
};

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
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  const artifactName = searchParams.get('artifact');

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    setChatError('');

    try {
      const { data } = await aiGuideApi.getConversations();
      const defaultTitle = t('chat.newChat') || 'New Chat';
      const conversations = Array.isArray(data) ? data.map(item => normalizeConversation(item, defaultTitle)) : [];
      setChatSessions(conversations);
      return conversations;
    } catch (error) {
      setChatError(getApiErrorMessage(error, t('chat.loadError') || 'Unable to load recent chats.'));
      return [];
    } finally {
      setIsLoadingConversations(false);
    }
  }, [t]);

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
    setRenamingChatId(null);
    setRenameDraft('');
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
      const defaultTitle = t('chat.newChat') || 'New Chat';
      const generatedTitle = buildConversationTitle(text, defaultTitle);
      const backendConversationTitle = shouldPreferGeneratedTitle(
        data.conversation_title,
        generatedTitle,
        defaultTitle,
        text
      )
        ? generatedTitle
        : data.conversation_title;

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

        if (backendConversationTitle !== data.conversation_title) {
          try {
            await aiGuideApi.updateConversationTitle(backendConversationId, {
              title: backendConversationTitle,
            });
          } catch {
            // Keep the optimistic title locally; a later manual rename can retry.
          }
        }
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

  const handleStartRename = (event, session) => {
    event.stopPropagation();
    setRenamingChatId(session.id);
    setRenameDraft(session.title || '');
    setChatError('');
  };

  const handleCancelRename = (event) => {
    event.stopPropagation();
    setRenamingChatId(null);
    setRenameDraft('');
  };

  const handleRenameSubmit = async (event, sessionId) => {
    event.preventDefault();
    event.stopPropagation();

    const nextTitle = renameDraft.trim();
    if (!nextTitle || isRenaming) return;

    const previousSessions = chatSessions;
    setIsRenaming(true);
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, title: nextTitle } : session
      )
    );

    try {
      await aiGuideApi.updateConversationTitle(sessionId, { title: nextTitle });
      setRenamingChatId(null);
      setRenameDraft('');
      await loadConversations();
    } catch (error) {
      setChatSessions(previousSessions);
      setChatError(getApiErrorMessage(error, t('chat.renameError')));
    } finally {
      setIsRenaming(false);
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
              {t('chat.newChat')}
            </button>

            <h2>{t('chat.recentChat')}</h2>

            <div className="chat-recent-list">
              {isLoadingConversations && (
                <div className="chat-recent-empty">{t('chat.loadingChats')}</div>
              )}

              {!isLoadingConversations && chatSessions.length === 0 && (
                <div className="chat-recent-empty">{t('chat.noSavedChats')}</div>
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
                  {renamingChatId === item.id ? (
                    <form
                      className="chat-rename-form"
                      onSubmit={(event) => handleRenameSubmit(event, item.id)}
                    >
                      <input
                        type="text"
                        value={renameDraft}
                        placeholder={t('chat.renamePlaceholder')}
                        onChange={(event) => setRenameDraft(event.target.value)}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => {
                          if (event.key === 'Escape') {
                            event.preventDefault();
                            setRenamingChatId(null);
                            setRenameDraft('');
                          }
                        }}
                        autoFocus
                      />

                      <button
                        type="submit"
                        className="chat-recent-action save"
                        disabled={isRenaming || !renameDraft.trim()}
                        aria-label={t('chat.renameSave')}
                        title={t('chat.renameSave')}
                      >
                        <Check size={15} />
                      </button>

                      <button
                        type="button"
                        className="chat-recent-action"
                        onClick={handleCancelRename}
                        aria-label={t('chat.renameCancel')}
                        title={t('chat.renameCancel')}
                      >
                        <X size={15} />
                      </button>
                    </form>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSelectChat(item.id)}
                        title={item.title}
                      >
                        {item.title}
                      </button>

                      <div className="chat-recent-actions">
                        <button
                          type="button"
                          className="chat-recent-action"
                          onClick={(event) => handleStartRename(event, item)}
                          aria-label={t('chat.rename')}
                          title={t('chat.rename')}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="chat-recent-action delete"
                          onClick={(event) => handleDeleteRecent(event, item.id)}
                          aria-label={t('chat.deleteRecent')}
                          title={t('chat.deleteRecent')}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </>
                  )}
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
