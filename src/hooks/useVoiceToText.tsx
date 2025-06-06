
import { useState, useCallback, useEffect } from 'react';

interface UseVoiceToTextOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  autoStart?: boolean;
}

interface VoiceToTextResult {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export const useVoiceToText = (options: UseVoiceToTextOptions = {}): VoiceToTextResult => {
  const {
    continuous = true,
    interimResults = true,
    language = 'en-US',
    autoStart = false
  } = options;

  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = continuous;
    recognitionInstance.interimResults = interimResults;
    recognitionInstance.lang = language;

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognitionInstance.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setTranscript(prev => prev + finalTranscript + (interimResults ? interimTranscript : ''));
    };

    recognitionInstance.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    if (autoStart) {
      recognitionInstance.start();
    }

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [continuous, interimResults, language, autoStart, isSupported]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      recognition.start();
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error
  };
};
