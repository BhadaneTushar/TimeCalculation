import React from 'react';

function SummaryDisplay({ summary }) {
  if (!summary) {
    return null; // Don't render anything if summary is null
  }

  return (
    <div className="summary bg-gray-100 rounded p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Summary for {summary.date}</h2>
      <p className="text-gray-700 mb-1"><b>Times:</b> {summary.times.join(', ')}</p>
      <p className="text-gray-700 mb-1"><b>Total Worked:</b> {summary.totalWorked}</p>
      <p className="text-gray-700 mb-1"><b>{summary.overtime ? 'Overtime' : 'Remaining'}:</b> {summary.remainingOrOvertime}</p>
      <p className="text-gray-700 mb-1"><b>Average Worked:</b> {summary.averageWorked}</p>
    </div>
  );
}

export default SummaryDisplay;
import React from 'react';

function SummaryDisplay({ summary }) {
  if (!summary) {
    return null; // Don't render anything if summary is null
  }

  return (
    <div className="summary">
      <h2>Summary for {summary.date}</h2>
      <p><b>Times:</b> {summary.times.join(', ')}</p>
      <p><b>Total Worked:</b> {summary.totalWorked}</p>
      <p><b>{summary.overtime ? 'Overtime' : 'Remaining'}:</b> {summary.remainingOrOvertime}</p>
      <p><b>Average Worked:</b> {summary.averageWorked}</p>
    </div>
  );
}

export default SummaryDisplay;
import React from 'react';

function SummaryDisplay({ summary }) {
  if (!summary) {
    return null; // Don't render anything if summary is null
  }

  return (
    <div className="summary">
      <h2>Summary for {summary.date}</h2>
      <p><b>Times:</b> {summary.times.join(', ')}</p>
      <p><b>Total Worked:</b> {summary.totalWorked}</p>
      <p><b>{summary.overtime ? 'Overtime' : 'Remaining'}:</b> {summary.remainingOrOvertime}</p>
      <p><b>Average Worked:</b> {summary.averageWorked}</p>
    </div>
  );
}

export default SummaryDisplay;