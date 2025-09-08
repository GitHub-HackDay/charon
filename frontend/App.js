import React, { useState } from 'react';

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate })
      });
      if (!res.ok) throw new Error('Backend not available');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      // Use mocked data if backend is unavailable
      setTickets([
        {
          id: '1',
          key: 'JSD-101',
          fields: {
            summary: 'Mocked ticket 1',
            status: { name: 'Open' },
            created: '2025-09-01T10:00:00.000Z'
          }
        },
        {
          id: '2',
          key: 'JSD-102',
          fields: {
            summary: 'Mocked ticket 2',
            status: { name: 'Closed' },
            created: '2025-09-05T14:30:00.000Z'
          }
        }
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Jira Service Desk Tickets</h2>
      <div>
        <label>Start Date: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label>
        <label style={{ marginLeft: 16 }}>End Date: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
        <button style={{ marginLeft: 16 }} onClick={fetchTickets} disabled={loading}>Fetch Tickets</button>
      </div>
      <div style={{ marginTop: 32 }}>
        {loading ? <p>Loading...</p> : (
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
                  <td>{ticket.fields.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
