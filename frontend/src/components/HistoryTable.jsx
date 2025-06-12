import React from 'react';
import { useTimeContext } from '../context/TimeContext';

function HistoryTable() {
  const { history, loading, error } = useTimeContext();

  if (loading) {
    return (
      <div className="history-section">
        <div className="loading-message">Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-section">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="history-section">
      <div className="history-header">
        <h2>History</h2>
        <div className="instructions">Your saved work days and calculated averages appear here.</div>
      </div>
      <div className="table-container">
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
            {history.map((entry, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{entry.date}</td>
                <td>{entry.totalWorked}</td>
                <td>{entry.overtime ? 'Yes' : 'No'}</td>
                <td>{entry.averageWorked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryTable;