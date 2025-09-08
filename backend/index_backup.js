
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Mock issues database
const mockIssues = [
  {
    id: '4',
    key: 'JSD-104',
    fields: {
      summary: 'Increasing response time in API endpoints leading to timeouts',
      status: { name: 'Open' },
      created: '2025-09-02T11:20:00.000Z',
      rootCause: 'Java application memory management failure'
    }
  },
  {
    id: '5',
    key: 'JSD-105',
    fields: {
      summary: 'Batch jobs failing to complete before business hours',
      status: { name: 'In Progress' },
      created: '2025-09-03T08:45:00.000Z',
      rootCause: 'Log volume exceeding disk capacity on servers'
    }
  },
  {
    id: '6',
    key: 'JSD-106',
    fields: {
      summary: 'Unauthorized access attempt detected on admin portal',
      status: { name: 'High Priority' },
      created: '2025-09-04T16:10:00.000Z',
      rootCause: 'Partial implementation of security updates'
    }
  },
  {
    id: '7',
    key: 'JSD-107',
    fields: {
      summary: 'OutOfMemoryError causing database connection pool exhaustion',
      status: { name: 'Open' },
      created: '2025-09-05T13:25:00.000Z',
      rootCause: 'Persistent memory leakage in Java services'
    }
  },
  {
    id: '8',
    key: 'JSD-108',
    fields: {
      summary: 'Backup job failing due to insufficient disk space',
      status: { name: 'In Progress' },
      created: '2025-09-02T22:30:00.000Z',
      rootCause: 'Server storage consumed by excessive logging'
    }
  },
  {
    id: '9',
    key: 'JSD-109',
    fields: {
      summary: 'Vulnerability in login page allowing credential harvesting',
      status: { name: 'Critical' },
      created: '2025-09-06T07:15:00.000Z',
      rootCause: 'Incomplete security patch deployment'
    }
  },
  {
    id: '10',
    key: 'JSD-110',
    fields: {
      summary: 'Gradual performance degradation in user session management',
      status: { name: 'Open' },
      created: '2025-09-03T15:40:00.000Z',
      rootCause: 'Memory allocation issues in Java codebase'
    }
  },
  {
    id: '11',
    key: 'JSD-111',
    fields: {
      summary: 'Monitoring alerts not being sent due to log directory overflow',
      status: { name: 'Resolved' },
      created: '2025-09-04T09:50:00.000Z',
      rootCause: 'Excessive log generation filling storage space'
    }
  },
  {
    id: '12',
    key: 'JSD-112',
    fields: {
      summary: 'SSL certificate validation bypassed on API gateway',
      status: { name: 'In Progress' },
      created: '2025-09-05T14:20:00.000Z',
      rootCause: 'Security updates not fully implemented'
    }
  },
  {
    id: '13',
    key: 'JSD-113',
    fields: {
      summary: 'Heap dumps generated repeatedly causing service disruption',
      status: { name: 'Open' },
      created: '2025-09-06T10:35:00.000Z',
      rootCause: 'Java runtime memory containment issues'
    }
  },
  {
    id: '14',
    key: 'JSD-114',
    fields: {
      summary: 'Database queries timing out due to log file contention',
      status: { name: 'In Progress' },
      created: '2025-09-07T12:15:00.000Z',
      rootCause: 'Disk saturation from logging activity'
    }
  },
  {
    id: '15',
    key: 'JSD-115',
    fields: {
      summary: 'Cross-site scripting vulnerability in search functionality',
      status: { name: 'Open' },
      created: '2025-09-01T17:45:00.000Z',
      rootCause: 'Unfinished security vulnerability remediation'
    }
  },
  {
    id: '16',
    key: 'JSD-116',
    fields: {
      summary: 'Microservice containers restarting due to memory pressure',
      status: { name: 'In Progress' },
      created: '2025-09-02T14:10:00.000Z',
      rootCause: 'Inefficient memory handling in Java components'
    }
  },
  {
    id: '17',
    key: 'JSD-117',
    fields: {
      summary: 'Report generation failures due to disk space exhaustion',
      status: { name: 'Resolved' },
      created: '2025-09-03T11:30:00.000Z',
      rootCause: 'Storage capacity overwhelmed by log files'
    }
  },
  {
    id: '18',
    key: 'JSD-118',
    fields: {
      summary: 'Outdated authentication library allowing session hijacking',
      status: { name: 'Critical' },
      created: '2025-09-04T16:25:00.000Z',
      rootCause: 'Gaps in security patch implementation'
    }
  },
  {
    id: '19',
    key: 'JSD-119',
    fields: {
      summary: 'JVM long GC pauses causing transaction timeouts',
      status: { name: 'Open' },
      created: '2025-09-05T09:40:00.000Z',
      rootCause: 'Memory leak patterns in Java application stack'
    }
  },
  {
    id: '20',
    key: 'JSD-120',
    fields: {
      summary: 'Configuration backup process failing due to insufficient space',
      status: { name: 'In Progress' },
      created: '2025-09-06T13:55:00.000Z',
      rootCause: 'Uncontrolled log growth consuming disk resources'
    }
  },
  {
    id: '21',
    key: 'JSD-121',
    fields: {
      summary: 'SQL injection vulnerability in customer profile page',
      status: { name: 'Open' },
      created: '2025-09-07T10:05:00.000Z',
      rootCause: 'Security patches applied incompletely'
    }
  },
  {
    id: '22',
    key: 'JSD-122',
    fields: {
      summary: 'Application server failover triggered by repeated memory exhaustion',
      status: { name: 'Critical' },
      created: '2025-09-08T08:30:00.000Z',
      rootCause: 'Java heap space memory leak'
    }
  },
  {
    id: '23',
    key: 'JSD-123',
    fields: {
      summary: 'Alerting system overwhelmed by log volume spikes',
      status: { name: 'In Progress' },
      created: '2025-09-01T15:20:00.000Z',
      rootCause: 'Excessive logging overwhelming server storage'
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
