import React from 'react';

function TimeEntryForm({
  date,
  timeString,
  loading,
  error,
  setDate,
  setTimeString,
  handleSaveDay,
  handleSaveDayAndNext,
  handleClear,
  setSummary, // Added setSummary to props
  setError, // Added setError to props
}) {
  return (
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
        {/* The inline clear logic is kept here for now as it directly manipulates form state */}
        <button type="button" onClick={() => {setDate(''); setTimeString(''); setSummary(null); setError('');}} disabled={loading || (!date && !timeString.trim())} className="clear-button">Clear</button>
      </div>
    </form>
  );
}

export default TimeEntryForm;
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../App.css'; // Keep this import if you still have global styles in App.css

function TimeEntryForm({
  date,
  timeEntries,
  loading,
  error,
  setDate,
  setTimeEntries,
  setSummary,
  handleSaveDay,
  handleSaveDayAndNext,
  handleClear,
  handleAddTimeEntry,
  handleRemoveTimeEntry,
}) {

  // Helper function to handle changes to a specific time entry
  const handleTimeEntryChange = (date, index) => {
    const newTimeEntries = [...timeEntries];
    newTimeEntries[index] = date;
    setTimeEntries(newTimeEntries);
  };

  return (
    <form onSubmit={handleSaveDay} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="button-group flex space-x-4 mb-4">
        <button type="button" onClick={handleClear} disabled={loading} className="clear-button">
          Clear All
        </button>
      </div>
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
        <label className="block text-gray-700 text-sm font-bold mb-2">Clock-in/Clock-out Times:</label>
        {timeEntries.map((timeEntry, index) => (
          <div key={index} className="flex items-center mb-2">
            <DatePicker
              selected={timeEntry}
              onChange={(date) => handleTimeEntryChange(date, index)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption=""
              dateFormat="h:mm aa"
              disabled={loading}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            {timeEntries.length > 1 && (
              <button type="button" onClick={() => handleRemoveTimeEntry(index)} disabled={loading} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                X
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddTimeEntry} disabled={loading}>
          Add Time Entry
        </button>
      </div>
      <div className="button-group flex space-x-4">
        <button
          type="submit"
          disabled={loading || !date || timeEntries.length === 0 || timeEntries.some(entry => !entry)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
        >
          Save Day
        </button>
        <button
          type="button"
          onClick={handleSaveDayAndNext}
          disabled={loading || !date || timeEntries.length === 0 || timeEntries.some(entry => !entry)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Day & Add Next Day
        </button>
        <button
          type="button"
          onClick={() => {
            setDate('');
            setTimeEntries([]);
            setSummary(null); // Clear summary on form clear
          }}
          disabled={loading || (!date && timeEntries.length === 0)}
          className="clear-button"
        >
          Clear
        </button>
      </div>
      {/* Loading and error messages might be better placed in the parent App component */}
      {/* {loading && <p>Loading...</p>} */}
      {/* {error && <p className="error">{error}</p>} */}
    </form>
  );
}
export default TimeEntryForm;