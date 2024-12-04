import React, { useEffect, useState } from 'react';
import { getWordsList } from '../api';

const WordList: React.FC = () => {
  const [wordList, setWordList] = useState<{ word: string; type: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWordsList()
      .then((data) => setWordList(data))
      .catch((err) => setError('Failed to fetch word list.'));
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-2">Word List</h2>
      {error && <p className="text-red-500">{error}</p>}
      {wordList.length === 0 ? (
        <p className="text-gray-500">No words available.</p>
      ) : (
        <ul className="list-disc pl-5">
          {wordList.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item.word} ({item.type})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WordList;
