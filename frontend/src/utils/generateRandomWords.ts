export const generateRandomWords = (
    numWords: number,
    wordLength: number = 5,
    options: { includeUppercase?: boolean; includeNumbers?: boolean } = {}
  ): string[] => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
  
    let characters = alphabet;
    if (options.includeUppercase) characters += uppercase;
    if (options.includeNumbers) characters += numbers;
  
    const words: string[] = [];
    for (let i = 0; i < numWords; i++) {
      let word = "";
      for (let j = 0; j < wordLength; j++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        word += characters[randomIndex];
      }
      words.push(word);
    }
  
    return words;
  };
  
  // Example usage
  const randomWords = generateRandomWords(10, 6, { includeUppercase: true, includeNumbers: true });
  console.log(randomWords);
  