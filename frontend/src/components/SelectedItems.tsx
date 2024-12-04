interface SelectedItemsProps {
    currentWord: string | null;
  }
  
  const SelectedItems: React.FC<SelectedItemsProps> = ({ currentWord }) => {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2">Current Word</h2>
        {currentWord ? (
          <p className="text-gray-700 text-xl">{currentWord}</p>
        ) : (
          <p className="text-gray-500">All words have been recognized!</p>
        )}
      </div>
    );
  };
  
  export default SelectedItems;
  