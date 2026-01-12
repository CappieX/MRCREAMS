import { useState, useEffect } from 'react';

const useEmotionData = () => {
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock data fetch
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockHistory = [
          { date: '2023-10-01', emotion: 'Happy', intensity: 8 },
          { date: '2023-10-02', emotion: 'Neutral', intensity: 5 },
          { date: '2023-10-03', emotion: 'Anxious', intensity: 6 },
          { date: '2023-10-04', emotion: 'Calm', intensity: 7 },
          { date: '2023-10-05', emotion: 'Happy', intensity: 9 },
        ];
        
        setEmotionHistory(mockHistory);
        setCurrentEmotion({ emotion: 'Happy', intensity: 8 });
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addEmotionEntry = (entry) => {
    setEmotionHistory(prev => [...prev, { ...entry, date: new Date().toISOString() }]);
    setCurrentEmotion(entry);
  };

  return {
    emotionHistory,
    currentEmotion,
    addEmotionEntry,
    loading,
    error
  };
};

export default useEmotionData;
