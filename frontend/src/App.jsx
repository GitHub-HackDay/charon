
import React, { useState } from 'react';

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

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
      console.error('Failed to fetch tickets:', err);
      setTickets([]);
    }
    setLoading(false);
  };

  const generateExecutiveSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/executive-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets })
      });
      if (!res.ok) throw new Error('Summary generation failed');
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      setSummary('Failed to generate executive summary. Please try again.');
    }
    setSummaryLoading(false);
  };

  return (
    <div style={{ 
      padding: '1rem', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      width: '100%'
    }}>
      <div style={{ 
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '2rem',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '2rem', 
            fontWeight: '700' 
          }}>
            Charon - Jira Service Desk Console
          </h1>
          <p style={{ 
            margin: '0.5rem 0 0 0', 
            opacity: 0.9 
          }}>
            Query and analyze service desk tickets by time window
          </p>
        </div>
        
        <div style={{ padding: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'end',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Start Date
              </label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                End Date
              </label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            
            <button 
              onClick={fetchTickets} 
              disabled={loading}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: loading ? '#9ca3af' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={e => !loading && (e.target.style.backgroundColor = '#5a67d8')}
              onMouseOut={e => !loading && (e.target.style.backgroundColor = '#667eea')}
            >
              {loading ? 'Fetching...' : 'Fetch Tickets'}
            </button>
          </div>

          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem',
              color: '#6b7280'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              Loading tickets...
            </div>
          ) : (
            <>
              {tickets.length > 0 && (
                <>
                  <div style={{ 
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #0ea5e9',
                    textAlign: 'center'
                  }}>
                    <strong style={{ color: '#0369a1' }}>
                      Found {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
                    </strong>
                  </div>

                  {/* Executive Summary Section */}
                  <div style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    backgroundColor: '#fff7ed',
                    borderRadius: '12px',
                    border: '1px solid #fb923c',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}>
                    <h3 style={{
                      margin: '0 0 1rem 0',
                      color: '#ea580c',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      textAlign: 'center'
                    }}>
                      📊 Executive Summary
                    </h3>
                    <div style={{
                      backgroundColor: '#fef3c7',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #f59e0b',
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>
                      <button
                        onClick={() => generateExecutiveSummary()}
                        disabled={summaryLoading}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: summaryLoading ? '#9ca3af' : '#ea580c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: summaryLoading ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={e => !summaryLoading && (e.target.style.backgroundColor = '#dc2626')}
                        onMouseOut={e => !summaryLoading && (e.target.style.backgroundColor = '#ea580c')}
                      >
                        {summaryLoading ? '🔄 Generating...' : '🤖 Generate AI Summary'}
                      </button>
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      color: '#7c2d12'
                    }}>
                      {summary ? (
                        <div style={{
                          backgroundColor: 'white',
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid #d97706',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {summary}
                        </div>
                      ) : (
                        <p style={{ margin: 0, fontStyle: 'italic' }}>
                          Click the button above to analyze ticket themes and generate an executive summary using AI.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}>
                <div style={{ 
                  overflowX: 'auto',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  width: '100%',
                  maxWidth: '1400px'
                }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '0.875rem'
                }}>
                  <thead>
                    <tr style={{ 
                      backgroundColor: '#f8fafc',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: '700',
                        color: '#374151',
                        minWidth: '100px'
                      }}>Key</th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: '700',
                        color: '#374151',
                        minWidth: '300px'
                      }}>Summary</th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: '700',
                        color: '#374151',
                        minWidth: '100px'
                      }}>Status</th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: '700',
                        color: '#374151',
                        minWidth: '150px'
                      }}>Created</th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: '700',
                        color: '#374151',
                        minWidth: '200px'
                      }}>Root Cause</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket, index) => (
                      <tr 
                        key={ticket.id}
                        style={{ 
                          borderBottom: '1px solid #e5e7eb',
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9fafb'}
                      >
                        <td style={{ 
                          padding: '1rem',
                          fontWeight: '600',
                          color: '#1d4ed8'
                        }}>{ticket.key}</td>
                        <td style={{ 
                          padding: '1rem',
                          lineHeight: '1.5'
                        }}>{ticket.fields.summary}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: 
                              ticket.fields.status.name === 'Open' ? '#fef3c7' :
                              ticket.fields.status.name === 'Critical' ? '#fee2e2' :
                              ticket.fields.status.name === 'High Priority' ? '#fed7d7' :
                              ticket.fields.status.name === 'In Progress' ? '#dbeafe' :
                              ticket.fields.status.name === 'Resolved' ? '#d1fae5' :
                              '#e5e7eb',
                            color:
                              ticket.fields.status.name === 'Open' ? '#92400e' :
                              ticket.fields.status.name === 'Critical' ? '#991b1b' :
                              ticket.fields.status.name === 'High Priority' ? '#dc2626' :
                              ticket.fields.status.name === 'In Progress' ? '#1e40af' :
                              ticket.fields.status.name === 'Resolved' ? '#065f46' :
                              '#374151'
                          }}>
                            {ticket.fields.status.name}
                          </span>
                        </td>
                        <td style={{ 
                          padding: '1rem',
                          color: '#6b7280'
                        }}>
                          {new Date(ticket.fields.created).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td style={{ 
                          padding: '1rem',
                          fontSize: '0.8rem',
                          color: '#6b7280',
                          fontStyle: 'italic'
                        }}>
                          {ticket.fields.rootCause}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
              
              {tickets.length === 0 && !loading && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '4rem',
                  color: '#6b7280'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem'
                  }}>📋</div>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0',
                    color: '#374151'
                  }}>No tickets found</h3>
                  <p style={{ margin: 0 }}>
                    Try adjusting your date range or fetch tickets first
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
