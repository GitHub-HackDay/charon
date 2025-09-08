#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sample ticket data for testing
const testTickets = [
  {
    key: 'JSD-101',
    fields: {
      summary: 'Application crashes during peak load due to memory issues',
      status: { name: 'Open' },
      created: '2025-09-01T10:00:00.000Z',
      rootCause: 'Java application memory management failure'
    }
  },
  {
    key: 'JSD-102',
    fields: {
      summary: 'Database backup failing due to insufficient disk space',
      status: { name: 'Critical' },
      created: '2025-09-02T14:30:00.000Z',
      rootCause: 'Server storage consumed by excessive logging'
    }
  },
  {
    key: 'JSD-103',
    fields: {
      summary: 'Security vulnerability in login system allowing unauthorized access',
      status: { name: 'High Priority' },
      created: '2025-09-03T09:15:00.000Z',
      rootCause: 'Incomplete security patch deployment'
    }
  }
];

async function testMCPServer() {
  console.log('🚀 Testing MCP Server...\n');
  
  // Check if .env file exists
  try {
    const fs = await import('fs');
    if (!fs.existsSync('.env')) {
      console.log('❌ .env file not found!');
      console.log('📝 Please create a .env file with your OpenAI API key:');
      console.log('   echo "OPENAI_API_KEY=your_api_key_here" > .env\n');
      return;
    }
  } catch (error) {
    console.log('⚠️  Could not check for .env file');
  }

  // Spawn the MCP server
  const serverProcess = spawn('node', ['index.js'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let output = '';
  let errors = '';

  serverProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  serverProcess.stderr.on('data', (data) => {
    errors += data.toString();
  });

  // Wait a moment for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Send list tools request
    const listToolsRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    };

    console.log('📋 Sending list tools request...');
    serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');

    // Send analyze tickets request
    const analyzeRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'analyze_jira_tickets',
        arguments: {
          tickets: testTickets
        }
      }
    };

    console.log('🔍 Sending ticket analysis request...');
    serverProcess.stdin.write(JSON.stringify(analyzeRequest) + '\n');

    // Wait for responses
    await new Promise(resolve => setTimeout(resolve, 5000));

    serverProcess.kill();

    console.log('\n📊 Server Output:');
    console.log(output);
    
    if (errors) {
      console.log('\n❌ Server Errors:');
      console.log(errors);
    }

    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    serverProcess.kill();
  }
}

// Check for API key in environment
if (!process.env.OPENAI_API_KEY) {
  console.log('❌ OPENAI_API_KEY not found in environment');
  console.log('📝 Please set your API key:');
  console.log('   export OPENAI_API_KEY=your_api_key_here');
  console.log('   or create a .env file with OPENAI_API_KEY=your_api_key_here\n');
  process.exit(1);
}

testMCPServer().catch(console.error);
