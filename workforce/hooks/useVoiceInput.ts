"use client"

import { useState, useEffect, useCallback, useRef } from 'react';

export interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  notSupported: boolean;
}

// Minimal type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

// Add to window
declare global {
  interface Window {
    SpeechRecognition: {
        new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
        new (): SpeechRecognition;
    };
  }
}

export function useVoiceInput() {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    transcript: '',
    error: null,
    notSupported: false,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionCtor) {
        const recognitionInstance = new SpeechRecognitionCtor();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        
        recognitionInstance.onstart = () => {
             setState(prev => ({ ...prev, isListening: true }));
        };

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setState(prev => ({ ...prev, transcript: finalTranscript }));
            }
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error', event.error);
            setState(prev => ({ ...prev, isListening: false, error: event.error }));
        };

        recognitionInstance.onend = () => {
            setState(prev => ({ ...prev, isListening: false }));
        };

        recognitionRef.current = recognitionInstance;
      } else {
        setState(prev => ({ ...prev, notSupported: true }));
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.start();
      setState(prev => ({ ...prev, isListening: true, error: null, transcript: '' }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript: () => setState(prev => ({ ...prev, transcript: '' }))
  };
}
