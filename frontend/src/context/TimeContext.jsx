import { createContext, useContext, useState, useEffect } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const [date, setDate] = useState('');
  const [timeEntries, setTimeEntries] = useState([]);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8081/api/entries');
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistory(data);
    } catch (e) {
      setError('Failed to load history: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format times in 12-hour format
  // Helper function to format times in 12-hour format
  const formatTimes = (times) => {
    // First clean up any comma-separated strings
    const cleanedTimes = times.map(time => {
      if (typeof time === 'string' && time.includes(',')) {
        return time.split(',').map(t => t.trim());
      }
      return time;
    }).flat(); // Flatten the array if we had nested arrays

    return cleanedTimes.map(time => {
      if (!time) return '';
      // Ensure time is in the correct format (e.g., "10:51 am")
      const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
      if (timeMatch) {
        const [_, hours, minutes, period] = timeMatch;
        return `${hours}:${minutes} ${period.toLowerCase()}`;
      }
      return time;
    });
  };

  const handleSaveDay = async (e) => {
    e.preventDefault();
    if (!date || timeEntries.length === 0) {
      setError('Please enter a date and at least one time entry.');
      return;
    }
    setLoading(true);
    setError('');
    setSummary(null);
    try {
      // Process and validate times
      const processedTimes = [];
      
      // First process each time entry
      timeEntries.forEach(time => {
        if (!time) return;
        
        // Split comma-separated times
        const timesArray = time.split(',').map(t => t.trim());
        
        // Validate and clean each time
        timesArray.forEach(cleanTime => {
          if (!cleanTime) return;
          
          // Validate time format
          if (!/^\d{1,2}:\d{2}\s*(am|pm)$/i.test(cleanTime)) {
            console.warn('Invalid time format:', cleanTime);
            return;
          }
          
          processedTimes.push(cleanTime.toLowerCase());
        });
      });

      if (processedTimes.length === 0) {
        throw new Error('No valid time entries found');
      }

      const res = await fetch('http://localhost:8081/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date: date, // date is already in YYYY-MM-DD format
          times: processedTimes 
        }),
      });

      if (!res.ok) throw new Error('Failed to save day');
      const data = await res.json();
      setSummary(data.summary);
      setTimeEntries([]);
      setDate('');
      fetchHistory();
    } catch (e) {
      setError('Failed to save day: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDayAndNext = async (e) => {
    e.preventDefault();
    if (!date || timeEntries.length === 0) {
      setError('Please enter a date and at least one time entry.');
      return;
    }
    setLoading(true);
    setError('');
    setSummary(null);
    try {
      // Clean and format each time entry
      const formattedTimes = timeEntries.map(time => {
        if (!time) return '';
        // Remove any whitespace and ensure proper format
        const cleanTime = time.trim();
        // Ensure time is in the correct format (e.g., "10:51 am")
        return cleanTime;
      }).filter(time => time); // Remove empty strings

      const res = await fetch('http://localhost:8081/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date: date, // date is already in YYYY-MM-DD format
          times: formattedTimes 
        }),
      });

      if (!res.ok) throw new Error('Failed to save day');
      const data = await res.json();
      setSummary(data.summary);
      setTimeEntries([]);
      
      // Calculate next day
      const currentDate = new Date(date);
      currentDate.setDate(currentDate.getDate() + 1);
      setDate(currentDate.toISOString().split('T')[0]); // Convert back to YYYY-MM-DD format
      
      fetchHistory();
    } catch (e) {
      setError('Failed to save day: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeEntry = () => {
    setTimeEntries([...timeEntries, '']);
  };

  const handleRemoveTimeEntry = (index) => {
    const newEntries = [...timeEntries];
    newEntries.splice(index, 1);
    setTimeEntries(newEntries);
  };

  const handleClear = () => {
    setDate('');
    setTimeEntries([]);
  };

  const clearSummary = () => {
    setSummary(null);
  };

  const value = {
    date,
    setDate,
    timeEntries,
    setTimeEntries,
    history,
    summary,
    loading,
    error,
    setError,
    fetchHistory,
    handleSaveDay,
    handleAddTimeEntry,
    handleRemoveTimeEntry,
    handleClear,
    clearSummary
  };

  return (
    <TimeContext.Provider value={value}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTimeContext = () => {
  return useContext(TimeContext);
};

export default TimeProvider;
