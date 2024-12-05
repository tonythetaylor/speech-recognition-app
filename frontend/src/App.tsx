import React from "react";
import SoundDetector from "./components/SoundDetector";

const App: React.FC = () => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col items-center p-4 overflow-hidden">
      {/* Header */}
      <header className="w-full max-w-5xl text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600">
          Speech Recognition App
        </h1>
        <p className="text-lg text-gray-700 mt-2">
          Press "Start" and then speak the word displayed to interact with the app.
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col space-y-6 bg-white rounded-lg shadow-lg p-6 overflow-hidden">
        <SoundDetector />
      </main>

      {/* Footer */}
      <footer className="mt-6 text-center text-gray-500">
        <p>© 2024 Speech Recognition App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
