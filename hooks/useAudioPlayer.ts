
import { useRef, useCallback, useState, useEffect } from 'react';

// This hook manages the AudioContext and provides functions to play various sound effects.
const useAudioPlayer = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  // Removed backgroundMusicRef and related state/functions.

  // Initialize AudioContext if not already initialized
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  // Function to create and play a simple oscillator tone
  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', gainValue = 0.5) => {
    const audioContext = getAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(gainValue, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [getAudioContext]);

  // Specific sound effects
  const playClick = useCallback(() => {
    playTone(880, 0.08, 'sine', 0.3); // High-pitched short beep
  }, [playTone]);

  const playCorrect = useCallback(() => {
    playTone(523.25, 0.1, 'sine', 0.5); // C5
    setTimeout(() => playTone(659.25, 0.1, 'sine', 0.5), 70); // E5
    setTimeout(() => playTone(783.99, 0.1, 'sine', 0.5), 140); // G5 (rising tone)
  }, [playTone]);

  const playIncorrect = useCallback(() => {
    playTone(220, 0.15, 'triangle', 0.6); // A3 (low, slightly buzzing tone)
  }, [playTone]);

  // Removed useEffect for background music initialization and cleanup.
  // Removed toggleBackgroundMusic function.

  return { playClick, playCorrect, playIncorrect };
};

export default useAudioPlayer;