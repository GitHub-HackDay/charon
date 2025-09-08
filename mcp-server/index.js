#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = new Server(
  {
    name: 'jira-analysis-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_jira_tickets',
        description: 'Analyze Jira tickets to identify themes and generate executive summary',
        inputSchema: {
          type: 'object',
          properties: {
            tickets: {
              type: 'array',
              description: 'Array of Jira ticket objects with summary, status, created date, and root cause',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  fields: {
                    type: 'object',
                    properties: {
                      summary: { type: 'string' },
                      status: { 
                        type: 'object',
                        properties: {
                          name: { type: 'string' }
                        }
                      },
                      created: { type: 'string' },
                      rootCause: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
          required: ['tickets'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'analyze_jira_tickets') {
    try {
      const { tickets } = args;
      
      // Generate the analysis prompt
      const ticketData = tickets.map(ticket => ({
        key: ticket.key,
        summary: ticket.fields.summary,
        status: ticket.fields.status.name,
        created: ticket.fields.created,
        rootCause: ticket.fields.rootCause
      }));

      const prompt = generateAnalysisPrompt(ticketData);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert IT operations analyst specializing in incident management and root cause analysis. Your task is to analyze service desk tickets and provide executive-level insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      });

      const summary = completion.choices[0].message.content;

      return {
        content: [
          {
            type: 'text',
            text: summary,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing tickets: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

function generateAnalysisPrompt(tickets) {
  const ticketSummaries = tickets.map(t => 
    `- ${t.key}: ${t.summary} (Status: ${t.status}, Root Cause: ${t.rootCause})`
  ).join('\n');

  return `Please analyze the following ${tickets.length} service desk tickets and provide an executive summary:

TICKETS:
${ticketSummaries}

Please provide an analysis that includes:

1. **Key Themes Identified**: What are the main patterns or categories of issues?

2. **Root Cause Analysis**: 
   - What are the primary root causes driving these incidents?
   - How frequently does each root cause appear?

3. **Business Impact Assessment**:
   - What types of business operations are being affected?
   - Which issues pose the highest risk?

4. **Recommendations**:
   - What immediate actions should be taken?
   - What strategic initiatives would prevent future occurrences?

5. **Priority Focus Areas**: What should leadership prioritize to address these systemic issues?

Format your response as a clear, executive-level summary suitable for senior management. Use bullet points and clear headings. Keep the tone professional and action-oriented.`;
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Jira Analysis MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
