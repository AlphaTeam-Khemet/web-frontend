export const mockChatResponses = {
  tutankhamun:
    'Tutankhamun was an Egyptian pharaoh of the 18th Dynasty. He is most famous for his nearly intact tomb and the golden funerary mask discovered in the Valley of the Kings.',

  ramesses:
    'Ramesses II was one of ancient Egypt’s most powerful pharaohs. He ruled for over sixty years and built many temples and monuments, including Abu Simbel.',

  default:
    'Khemet AI can help you explore ancient Egyptian history, artifacts, hieroglyphs, museum sections, and famous pharaohs. Ask me anything about ancient Egypt.',
};

export function getMockChatResponse(message) {
  const text = message.toLowerCase();

  if (text.includes('tutankhamun') || text.includes('tut')) {
    return mockChatResponses.tutankhamun;
  }

  if (text.includes('ramesses') || text.includes('ramses')) {
    return mockChatResponses.ramesses;
  }

  return mockChatResponses.default;
}