function HistoryTable({ history }) {
  return (
    <>
      <h2>History</h2>
      <table className="history-table min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Worked</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Worked</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* Sort history by date descending for display */}
          {history.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.date}</td>
              <td>{entry.totalWorked}</td>
              <td>{entry.overtime ? 'Yes' : 'No'}</td>
              <td>{entry.averageWorked}</td>
            </tr>//
          ))}
        </tbody>
      </table>
    </>
  );
}

export default HistoryTable;