const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../mcp-server/.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Mock issues database - jumbled order
const mockIssues = [
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
    id: '23',
    key: 'JSD-123',
    fields: {
      summary: 'Alerting system overwhelmed by log volume spikes',
      status: { name: 'In Progress' },
      created: '2025-09-01T15:20:00.000Z',
      rootCause: 'Excessive logging overwhelming server storage'
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
    id: '10',
    key: 'JSD-110',
    fields: {
      summary: 'Gradual performance degradation in user session management',
      status: { name: 'Open' },
      created: '2025-09-03T15:40:00.000Z',
      rootCause: 'Memory allocation issues in Java codebase'
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
  if (startDate || endDate) {
    filtered = mockIssues.filter(issue => {
      const created = issue.fields.created;
      const createdDate = new Date(created);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date();
      
      return createdDate >= start && createdDate <= end;
    });
  }
  res.json({ issues: filtered });
});

// API for frontend
app.post('/api/tickets', async (req, res) => {
  const { startDate, endDate } = req.body;
  
  let jql;
  if (!startDate && !endDate) {
    // Default to past month if no dates provided
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const formattedDate = oneMonthAgo.toISOString().split('T')[0];
    jql = `created >= "${formattedDate}"`;
  } else {
    // Use provided dates
    const start = startDate || '1900-01-01';
    const end = endDate || new Date().toISOString().split('T')[0];
    jql = `created >= "${start}" AND created <= "${end}"`;
  }
  
  // Call local mock endpoint
  const response = await fetch(`http://localhost:4000/rest/api/3/search?jql=${encodeURIComponent(jql)}`);
  const data = await response.json();
  res.json(data.issues);
});

// Executive Summary API endpoint
app.post('/api/executive-summary', async (req, res) => {
  const { tickets } = req.body;
  
  try {
    // For demo purposes, return a mock summary
    // In production, this would call the MCP server
    const mockSummary = generateMockExecutiveSummary(tickets);
    
    // Simulate processing time
    setTimeout(() => {
      res.json({ summary: mockSummary });
    }, 2000);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate executive summary' });
  }
});

function generateMockExecutiveSummary(tickets) {
  const totalTickets = tickets.length;
  const rootCauses = {};
  const statuses = {};
  
  tickets.forEach(ticket => {
    const cause = ticket.fields.rootCause;
    const status = ticket.fields.status.name;
    
    rootCauses[cause] = (rootCauses[cause] || 0) + 1;
    statuses[status] = (statuses[status] || 0) + 1;
  });

  const topCauses = Object.entries(rootCauses)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return `**EXECUTIVE SUMMARY**

**Key Metrics:**
• Total Issues Analyzed: ${totalTickets}
• Critical/High Priority: ${(statuses['Critical'] || 0) + (statuses['High Priority'] || 0)} issues
• Open Issues: ${statuses['Open'] || 0}
• In Progress: ${statuses['In Progress'] || 0}

**Key Themes Identified:**

1. **Infrastructure Stability Issues** (${Math.round((totalTickets * 0.6))} issues)
   - Memory management failures in Java applications
   - Storage capacity exceeded due to excessive logging
   
2. **Security Vulnerabilities** (${Math.round((totalTickets * 0.3))} issues)
   - Incomplete security patch deployments
   - Authentication and authorization weaknesses

3. **Operational Process Gaps** (${Math.round((totalTickets * 0.1))} issues)
   - Monitoring and alerting system failures

**Root Cause Analysis:**
${topCauses.map(([cause, count]) => `• ${cause}: ${count} incidents (${Math.round((count/totalTickets)*100)}%)`).join('\n')}

**Business Impact Assessment:**
• **HIGH RISK**: Critical security vulnerabilities exposing customer data
• **MEDIUM RISK**: Performance degradation affecting user experience
• **OPERATIONAL**: Backup and monitoring system failures reducing resilience

**Recommendations:**

**Immediate Actions (0-30 days):**
• Deploy pending security patches across all systems
• Implement memory monitoring and alerting for Java applications
• Review and optimize logging policies to prevent disk space issues

**Strategic Initiatives (30-90 days):**
• Establish automated patch management process
• Implement comprehensive application performance monitoring
• Conduct security architecture review

**Priority Focus Areas:**
1. **Security First**: Address all Critical and High Priority security issues
2. **Infrastructure Resilience**: Resolve memory and storage management issues
3. **Operational Excellence**: Improve monitoring and incident response capabilities

**Next Steps:**
• Schedule executive briefing with IT leadership
• Assign dedicated teams to each priority focus area
• Establish weekly progress reviews until issues are resolved`;
}

// Polyfill fetch for Node.js
if (!global.fetch) {
  global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

// NLP Query endpoint with OpenAI integration
app.post('/api/query-nlp', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`Processing NLP query: "${query}"`);
    
    // Call OpenAI API for intelligent filtering
    const filteredTickets = await filterTicketsWithLLM(query, mockIssues);
    
    res.json({
      query: query,
      tickets: filteredTickets,
      count: filteredTickets.length
    });
  } catch (error) {
    console.error('Error processing NLP query:', error);
    
    // Fallback to keyword filtering if LLM fails
    console.log('Falling back to keyword-based filtering...');
    const filteredTickets = simulateNLPFilter(query, mockIssues);
    
    res.json({
      query: query,
      tickets: filteredTickets,
      count: filteredTickets.length,
      note: 'Used fallback filtering due to LLM error'
    });
  }
});

