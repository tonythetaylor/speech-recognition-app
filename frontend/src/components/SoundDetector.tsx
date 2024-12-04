import React, { useEffect, useState, useRef } from "react";
import { saveWord, getWordsList } from "../api";
import SelectedItems from "./SelectedItems";
import RecognizedWords from "./RecognizedWords";
import UnrecognizedWords from "./UnrecognizedWords";

const SoundDetector: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recognizing, setRecognizing] = useState<boolean>(false);
  const [wordList, setWordList] = useState<{ word: string }[]>([]);
  const [unrecognizedWords, setUnrecognizedWords] = useState<string[]>([]);
  const [recognizedWords, setRecognizedWords] = useState<Set<string>>(
    new Set()
  );
  const [recognitionInstance, setRecognitionInstance] = useState<InstanceType<
    typeof window.SpeechRecognition
  > | null>(null);

  const [selectedModes, setSelectedModes] = useState<
    Set<"letter" | "number" | "word">
  >(new Set<"letter" | "number" | "word">(["word"]));
  const [timer, setTimer] = useState<number>(10); // Timer countdown
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer <= 0) {
      handleUnrecognizedWord();
    } else if (timer <= 3 && timer > 0) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [timer]);

  const isValidMode = (
    value: string
  ): value is "letter" | "number" | "word" => {
    return ["letter", "number", "word"].includes(value);
  };

  const numberWords: Record<string, number> = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
  };

  useEffect(() => {
    // Load word lists based on selected modes
    loadWordList();
  }, [selectedModes]);

  const loadWordList = () => {
    let combinedList: { word: string }[] = [];

    if (selectedModes.has("letter")) {
      combinedList = [
        ...combinedList,
        ..."abcdefghijklmnopqrstuvwxyz".split("").map((l) => ({ word: l })),
      ];
    }
    if (selectedModes.has("number")) {
      combinedList = [
        ...combinedList,
        ..."0123456789".split("").map((n) => ({ word: n })),
      ];
    }
    if (selectedModes.has("word")) {
      getWordsList()
        .then((data) => {
          const words = data.map((item: { word: string }) => ({
            word: item.word,
          }));
          combinedList = [...combinedList, ...words];
          setWordList(combinedList);
        })
        .catch(() => setError("Failed to fetch word list."));
      return;
    }

    setWordList(combinedList);
  };

  const generateCompletionMessage = (): string => {
    const types = Array.from(selectedModes); // Convert Set to Array
    if (types.length === 0) return "No types selected.";
    const typeNames = types.map((type) => {
      switch (type) {
        case "letter":
          return "letters";
        case "number":
          return "numbers";
        case "word":
          return "words";
        default:
          return "";
      }
    });
    return `All ${typeNames.join(", ")} have been recognized!`;
  };

  const parseNumber = (word: string): string | null => {
    // Handle single numbers like "one" -> "1"
    if (numberWords[word] !== undefined) {
      return numberWords[word].toString();
    }

    // Handle compound numbers like "twenty-three"
    const parts = word.split(/[-\s]/); // Split on hyphens or spaces
    if (
      parts.length === 2 &&
      numberWords[parts[0]] !== undefined &&
      numberWords[parts[1]] !== undefined
    ) {
      return (numberWords[parts[0]] + numberWords[parts[1]]).toString();
    }

    return null; // Not a number
  };

  const determineType = (item: string): "letter" | "number" | "word" => {
    if (/^[a-z]$/.test(item)) return "letter";
    if (/^\d+$/.test(item)) return "number"; // Numeric string like "23"
    if (parseNumber(item) !== null) return "number"; // Spoken number like "twenty-three"
    return "word";
  };

  const processItem = (item: string) => {
    const type = determineType(item);
    if (type === "number") {
      const numericForm = parseNumber(item) || item; // Convert to numeric form if it's a spoken number
      return numericForm;
    }
    return item;
  };

  const toggleMode = (mode: "letter" | "number" | "word") => {
    setSelectedModes((prevModes) => {
      const newModes = new Set(prevModes);
      if (newModes.has(mode)) {
        newModes.delete(mode); // Deselect the mode
      } else {
        newModes.add(mode); // Select the mode
      }
      return newModes;
    });
  };

  const levenshteinDistance = (a: string, b: string): number => {
    const matrix = Array(a.length + 1)
      .fill(null)
      .map((_, i) => Array(b.length + 1).fill(i ? i : 0));

    for (let j = 1; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    return matrix[a.length][b.length];
  };

  const findClosestMatch = (
    word: string,
    list: { word: string }[],
    threshold: number = 3
  ): string | null => {
    let closestMatch = null;
    let smallestDistance = threshold + 1;

    list.forEach((item) => {
      const distance = levenshteinDistance(word, item.word);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestMatch = item.word;
      }
    });

    return smallestDistance <= threshold ? closestMatch : null;
  };

  const resetHandler = () => {
    if (recognitionInstance) {
      recognitionInstance.stop();
    }
    clearTimer();
    setRecognizing(false);
    setWords([]);
    setRecognizedWords(new Set());
    setUnrecognizedWords([]);
    setCurrentWordIndex(0);
    setTimer(10);
    console.log("Reset completed.");
  };

  const startListening = () => {
    clearTimer(); // Ensure no previous timers
    const recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!recognition) {
      setError(
        "SpeechRecognition API is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );
      return;
    }

    const speechRecognition = new recognition();
    setRecognitionInstance(speechRecognition);
    speechRecognition.continuous = true;
    speechRecognition.lang = "en-US";
    speechRecognition.interimResults = true;

    speechRecognition.onstart = () => {
      console.log("Speech recognition started.");
      setRecognizedWords(new Set());
      setRecognizing(true);
      startTimer();
    };

    speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
      clearTimer(); // Reset the timer if a word is recognized

      Array.from(event.results).forEach((result) => {
        if (result.isFinal) {
          const transcript = result[0].transcript.trim().toLowerCase();
          console.log("Final Transcript:", transcript);

          const words = transcript
            .split(/\s+/)
            .map((word) => word.replace(/[^a-z0-9-]/gi, "")) // Allow hyphens for numbers like "twenty-three"
            .map(processItem); // Process each item

          words.forEach((word) => {
            if (!recognizedWords.has(word)) {
              const closestMatch = findClosestMatch(word, wordList);
              if (closestMatch) {
                saveWord(closestMatch, "word")
                  .then(() => {
                    console.log(`Matched and saved word: ${closestMatch}`);

                    // Add to recognized words and remove from word list
                    setRecognizedWords((prevSet) => {
                      const newSet = new Set(prevSet);
                      newSet.add(closestMatch);
                      return newSet;
                    });

                    setWords((prev) => {
                      if (!prev.includes(closestMatch)) {
                        return [...prev, closestMatch];
                      }
                      return prev; // Avoid adding duplicate words to state
                    });

                    setWordList((prevList) =>
                      prevList.filter((item) => item.word !== closestMatch)
                    );
                  })
                  .catch((err) =>
                    console.error(
                      "Error saving word:",
                      err.response?.data || err.message
                    )
                  );
              } else {
                console.log(`Unmatched word: ${word}`);
              }
            } else {
              console.log(`Duplicate word ignored: ${word}`);
            }
          });
          startTimer(); // Restart countdown for the next word
        }
      });
    };

    speechRecognition.start();
  };
  console.log("Words Array:", words);

  const startTimer = () => {
    clearTimer(); // Ensure any previous timer is cleared
    setTimer(10); // Start from 10 seconds
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleUnrecognizedWord = () => {
    clearTimer(); // Clear the current timer

    const currentWord = wordList[currentWordIndex]?.word || "Unknown";
    console.log("Unrecognized Word:", currentWord);

    setUnrecognizedWords((prev) => {
      const updatedUnrecognizedWords = prev.includes(currentWord)
        ? prev
        : [...prev, currentWord];
      console.log("Updated Unrecognized Words:", updatedUnrecognizedWords);
      return updatedUnrecognizedWords;
    });

    nextWord(); // Proceed to the next word
  };

  const nextWord = () => {
    clearTimer();

    setCurrentWordIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;

      if (nextIndex < wordList.length) {
        console.log(`Next Word Index: ${nextIndex}`);
        console.log(`Next Word: ${wordList[nextIndex]?.word}`);
        setTimer(10); // Reset the timer for the next word
        startTimer();
        return nextIndex; // Advance to the next word
      } else {
        console.log("All words have been processed.");
        clearTimer();
        setRecognizing(false); // Stop listening
        return prevIndex; // Stay at the last word
      }
    });
  };

  return (
    <div className="relative flex flex-col h-screen px-4">
  {/* Top Content */}
  <div className="flex flex-col md:flex-row items-start md:justify-between mb-6 space-y-4 md:space-y-0">
    {/* Buttons */}
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap space-x-2 md:space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            selectedModes.has("letter")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => toggleMode("letter")}
        >
          Letters
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedModes.has("number")
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => toggleMode("number")}
        >
          Numbers
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedModes.has("word") ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => toggleMode("word")}
        >
          Words
        </button>
      </div>
      <div className="flex flex-wrap space-x-2 md:space-x-4 mt-4">
        <button
          onClick={startListening}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-400"
          disabled={recognizing}
        >
          {recognizing ? "Listening..." : "Start Listening"}
        </button>
        <button
          onClick={resetHandler}
          className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-400"
        >
          Reset
        </button>
      </div>
    </div>

    {/* Current Word */}
    <div className="mt-6 md:mt-0 md:ml-6 flex flex-col items-center">
      <p className="text-gray-600 text-lg">Current Word:</p>
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600 mt-2">
        {wordList[currentWordIndex]?.word || "Loading..."}
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
    {/* Recognized Words */}
    <div className="flex-1 bg-white p-6 rounded-lg shadow-lg h-[40vh] md:h-auto overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Recognized Words
      </h2>
      <RecognizedWords recognizedWords={words} />
    </div>

    {/* Unrecognized Words */}
    <div className="flex-1 bg-white p-6 rounded-lg shadow-lg h-[40vh] md:h-auto overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Unrecognized Words
      </h2>
      <UnrecognizedWords unrecognizedWords={unrecognizedWords} />
    </div>
  </div>

  {/* Overlay Warning */}
  {showWarning && (
    <div className="absolute inset-0 bg-zinc-800 bg-opacity-70 flex flex-col items-center justify-center z-20">
      <div
        className="text-center text-6xl sm:text-5xl lg:text-7xl font-extrabold text-white animate-bounce"
        style={{ animation: "grow-burst 1s ease-in-out" }}
      >
        {wordList[currentWordIndex]?.word || "Loading..."}
      </div>
      <p className="text-white text-2xl font-bold mt-6">
        Hurry! Time is running out!
        <span>
              <div className="text-gray-700">
                <p>Time Remaining: {timer} seconds</p>
              </div>
            </span>
      </p>
      {timer <= 0 && (
        <button
          onClick={resetHandler}
          className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-400"
        >
          Reset
        </button>
      )}
    </div>
  )}
</div>

  );
};

export default SoundDetector;
