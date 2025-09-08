
import React, { useState, useEffect } from 'react';

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [nlpQuery, setNlpQuery] = useState('');
  const [nlpResults, setNlpResults] = useState([]);
  const [nlpLoading, setNlpLoading] = useState(false);
  const [showNlpResults, setShowNlpResults] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // No date filtering needed - backend will default to past month
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

  // Auto-load tickets when component mounts
  useEffect(() => {
    fetchTickets();
  }, []);

  const generateExecutiveSummary = async () => {
    setSummaryLoading(true);
    try {
      const ticketsToAnalyze = showNlpResults ? nlpResults : tickets;
      const res = await fetch('http://localhost:4000/api/executive-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets: ticketsToAnalyze })
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

  const queryWithNLP = async () => {
    if (!nlpQuery.trim()) return;
    
    setNlpLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/query-nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: nlpQuery })
      });
      if (!res.ok) throw new Error('NLP query failed');
      const data = await res.json();
      setNlpResults(data.tickets);
      setShowNlpResults(true);
    } catch (err) {
      console.error('Failed to execute NLP query:', err);
      setNlpResults([]);
    }
    setNlpLoading(false);
  };

  const clearNlpResults = () => {
    setShowNlpResults(false);
    setNlpResults([]);
    setNlpQuery('');
    setSummary(''); // Clear summary when switching back to regular view
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
            AI-powered service desk analytics with natural language queries
          </p>
        </div>
        
        <div style={{ padding: '2rem' }}>
          {/* Executive Summary Section - First section after header */}
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
                disabled={summaryLoading || (tickets.length === 0 && nlpResults.length === 0)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: summaryLoading || (tickets.length === 0 && nlpResults.length === 0) ? '#9ca3af' : '#ea580c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: summaryLoading || (tickets.length === 0 && nlpResults.length === 0) ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={e => !summaryLoading && (tickets.length > 0 || nlpResults.length > 0) && (e.target.style.backgroundColor = '#dc2626')}
                onMouseOut={e => !summaryLoading && (tickets.length > 0 || nlpResults.length > 0) && (e.target.style.backgroundColor = '#ea580c')}
              >
                {summaryLoading ? '🔄 Generating...' : '🤖 Generate AI Summary'}
              </button>
              <p style={{ 
                margin: '0.5rem 0 0 0', 
                fontSize: '0.75rem', 
                color: '#a16207' 
              }}>
                {(tickets.length === 0 && nlpResults.length === 0) ? (
                  'Loading tickets...'
                ) : showNlpResults ? (
                  `Analyzing ${nlpResults.length} filtered tickets`
                ) : (
                  `Analyzing all ${tickets.length} tickets`
                )}
              </p>
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
                  {(tickets.length === 0 && nlpResults.length === 0) ? 
                    'Tickets will load automatically. Then click the button above to analyze themes and generate an executive summary using AI.' :
                    'Click the button above to analyze ticket themes and generate an executive summary using AI.'
                  }
                </p>
              )}
            </div>
          </div>

          {/* NLP Query Section */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: '#374151',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              🔍 Natural Language Query
            </h3>
            <p style={{
              margin: '0 0 1rem 0',
              color: '#6b7280',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              Ask questions about tickets in natural language (e.g., "Show me critical security issues" or "Find memory related problems")
            </p>
            
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'stretch',
              justifyContent: 'center',
              flexWrap: 'wrap',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ 
                flex: '1', 
                minWidth: '300px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={nlpQuery}
                  onChange={e => setNlpQuery(e.target.value)}
                  placeholder="e.g., 'Show me all security issues' or 'Find Java memory problems'"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    height: '48px',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#10b981'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  onKeyPress={e => e.key === 'Enter' && queryWithNLP()}
                />
              </div>
              
              <button
                onClick={queryWithNLP}
                disabled={nlpLoading || !nlpQuery.trim()}
                style={{
                  padding: '0 1.5rem',
                  backgroundColor: nlpLoading || !nlpQuery.trim() ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: nlpLoading || !nlpQuery.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  height: '48px',
                  minWidth: '100px',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={e => !nlpLoading && nlpQuery.trim() && (e.target.style.backgroundColor = '#059669')}
                onMouseOut={e => !nlpLoading && nlpQuery.trim() && (e.target.style.backgroundColor = '#10b981')}
              >
                {nlpLoading ? 'Searching...' : 'Search'}
              </button>

              {showNlpResults && (
                <button
                  onClick={clearNlpResults}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = '#dc2626'}
                  onMouseOut={e => e.target.style.backgroundColor = '#ef4444'}
                >
                  Clear
                </button>
              )}
            </div>

            {showNlpResults && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #d1d5db'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
                  Query Results: "{nlpQuery}" ({nlpResults.length} tickets found)
                </h4>
              </div>
            )}
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
              {/* Display NLP Results or Regular Tickets */}
              {(showNlpResults ? nlpResults.length > 0 : tickets.length > 0) && (
                <>
                  <div style={{ 
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: showNlpResults ? '#f0fdf4' : '#f0f9ff',
                    borderRadius: '8px',
                    border: showNlpResults ? '1px solid #10b981' : '1px solid #0ea5e9',
                    textAlign: 'center'
                  }}>
                    <strong style={{ color: showNlpResults ? '#047857' : '#0369a1' }}>
                      {showNlpResults ? (
                        <>🔍 Query Results: Found {nlpResults.length} ticket{nlpResults.length !== 1 ? 's' : ''} matching "{nlpQuery}"</>
                      ) : (
                        <>Found {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</>
                      )}
                    </strong>
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
                    {(showNlpResults ? nlpResults : tickets).map((ticket, index) => (
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