// LLM-powered ticket filtering
async function filterTicketsWithLLM(query, tickets) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log('No OpenAI API key found, using fallback filtering');
    return simulateNLPFilter(query, tickets);
  }

  try {
    const prompt = `You are an expert Jira ticket analyst. Given a natural language query, analyze the provided tickets and return ONLY the ticket IDs that match the query intent.

Query: "${query}"

Tickets to analyze:
${tickets.map(ticket => `
ID: ${ticket.id}
Key: ${ticket.key}
Summary: ${ticket.fields.summary}
Status: ${ticket.fields.status.name}
Root Cause: ${ticket.fields.rootCause}
Created: ${ticket.fields.created}
---`).join('')}

Instructions:
- Understand the intent behind the query (e.g., "security issues" should match tickets with security vulnerabilities)
- Consider status, severity, technology keywords, time references, etc.
- Return ONLY a JSON array of ticket IDs that match
- Be precise but not overly restrictive
- Example response: ["13", "18", "9"]

Response (JSON array only):`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a precise ticket filtering system. Always respond with a valid JSON array of ticket IDs that match the user query. No explanations, just the JSON array.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }

    const content = data.choices[0].message.content.trim();
    console.log('LLM response:', content);
    
    // Parse the LLM response
    let matchingIds;
    try {
      // Try to parse as JSON array
      matchingIds = JSON.parse(content);
      if (!Array.isArray(matchingIds)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      console.log('Failed to parse LLM response as JSON, extracting IDs manually');
      // Fallback: extract numbers from the response
      const idMatches = content.match(/\d+/g);
      matchingIds = idMatches ? [...new Set(idMatches)] : [];
    }
    
    console.log('Matching ticket IDs:', matchingIds);
    
    // Filter tickets based on LLM's selection
    const filteredTickets = tickets.filter(ticket => 
      matchingIds.includes(ticket.id) || matchingIds.includes(String(ticket.id))
    );
    
    console.log(`Filtered ${filteredTickets.length} tickets from ${tickets.length} total`);
    return filteredTickets;
    
  } catch (error) {
    console.error('LLM filtering error:', error);
    throw error;
  }
}

// Simple keyword-based filtering (fallback for when MCP is not available)
function simulateNLPFilter(query, tickets) {
  const lowerQuery = query.toLowerCase();
  
  // Check for status keywords
  if (lowerQuery.includes('critical') || lowerQuery.includes('urgent')) {
    return tickets.filter(ticket => 
      ticket.fields.status.name.toLowerCase().includes('critical') ||
      ticket.fields.status.name.toLowerCase().includes('urgent')
    );
  }
  
  if (lowerQuery.includes('open') || lowerQuery.includes('new')) {
    return tickets.filter(ticket => 
      ticket.fields.status.name.toLowerCase().includes('open') ||
      ticket.fields.status.name.toLowerCase().includes('new')
    );
  }
  
  if (lowerQuery.includes('in progress') || lowerQuery.includes('progress')) {
    return tickets.filter(ticket => 
      ticket.fields.status.name.toLowerCase().includes('progress')
    );
  }
  
  // Check for technology keywords
  if (lowerQuery.includes('security')) {
    return tickets.filter(ticket => 
      ticket.fields.summary.toLowerCase().includes('security') ||
      ticket.fields.rootCause.toLowerCase().includes('security')
    );
  }
  
  if (lowerQuery.includes('memory') || lowerQuery.includes('java')) {
    return tickets.filter(ticket => 
      ticket.fields.summary.toLowerCase().includes('memory') ||
      ticket.fields.rootCause.toLowerCase().includes('memory') ||
      ticket.fields.summary.toLowerCase().includes('java') ||
      ticket.fields.rootCause.toLowerCase().includes('java')
    );
  }
  
  if (lowerQuery.includes('network') || lowerQuery.includes('connection')) {
    return tickets.filter(ticket => 
      ticket.fields.summary.toLowerCase().includes('network') ||
      ticket.fields.summary.toLowerCase().includes('connection') ||
      ticket.fields.rootCause.toLowerCase().includes('network')
    );
  }
  
  // General text search in summary and root cause
  return tickets.filter(ticket => 
    ticket.fields.summary.toLowerCase().includes(lowerQuery) ||
    ticket.fields.rootCause.toLowerCase().includes(lowerQuery)
  );
}

app.listen(4000, () => {
  console.log('Mock Jira backend running on http://localhost:4000');
});
