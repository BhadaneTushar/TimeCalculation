import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../App.css';
import { useTimeContext } from '../context/TimeContext';

function TimeEntryForm() {
  const { 
    date, 
    timeEntries, 
    loading, 
    error, 
    setDate, 
    setTimeEntries, 
    handleSaveDay,
    handleSaveDayAndNext,
    handleAddTimeEntry,
    handleRemoveTimeEntry,
    handleClear,
    clearSummary
  } = useTimeContext();

  const [selectedDate, setSelectedDate] = useState(null);

  // Helper function to handle changes to a specific time entry
  const handleTimeEntryChange = (value, index) => {
    const newTimeEntries = [...timeEntries];
    newTimeEntries[index] = value.trim();
    setTimeEntries(newTimeEntries);
  };

  // Format time in 12-hour format with AM/PM
  const formatTime = (time) => {
    if (!time) return '';
    // Ensure time is in the correct format (e.g., "10:51 am")
    const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
    if (timeMatch) {
      const [_, hours, minutes, period] = timeMatch;
      return `${hours}:${minutes} ${period.toLowerCase()}`;
    }
    return time;
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSaveDay(e);
    }} className="time-form">
      <h2 className="form-title">Add Time Entry</h2>
      <div className="instructions">Enter your work times for the day. Add as many clock-in/clock-out pairs as needed.</div>
      <div className="button-group">
        <button type="button" onClick={handleClear} disabled={loading} className="clear-button">
          Clear All
        </button>
      </div>
      <div className="input-group">
        <label htmlFor="date-picker">Date:</label>
        <input
          type="date"
          id="date-picker"
          aria-label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={loading}
          className="form-input"
          required
        />
      </div>
      <div className="times-list w-full mb-4">
        <label>Work Times:</label>
        {timeEntries.map((timeEntry, index) => (
          <div key={index} className="flex items-center mb-2 gap-2">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Enter time (e.g., 10:51 am)"
                value={timeEntry || ''}
                onChange={(e) => handleTimeEntryChange(e.target.value, index)}
                className="time-input form-input"
                disabled={loading}
                required
              />
              {timeEntry && (
                <span className="time-display ml-2">
                  {formatTime(timeEntry)}
                </span>
              )}
            </div>
            {timeEntries.length > 1 && (
              <button 
                type="button" 
                onClick={() => handleRemoveTimeEntry(index)} 
                disabled={loading} 
                className="remove-button"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          onClick={handleAddTimeEntry} 
          disabled={loading} 
          className="add-button mt-2"
        >
          + Add Time Entry
        </button>
      </div>
      <div className="button-group">
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSaveDay(e);
          }}
          disabled={loading || !date || timeEntries.length === 0 || timeEntries.some(entry => !entry)}
          className="submit-button"
        >
          Save Day
        </button>
        <button
          type="button"
          onClick={handleSaveDayAndNext}
          disabled={loading || !date || timeEntries.length === 0 || timeEntries.some(entry => !entry)}
          className="next-button"
        >
          Save Day & Add Next Day
        </button>
        <button
          type="button"
          onClick={() => {
            setDate('');
            setTimeEntries([]);
            clearSummary();
          }}
          disabled={loading || (!date && timeEntries.length === 0)}
          className="clear-button"
        >
          Clear
        </button>
      </div>
      {error && <div className="error w-full mt-2">{error}</div>}
      {/* Toast notification placeholder */}
      <div id="toast-root"></div>
    </form>
  );
}

export default TimeEntryForm;