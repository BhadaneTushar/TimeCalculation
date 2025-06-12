import { useState, useEffect } from 'react';
import './App.css';
import TimeEntryForm from './components/TimeEntryForm'; // Import TimeEntryForm
import SummaryDisplay from './components/SummaryDisplay'; // Import SummaryDisplay
import HistoryTable from './components/HistoryTable'; // Import HistoryTable

function App() {
  const [date, setDate] = useState('');
  const [timeEntries, setTimeEntries] = useState([]); // Renamed from timeString and initialized as array
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all days on mount
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
      // Sort history by date descending
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistory(data);
    } catch (e) {
      setError('Failed to load history: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDay = async (e) => {
    e.preventDefault();
    // Use timeEntries array directly
    if (!date || timeEntries.length === 0) {
      setError('Please enter a date and at least one time entry.');
      return;
    }
    setLoading(true);
    setError('');
    setSummary(null);
    try {
      const res = await fetch('http://localhost:8081/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Origin': 'http://localhost:5173',
          'Referer': 'http://localhost:5173/',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
        },
        credentials: 'include', // Include cookies for session authentication,
        body: JSON.stringify({ date, times: timeEntries }), // Use timeEntries array
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Failed to submit entry: ' + errorText);
      }
      const data = await res.json();
      setSummary(data);
      fetchHistory();
      // Optionally clear timeEntries after successful submission if starting fresh for the next day
      // setTimeEntries([]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDayAndNext = async () => {
    // Use a dummy event object
    const dummyEvent = { preventDefault: () => {} };
    await handleSaveDay(dummyEvent); // Save the current day first
    // If save was successful, clear the date field for manual entry of the next day
    // Note: Checking for summary assumes handleSaveDay sets it on success
    if (!error && summary) { // Check if there was no error from handleSaveDay
      setDate(''); // Clear the date field
      // Keep timeEntries as is for the next day entry
      setSummary(null); // Clear summary for the new day
      // History is already refetched in handleSaveDay
    } else if (error) {
      // Handle error from handleSaveDay, maybe don\'t proceed to next day
      console.error("Error saving current day, not proceeding to next.", error);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      // Clear local state
      setDate('');
      setTimeEntries([]); // Reset timeEntries to empty array
      setSummary(null);
      setError('');

      // Clear history from backend
      const res = await fetch('http://localhost:8081/api/entries', {
        method: 'DELETE',
        credentials: 'include', // Include cookies for session authentication
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5173',
          'Referer': 'http://localhost:5173/',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) throw new Error('Failed to clear history');

      // Update local history state
      setHistory([]);
    } catch (e) {
      setError('Failed to clear history: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Add handle functions for adding and removing time entries
  const handleAddTimeEntry = () => {
    setTimeEntries([...timeEntries, '']); // Add an empty string for a new time entry
  };

  const handleRemoveTimeEntry = (index) => {
    const newTimeEntries = [...timeEntries];
    newTimeEntries.splice(index, 1); // Remove the entry at the specified index
    setTimeEntries(newTimeEntries);
  };


  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Average Time Calculator</h1>
      {/* Use the new TimeEntryForm component */}
      <TimeEntryForm
        date={date}
        timeEntries={timeEntries} // Pass timeEntries array
        loading={loading}
        error={error}
        setDate={setDate}
        setTimeEntries={setTimeEntries} // Pass setTimeEntries
        handleSaveDay={handleSaveDay}
        handleSaveDayAndNext={handleSaveDayAndNext}
        handleClear={handleClear}
        handleAddTimeEntry={handleAddTimeEntry} // Pass add handler
        handleRemoveTimeEntry={handleRemoveTimeEntry} // Pass remove handler
      />

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}\
      {/* Use the new SummaryDisplay component */}
      <SummaryDisplay summary={summary} className="mt-4" />

      {/* Use the new HistoryTable component */}
      <HistoryTable history={history} />
    </div>
  );
}

export default App;
