
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Mock issues database
const mockIssues = [
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
  },
  {
    id: '3',
    key: 'JSD-103',
    fields: {
      summary: 'Mocked ticket 3',
      status: { name: 'In Progress' },
      created: '2025-09-07T09:15:00.000Z'
    }
  }
];

// Simulate Jira JQL search API
app.get('/rest/api/3/search', (req, res) => {
  const { jql } = req.query;
  // Parse JQL for created >= and created <=
  let startDate = null, endDate = null;
  if (jql) {
    const startMatch = jql.match(/created >= "([^"]+)"/);
    const endMatch = jql.match(/created <= "([^"]+)"/);
    if (startMatch) startDate = startMatch[1];
    if (endMatch) endDate = endMatch[1];
  }
  let filtered = mockIssues;
  if (startDate && endDate) {
    filtered = mockIssues.filter(issue => {
      const created = issue.fields.created;
      return created >= startDate && created <= endDate;
    });
  }
  res.json({ issues: filtered });
});

// API for frontend
app.post('/api/tickets', async (req, res) => {
  const { startDate, endDate } = req.body;
  // Simulate JQL query
  const jql = `created >= "${startDate}" AND created <= "${endDate}"`;
  // Call local mock endpoint
  const response = await fetch(`http://localhost:4000/rest/api/3/search?jql=${encodeURIComponent(jql)}`);
  const data = await response.json();
  res.json(data.issues);
});

// Polyfill fetch for Node.js
if (!global.fetch) {
  global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

app.listen(4000, () => {
  console.log('Mock Jira backend running on http://localhost:4000');
});
