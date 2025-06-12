import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [date, setDate] = useState('')
  const [timeString, setTimeString] = useState('')
  const [times, setTimes] = useState([''])
  const [history, setHistory] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch all days on mount
  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:8081/api/entries')
      if (!res.ok) throw new Error('Failed to fetch history')
      const data = await res.json()
      // Sort history by date descending
      data.sort((a, b) => new Date(b.date) - new Date(a.date))
      setHistory(data)
    } catch (e) {
      setError('Failed to load history: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDay = async (e) => {
    e.preventDefault()
    const parsedTimes = timeString.split(',').map(time => time.trim()).filter(time => time) // Parse and filter empty times
    if (!date || parsedTimes.length === 0) {
      setError('Please enter a date and at least one time entry.')
      return
    }
    setLoading(true)
    setError('')
    setSummary(null)
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
        body: JSON.stringify({ date, times: parsedTimes }),
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error('Failed to submit entry: ' + errorText)
      }
      const data = await res.json()
      setSummary(data)
      fetchHistory()
      // Optionally clear timeString after successful submission if starting fresh for the next day
      // setTimeString('');
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDayAndNext = async () => {
    // Use a dummy event object
    const dummyEvent = { preventDefault: () => {} }
    await handleSaveDay(dummyEvent) // Save the current day first
    // If save was successful, clear the date field for manual entry of the next day
    // Note: Checking for summary assumes handleSaveDay sets it on success
    if (!error && summary) { // Check if there was no error from handleSaveDay
      setDate(''); // Clear the date field
      // Keep timeString as is for the next day entry
      setSummary(null); // Clear summary for the new day
      // History is already refetched in handleSaveDay
    } else if (error) {
      // Handle error from handleSaveDay, maybe don't proceed to next day
      console.error("Error saving current day, not proceeding to next.", error)
    }
  }

  const handleClear = async () => {
    setLoading(true)
    try {
      // Clear local state
      setDate('')
      setTimeString('')
      setTimes([''])
      setSummary(null)
      setError('')

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
      })
      if (!res.ok) throw new Error('Failed to clear history')
      
      // Update local history state
      setHistory([])
    } catch (e) {
      setError('Failed to clear history: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Average Time Calculator</h1>
      <form onSubmit={handleSaveDay} className="time-form">
        <div className="button-group">
          <button type="button" onClick={handleClear} disabled={loading} className="clear-button">
            Clear All
          </button>
        </div>
        <br />
        <label>
          Date:
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            required 
            disabled={loading}
          />
        </label>
        <div className="times-list">
          <label htmlFor="time-string-input">Clock-in/Clock-out Times (comma-separated, e.g., 09:00 AM, 12:00 PM):</label>
          <input
            id="time-string-input"
            type="text"
            value={timeString}
            onChange={e => setTimeString(e.target.value)}
            placeholder="e.g., 09:00 AM, 12:00 PM, 01:00 PM, 05:00 PM"
            required
            disabled={loading}
          />
        </div>
        <div className="button-group">
          <button 
            type="submit" 
            disabled={loading || !date || !timeString.trim()}
          >
            Save Day
          </button>
          <button 
            type="button" 
            onClick={handleSaveDayAndNext} 
            disabled={loading || !date || !timeString.trim()}
          >
            Save Day & Add Next Day
          </button>
          <button 
            type="button" 
            onClick={() => {
              setDate('');
              setTimeString('');
              setSummary(null);
              setError('');
            }}
            disabled={loading || (!date && !timeString.trim())}
            className="clear-button"
          >
            Clear
          </button>
        </div>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {summary && (
        <div className="summary">
          <h2>Summary for {summary.date}</h2>
          <p><b>Times:</b> {summary.times.join(', ')}</p>
          <p><b>Total Worked:</b> {summary.totalWorked}</p>
          <p><b>{summary.overtime ? 'Overtime' : 'Remaining'}:</b> {summary.remainingOrOvertime}</p>
          <p><b>Average Worked:</b> {summary.averageWorked}</p>
        </div>
      )}
      <h2>History</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Worked</th>
            <th>Overtime</th>
            <th>Average Worked</th>
          </tr>
        </thead>
        <tbody>
          {/* Sort history by date descending for display */}
          {history.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.date}</td>
              <td>{entry.totalWorked}</td>
              <td>{entry.overtime ? 'Yes' : 'No'}</td>
              <td>{entry.averageWorked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
