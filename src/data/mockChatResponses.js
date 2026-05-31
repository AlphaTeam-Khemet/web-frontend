export function getMockChatResponse(message, t) {
  const text = message.toLowerCase();

  if (
    text.includes('tutankhamun') ||
    text.includes('tut')
  ) {
    return t('chat.mock.tutankhamun');
  }

  if (
    text.includes('ramesses') ||
    text.includes('ramses')
  ) {
    return t('chat.mock.ramesses');
  }

  return t('chat.mock.default');
}