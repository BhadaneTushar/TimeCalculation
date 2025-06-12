import { useState, useEffect } from 'react';
import './App.css';
import TimeEntryForm from './components/TimeEntryForm';
import SummaryDisplay from './components/SummaryDisplay';
import HistoryTable from './components/HistoryTable';
import { TimeProvider } from './context/TimeContext';

function App() {
  return (
    <TimeProvider>
      <div className="app-container">
        <div className="header">
          <h1>Average Time Calculator</h1>
        </div>
        <main>
          <div className="form-section">
            <TimeEntryForm />
          </div>
          <div className="summary-section">
            <SummaryDisplay />
          </div>
          <div className="history-section">
            <HistoryTable />
          </div>
        </main>
      </div>
    </TimeProvider>
  );
}

export default App;
