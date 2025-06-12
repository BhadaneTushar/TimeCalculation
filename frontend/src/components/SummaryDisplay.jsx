import React from 'react';
import { useTimeContext } from '../context/TimeContext';

function SummaryDisplay() {
  const { summary } = useTimeContext();

  if (!summary) {
    return null;
  }

  return (
    <div className="summary-section">
      <div className="flex items-center mb-2">
        <div className="summary-bar" style={{ width: 6, height: 32, background: '#1a237e', borderRadius: 4, marginRight: 12 }}></div>
        <h2 className="text-2xl font-bold mb-0" style={{ color: '#1a237e' }}>Summary for {summary.date}</h2>
      </div>
      <div className="summary-content">
        <p className="text-gray-700 mb-1"><b>Times:</b> {summary.times.join(', ')}</p>
        <p className="text-gray-700 mb-1"><b>Total Worked:</b> {summary.totalWorked}</p>
        <p className="text-gray-700 mb-1"><b>{summary.overtime ? 'Overtime' : 'Remaining'}:</b> {summary.remainingOrOvertime}</p>
        <p className="text-gray-700 mb-1"><b>Average Worked:</b> {summary.averageWorked}</p>
      </div>
    </div>
  );
}

export default SummaryDisplay;