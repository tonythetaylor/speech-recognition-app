// global.d.ts
interface Window {
    SpeechRecognition: typeof SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof SpeechRecognition | undefined;
  }

// global.d.ts
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }
  
  
  declare var SpeechRecognition: {
    new (): SpeechRecognition;
  };
  
  
  declare var webkitSpeechRecognition: {
    new (): SpeechRecognition;
  };

  