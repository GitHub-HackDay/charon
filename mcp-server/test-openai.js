#!/usr/bin/env node

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Sample ticket data for testing
const testTickets = [
  {
    key: 'JSD-113',
    summary: 'Heap dumps generated repeatedly causing service disruption',
    status: 'Open',
    created: '2025-09-06T10:35:00.000Z',
    rootCause: 'Java runtime memory containment issues'
  },
  {
    key: 'JSD-108', 
    summary: 'Backup job failing due to insufficient disk space',
    status: 'In Progress',
    created: '2025-09-02T22:30:00.000Z',
    rootCause: 'Server storage consumed by excessive logging'
  },
  {
    key: 'JSD-118',
    summary: 'Outdated authentication library allowing session hijacking',
    status: 'Critical',
    created: '2025-09-04T16:25:00.000Z',
    rootCause: 'Gaps in security patch implementation'
  },
  {
    key: 'JSD-104',
    summary: 'Increasing response time in API endpoints leading to timeouts',
    status: 'Open',
    created: '2025-09-02T11:20:00.000Z',
    rootCause: 'Java application memory management failure'
  },
  {
    key: 'JSD-121',
    summary: 'SQL injection vulnerability in customer profile page',
    status: 'Open',
    created: '2025-09-07T10:05:00.000Z',
    rootCause: 'Security patches applied incompletely'
  }
];

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

async function testOpenAIAnalysis() {
  console.log('🔑 Testing OpenAI API Connection...\n');

  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ OPENAI_API_KEY not found!');
    console.log('📝 Please create a .env file with your API key:');
    console.log('   echo "OPENAI_API_KEY=your_actual_api_key_here" > .env\n');
    console.log('💡 Or set it as an environment variable:');
    console.log('   export OPENAI_API_KEY=your_actual_api_key_here\n');
    return;
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('📊 Analyzing sample tickets...\n');
    console.log('🎫 Sample tickets:');
    testTickets.forEach(ticket => {
      console.log(`   ${ticket.key}: ${ticket.summary}`);
    });
    console.log('\n⏳ Generating executive summary...\n');

    const prompt = generateAnalysisPrompt(testTickets);
    
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

    console.log('✅ Executive Summary Generated:\n');
    console.log('=' * 60);
    console.log(summary);
    console.log('=' * 60);
    console.log('\n🎉 Test completed successfully!');
    console.log('💡 The MCP server is ready to use with your API key.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'invalid_api_key') {
      console.log('\n🔧 API Key Issue:');
      console.log('   - Check that your API key is correct');
      console.log('   - Ensure you have OpenAI API credits');
      console.log('   - Verify the key has the necessary permissions');
    } else if (error.code === 'insufficient_quota') {
      console.log('\n💳 Quota Issue:');
      console.log('   - Your OpenAI account has insufficient credits');
      console.log('   - Add billing information to your OpenAI account');
    }
  }
}

testOpenAIAnalysis();
