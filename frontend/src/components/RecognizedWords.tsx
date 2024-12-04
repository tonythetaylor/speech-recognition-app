interface InteractiveAreaProps {
    recognizedWords: string[];
  }
  
  const RecognizedWords: React.FC<InteractiveAreaProps> = ({ recognizedWords }) => {
    return (
      <div className="mt-6 bg-gray-100 p-4 rounded shadow-lg overflow-y-auto">
        {recognizedWords.length === 0 ? (
          <p className="text-gray-500 text-center italic">
            No recognizedWords recognized yet.
          </p>
        ) : (
          <ul className="list-none pl-5 space-y-2">
            {recognizedWords.map((word, index) => (
            <li key={index} className="text-gray-700 text-lg border-b ">
            {word}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default RecognizedWords;
  