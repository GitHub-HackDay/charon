
import React, { useState } from 'react';

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate,
          endDate: endDate
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tickets = await response.json();
      setTickets(tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      alert('Failed to fetch tickets. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Jira Service Desk Tickets</h2>
      <div>
        <label>Start Date: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
        <label style={{ marginLeft: 16 }}>End Date: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
        <button style={{ marginLeft: 16 }} onClick={fetchTickets} disabled={loading || !startDate || !endDate}>
          {loading ? 'Loading...' : 'Fetch Tickets'}
        </button>
      </div>
      <div style={{ marginTop: 32 }}>
        {loading ? <p>Loading...</p> : (
          tickets.length === 0 ? (
            <p>No tickets found. Please select a date range and click "Fetch Tickets".</p>
          ) : (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Summary</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id}>
                    <td>{ticket.key}</td>
                    <td>{ticket.fields.summary}</td>
                    <td>{ticket.fields.status.name}</td>
                    <td>{new Date(ticket.fields.created).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}

export default App;
