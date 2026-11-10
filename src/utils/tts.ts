// Browser SpeechSynthesis utility with persona modulation

export function speakText(
  text: string,
  pitch = 1.0,
  rate = 1.0,
  onEnd?: () => void
): { stop: () => void } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return { stop: () => {} };
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown formatting for cleaner speech
  const cleanText = text
    .replace(/[#*_`~>-]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .slice(0, 800); // speak up to ~800 chars for responsive audio

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.pitch = pitch;
  utterance.rate = rate;

  // Attempt to select a natural voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Enhanced'))
  ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);

  return {
    stop: () => window.speechSynthesis.cancel(),
  };
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
