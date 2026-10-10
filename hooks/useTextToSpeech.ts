
import { useCallback } from 'react';

const useTextToSpeech = () => {
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if ('speechSynthesis' in window && text) {
      speechSynthesis.cancel(); // Cancel any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      // A simple check for a common voice that sounds good for kids, falls back to default
      const voices = speechSynthesis.getVoices();
      const googleVoice = voices.find(voice => voice.name === 'Google US English');
      if (googleVoice) {
        utterance.voice = googleVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }
      speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak };
};

export default useTextToSpeech;
