interface UnrecognizedWordsProps {
  unrecognizedWords: string[];
}

const UnrecognizedWords: React.FC<UnrecognizedWordsProps> = ({
  unrecognizedWords,
}) => {
  return (
    <div className="mt-6 bg-gray-100 p-4 rounded shadow-lg overflow-y-auto">
      {unrecognizedWords.length === 0 ? (
        <p className="text-gray-500 text-center italic">
          No unrecognized words yet.
        </p>
      ) : (
        <ul className="list-none pl-5 space-y-2 overflow-y-auto">
          {unrecognizedWords.map((word, index) => (
            <li key={index} className="text-gray-700 text-lg border-b ">
              {word}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnrecognizedWords;
