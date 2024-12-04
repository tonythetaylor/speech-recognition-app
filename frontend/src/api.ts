import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5009',
});

export const fetchWords = async () => {
    const response = await API.get('/api/words');
    return response.data;
};

export const saveWord = async (word: string, type: "letter" | "number" | "word") => {
    try {
        const response = await API.post('/api/words', { word, type });
        return response.data;
      } catch (error: any) {
        if (error.response) {
          console.error('Backend error response:', error.response.data);
          if (error.response.status === 409) {
            // Duplicate word
            console.warn('Duplicate word detected:', word);
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
        throw error;
      }
  };

  export const getWordsList = async () => {
    try {
      const response = await API.get('/api/words/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching words list:', error);
      throw error;
    }
  };
  
