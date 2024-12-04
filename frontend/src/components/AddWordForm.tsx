import React, { useState } from 'react';
import { saveWord } from '../api';

const AddWordForm: React.FC = () => {
  const [word, setWord] = useState('');
  const [type, setType] = useState<"number" | "letter" | "word">("word");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const validTypes = ["number", "letter", "word"] as const;
    if (!validTypes.includes(type)) {
      setMessage("Invalid type selected.");
      return;
    }
  
    saveWord(word, type)
      .then(() => {
        setMessage(`Word "${word}" added successfully as a ${type}.`);
        setWord("");
      })
      .catch((error) => {
        setMessage(`Failed to add word: ${error.message}`);
      });
  };
  

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-2">Add Word</h2>
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter word"
          className="border border-gray-300 rounded p-2 w-full"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "number" | "letter" | "word")}
          className="border border-gray-300 rounded p-2 w-full"
        >
          <option value="word">Word</option>
          <option value="letter">Letter</option>
          <option value="number">Number</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Word
        </button>
      </form>
    </div>
  );
};

export default AddWordForm;
