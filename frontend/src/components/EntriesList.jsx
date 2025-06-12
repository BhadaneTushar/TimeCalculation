import React from 'react';
import { useTime } from '../context/TimeContext';
import Loading from './Loading';

const EntriesList = () => {
  const { timeEntries, loading, error } = useTime();

  if (loading) {
    return <Loading message="Fetching time entries..." />;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!timeEntries || timeEntries.length === 0) {
    return (
      <div className="no-entries">
        <p>No time entries yet. Start adding your time entries!</p>
      </div>
    );
  }

  return (
    <div className="entries-list">
      <h2>Time Entries</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Description</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {timeEntries.map((entry) => (
            <tr key={entry.id}>
              <td>{new Date(entry.date).toLocaleDateString()}</td>
              <td>{entry.startTime}</td>
              <td>{entry.endTime}</td>
              <td>{entry.description}</td>
              <td>{calculateDuration(entry.startTime, entry.endTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const calculateDuration = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export default EntriesList;
