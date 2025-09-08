# Jira Analysis MCP Server

This Model Context Protocol (MCP) server analyzes Jira Service Desk tickets to identify themes and generate executive summaries using AI.

## Features

- **Theme Identification**: Automatically categorizes issues based on patterns in summaries and root causes
- **Root Cause Analysis**: Analyzes frequency and impact of different root causes
- **Executive Summary Generation**: Creates business-focused summaries suitable for senior management
- **Business Impact Assessment**: Evaluates risk levels and operational impact

## Setup

1. **Install Dependencies**:
   ```bash
   cd mcp-server
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Configure OpenAI API Key**:
   ```bash
   echo "OPENAI_API_KEY=your_actual_api_key_here" > .env
   ```

## Usage

### As Standalone MCP Server

```bash
npm start
```

The server runs on stdio and can be integrated with MCP-compatible clients.

### Integration with Backend

The backend includes a mock implementation that demonstrates the expected output format. To use the real MCP server:

1. Install MCP client dependencies in the backend
2. Replace the mock `generateMockExecutiveSummary` function with actual MCP server calls
3. Configure the MCP client to connect to this server

## API

### Tools

#### `analyze_jira_tickets`

Analyzes an array of Jira tickets and generates an executive summary.

**Input Schema**:
```json
{
  "tickets": [
    {
      "key": "JSD-101",
      "fields": {
        "summary": "Issue description",
        "status": { "name": "Open" },
        "created": "2025-09-01T10:00:00.000Z",
        "rootCause": "Root cause description"
      }
    }
  ]
}
```

**Output**: Structured executive summary with:
- Key themes and patterns
- Root cause frequency analysis
- Business impact assessment
- Strategic recommendations
- Priority focus areas

## Prompt Engineering

The analysis prompt is designed to:

1. **Categorize Issues**: Group similar problems into themes
2. **Quantify Impact**: Assess business and operational impact
3. **Identify Patterns**: Find recurring root causes
4. **Generate Actionable Insights**: Provide specific recommendations
5. **Executive Focus**: Format for senior management consumption

### Sample Analysis Output

```
**Key Themes Identified**: 
- Infrastructure stability issues (60% of tickets)
- Security vulnerabilities (30% of tickets)
- Operational process gaps (10% of tickets)

**Root Cause Analysis**:
- Java application memory leaks: 8 incidents (42%)
- Incomplete security patching: 6 incidents (32%)
- Excessive logging issues: 5 incidents (26%)

**Recommendations**:
- Immediate: Deploy security patches, implement memory monitoring
- Strategic: Automated patch management, performance monitoring
- Priority: Security vulnerabilities, infrastructure resilience
```

## Configuration

### Model Settings

- **Model**: GPT-4 (configurable)
- **Temperature**: 0.3 (focused, consistent analysis)
- **Max Tokens**: 1000 (detailed but concise summaries)

### Customization

Modify the `generateAnalysisPrompt()` function to:
- Add industry-specific analysis
- Include additional data fields
- Customize output format
- Adjust analysis depth

## Integration Examples

### With Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "jira-analysis": {
      "command": "node",
      "args": ["/path/to/charon/mcp-server/index.js"],
      "env": {
        "OPENAI_API_KEY": "your_api_key"
      }
    }
  }
}
```

### With Custom Applications

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const client = new Client({
  name: "jira-analyzer",
  version: "1.0.0"
});

const result = await client.callTool({
  name: "analyze_jira_tickets",
  arguments: { tickets: ticketData }
});
```

## Development

### Adding New Analysis Features

1. Extend the `inputSchema` for additional data fields
2. Modify the `generateAnalysisPrompt()` function
3. Update the system prompt for new analysis types
4. Test with sample data

### Error Handling

The server includes comprehensive error handling for:
- Invalid input data
- OpenAI API failures
- Network connectivity issues
- Malformed ticket data

## Requirements

- Node.js 18+
- OpenAI API key
- MCP SDK dependencies
