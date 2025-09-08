const express = require('express');
const cors = require('cors');
const path = require('path');

// Try multiple paths for .env file
const envPaths = [
  path.join(__dirname, '.env'),
  path.join(__dirname, '../mcp-server/.env'),
  path.join(__dirname, '../.env')
];

for (const envPath of envPaths) {
  try {
    require('dotenv').config({ path: envPath });
    if (process.env.OPENAI_API_KEY) {
      console.log(`Loaded OpenAI API key from: ${envPath}`);
      break;
    }
  } catch (error) {
    // Continue to next path
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// Mock issues database - 100 issues with consistent themes (jumbled order)
const mockIssues = [
  {
    id: '41',
    key: 'JSD-141',
    fields: {
      summary: 'Memory mapped file leaks consuming virtual memory',
      status: { name: 'Critical' },
      created: '2025-09-06T14:15:00.000Z',
      rootCause: 'Memory mapped files not properly unmapped after use',
      description: 'Persistent memory mappings exhausting virtual address space'
    }
  },
  {
    id: '94',
    key: 'JSD-194',
    fields: {
      summary: 'Port exhaustion preventing new outbound connections',
      status: { name: 'Critical' },
      created: '2025-09-07T15:40:00.000Z',
      rootCause: 'Ephemeral port range exhausted by application connections',
      description: 'Application unable to establish new network connections'
    }
  },
  {
    id: '32',
    key: 'JSD-132',
    fields: {
      summary: 'Native memory leak in JNI library integration',
      status: { name: 'Critical' },
      created: '2025-09-03T14:40:00.000Z',
      rootCause: 'Native code not properly releasing allocated memory',
      description: 'JNI calls accumulating native memory outside JVM heap'
    }
  },
  {
    id: '2',
    key: 'JSD-102',
    fields: {
      summary: 'Cross-site scripting attack vector in comment system',
      status: { name: 'High Priority' },
      created: '2025-09-01T10:30:00.000Z',
      rootCause: 'Insufficient output encoding in web components',
      description: 'User comments allow script injection due to inadequate XSS protection'
    }
  },
  {
    id: '12',
    key: 'JSD-112',
    fields: {
      summary: 'Hardcoded credentials found in application configuration',
      status: { name: 'Critical' },
      created: '2025-09-04T14:50:00.000Z',
      rootCause: 'Configuration management practices not following security guidelines',
      description: 'Database passwords and API keys embedded in source code'
    }
  },
  {
    id: '97',
    key: 'JSD-197',
    fields: {
      summary: 'Network monitoring agent consuming excessive bandwidth',
      status: { name: 'Critical' },
      created: '2025-09-08T14:45:00.000Z',
      rootCause: 'Monitoring data collection frequency too high',
      description: 'Network monitoring traffic impacting application performance'
    }
  },
  {
    id: '21',
    key: 'JSD-121',
    fields: {
      summary: 'LDAP injection vulnerability in user search functionality',
      status: { name: 'High Priority' },
      created: '2025-09-07T18:35:00.000Z',
      rootCause: 'LDAP query construction without proper input sanitization',
      description: 'User search inputs allow LDAP injection attacks'
    }
  },
  {
    id: '64',
    key: 'JSD-164',
    fields: {
      summary: 'System swap file creation failed due to no available space',
      status: { name: 'Critical' },
      created: '2025-09-05T17:40:00.000Z',
      rootCause: 'Root partition filled preventing swap file expansion',
      description: 'System unable to handle memory pressure without swap space'
    }
  },
  {
    id: '31',
    key: 'JSD-131',
    fields: {
      summary: 'Thread pool exhaustion causing request timeouts',
      status: { name: 'Open' },
      created: '2025-09-03T10:25:00.000Z',
      rootCause: 'Thread pool configuration inadequate for peak load',
      description: 'All worker threads blocked causing new requests to timeout'
    }
  },
  {
    id: '19',
    key: 'JSD-119',
    fields: {
      summary: 'File upload vulnerability allowing executable code injection',
      status: { name: 'Critical' },
      created: '2025-09-07T10:25:00.000Z',
      rootCause: 'File type validation insufficient in upload mechanism',
      description: 'PHP and executable files can be uploaded and executed on server'
    }
  },
  {
    id: '29',
    key: 'JSD-129',
    fields: {
      summary: 'Memory leak in connection pool preventing database access',
      status: { name: 'Critical' },
      created: '2025-09-02T12:55:00.000Z',
      rootCause: 'Database connections not properly released after exceptions',
      description: 'Connection pool exhaustion after handling database errors'
    }
  },
  {
    id: '79',
    key: 'JSD-179',
    fields: {
      summary: 'Load balancer health checks causing false positive failures',
      status: { name: 'Critical' },
      created: '2025-09-02T10:15:00.000Z',
      rootCause: 'Health check endpoint responding incorrectly under load',
      description: 'Healthy servers marked as down by load balancer'
    }
  },
  {
    id: '22',
    key: 'JSD-122',
    fields: {
      summary: 'Cryptographic nonce reuse in encryption implementation',
      status: { name: 'Critical' },
      created: '2025-09-08T09:50:00.000Z',
      rootCause: 'Static initialization vectors used in AES encryption',
      description: 'Predictable IVs compromise encryption security'
    }
  },
  {
    id: '53',
    key: 'JSD-153',
    fields: {
      summary: 'Backup process failing due to insufficient storage space',
      status: { name: 'High Priority' },
      created: '2025-09-01T15:35:00.000Z',
      rootCause: 'Backup retention policies exceeding available disk capacity',
      description: 'Daily backups accumulating beyond storage limits'
    }
  },
  {
    id: '20',
    key: 'JSD-120',
    fields: {
      summary: 'Password reset token predictable and reusable',
      status: { name: 'High Priority' },
      created: '2025-09-07T14:10:00.000Z',
      rootCause: 'Weak random number generation for password reset tokens',
      description: 'Reset tokens can be guessed or reused multiple times'
    }
  },
  {
    id: '68',
    key: 'JSD-168',
    fields: {
      summary: 'Log shipping queue accumulating due to network issues',
      status: { name: 'Critical' },
      created: '2025-09-06T19:20:00.000Z',
      rootCause: 'Network connectivity problems preventing log transmission',
      description: 'Local log queue filling disk while remote shipping fails'
    }
  },
  {
    id: '25',
    key: 'JSD-125',
    fields: {
      summary: 'OAuth state parameter missing enabling CSRF attacks',
      status: { name: 'High Priority' },
      created: '2025-09-08T20:15:00.000Z',
      rootCause: 'OAuth implementation lacks CSRF protection mechanisms',
      description: 'OAuth flows vulnerable to cross-site request forgery'
    }
  },
  {
    id: '55',
    key: 'JSD-155',
    fields: {
      summary: 'Log aggregation system overwhelming central storage',
      status: { name: 'High Priority' },
      created: '2025-09-02T14:25:00.000Z',
      rootCause: 'Log shipping rate exceeding storage system capacity',
      description: 'Centralized logging infrastructure running out of space'
    }
  },
  {
    id: '95',
    key: 'JSD-195',
    fields: {
      summary: 'Network time synchronization drift affecting distributed systems',
      status: { name: 'High Priority' },
      created: '2025-09-07T19:15:00.000Z',
      rootCause: 'NTP service configuration issues causing time drift',
      description: 'Clock skew between servers causing distributed lock failures'
    }
  },
  {
    id: '92',
    key: 'JSD-192',
    fields: {
      summary: 'Proxy server authentication failing for external requests',
      status: { name: 'High Priority' },
      created: '2025-09-06T17:50:00.000Z',
      rootCause: 'Proxy authentication credentials expired',
      description: 'Outbound requests failing due to proxy authentication'
    }
  },
  {
    id: '34',
    key: 'JSD-134',
    fields: {
      summary: 'Memory fragmentation preventing large object allocation',
      status: { name: 'Open' },
      created: '2025-09-04T09:30:00.000Z',
      rootCause: 'Heap fragmentation from mixed object size allocation patterns',
      description: 'Available heap space fragmented preventing large allocations'
    }
  },
  {
    id: '51',
    key: 'JSD-151',
    fields: {
      summary: 'Application logs consuming entire disk partition',
      status: { name: 'Critical' },
      created: '2025-09-01T07:45:00.000Z',
      rootCause: 'Log rotation policies not properly configured',
      description: 'Log files growing without bounds filling system disk'
    }
  },
  {
    id: '6',
    key: 'JSD-106',
    fields: {
      summary: 'CSRF token validation bypass in critical operations',
      status: { name: 'High Priority' },
      created: '2025-09-02T15:10:00.000Z',
      rootCause: 'Cross-site request forgery protection inadequately implemented',
      description: 'State-changing operations can be triggered without proper CSRF validation'
    }
  },
  {
    id: '1',
    key: 'JSD-101',
    fields: {
      summary: 'SQL injection vulnerability in user authentication module',
      status: { name: 'Critical' },
      created: '2025-09-01T08:15:00.000Z',
      rootCause: 'Input validation bypass in security framework',
      description: 'User input not properly sanitized allowing SQL injection attacks through login form'
    }
  },
  {
    id: '54',
    key: 'JSD-154',
    fields: {
      summary: 'Temporary file accumulation in system temp directory',
      status: { name: 'Open' },
      created: '2025-09-02T09:50:00.000Z',
      rootCause: 'Temporary file cleanup not implemented in application code',
      description: 'Processing operations leaving temporary files undeleted'
    }
  },
  {
    id: '4',
    key: 'JSD-104',
    fields: {
      summary: 'Authentication bypass through session token manipulation',
      status: { name: 'Critical' },
      created: '2025-09-02T09:20:00.000Z',
      rootCause: 'Session management vulnerabilities in JWT implementation',
      description: 'JWT tokens can be modified to escalate privileges without proper validation'
    }
  },
  {
    id: '24',
    key: 'JSD-124',
    fields: {
      summary: 'Timing attack vulnerability in password comparison',
      status: { name: 'Open' },
      created: '2025-09-08T16:40:00.000Z',
      rootCause: 'Non-constant time string comparison in authentication',
      description: 'Password verification timing differences leak information'
    }
  },
  {
    id: '63',
    key: 'JSD-163',
    fields: {
      summary: 'Database query performance degraded by log file contention',
      status: { name: 'Open' },
      created: '2025-09-05T13:25:00.000Z',
      rootCause: 'Database and application logs competing for disk I/O',
      description: 'Excessive logging causing database query slowdowns'
    }
  },
  {
    id: '59',
    key: 'JSD-159',
    fields: {
      summary: 'Disk I/O errors due to storage partition corruption',
      status: { name: 'Critical' },
      created: '2025-09-03T20:45:00.000Z',
      rootCause: 'File system corruption from unexpected shutdown',
      description: 'Storage errors preventing file read/write operations'
    }
  },
  {
    id: '13',
    key: 'JSD-113',
    fields: {
      summary: 'XML external entity injection vulnerability in document parser',
      status: { name: 'High Priority' },
      created: '2025-09-05T09:05:00.000Z',
      rootCause: 'XML parser configuration allows external entity processing',
      description: 'XXE attacks possible through XML document uploads'
    }
  },
  {
    id: '56',
    key: 'JSD-156',
    fields: {
      summary: 'Core dump files consuming excessive disk space',
      status: { name: 'Critical' },
      created: '2025-09-02T18:40:00.000Z',
      rootCause: 'Application crashes generating large core dumps',
      description: 'Repeated application failures creating multiple GB core files'
    }
  },
  {
    id: '73',
    key: 'JSD-173',
    fields: {
      summary: 'Database checkpoint files preventing space reclamation',
      status: { name: 'High Priority' },
      created: '2025-09-08T16:15:00.000Z',
      rootCause: 'Database checkpoint frequency insufficient for space recovery',
      description: 'Transaction log space not reclaimed between checkpoints'
    }
  },
  {
    id: '78',
    key: 'JSD-178',
    fields: {
      summary: 'SSL handshake failures with external service integrations',
      status: { name: 'Open' },
      created: '2025-09-01T16:40:00.000Z',
      rootCause: 'Certificate validation issues with third-party APIs',
      description: 'TLS negotiation failing with partner service endpoints'
    }
  },
  {
    id: '74',
    key: 'JSD-174',
    fields: {
      summary: 'Development artifacts deployed to production consuming space',
      status: { name: 'Open' },
      created: '2025-09-08T20:30:00.000Z',
      rootCause: 'Build process including unnecessary development files',
      description: 'Source code and development tools included in production deployment'
    }
  },
  {
    id: '80',
    key: 'JSD-180',
    fields: {
      summary: 'Network packet loss affecting real-time data streaming',
      status: { name: 'High Priority' },
      created: '2025-09-02T14:30:00.000Z',
      rootCause: 'Network infrastructure capacity limitations',
      description: 'UDP packet drops causing data stream interruptions'
    }
  },
  {
    id: '49',
    key: 'JSD-149',
    fields: {
      summary: 'Compressed OOP configuration causing memory overhead',
      status: { name: 'Critical' },
      created: '2025-09-08T22:15:00.000Z',
      rootCause: 'JVM heap size exceeding compressed OOP limits',
      description: 'Object pointer compression disabled increasing memory usage'
    }
  },
  {
    id: '42',
    key: 'JSD-142',
    fields: {
      summary: 'ThreadLocal memory leaks in web application container',
      status: { name: 'High Priority' },
      created: '2025-09-06T18:30:00.000Z',
      rootCause: 'ThreadLocal variables not cleaned up on thread reuse',
      description: 'Worker thread reuse accumulating ThreadLocal data'
    }
  },
  {
    id: '38',
    key: 'JSD-138',
    fields: {
      summary: 'Metaspace overflow in dynamic class generation framework',
      status: { name: 'Critical' },
      created: '2025-09-05T15:50:00.000Z',
      rootCause: 'Runtime bytecode generation exceeding metaspace limits',
      description: 'Dynamic proxy generation exhausting metaspace allocation'
    }
  },
  {
    id: '5',
    key: 'JSD-105',
    fields: {
      summary: 'Directory traversal vulnerability in file upload feature',
      status: { name: 'High Priority' },
      created: '2025-09-02T11:35:00.000Z',
      rootCause: 'Path validation insufficient in file handling routines',
      description: 'Users can access restricted files through crafted upload paths'
    }
  },
  {
    id: '28',
    key: 'JSD-128',
    fields: {
      summary: 'Heap dump generation consuming excessive disk space',
      status: { name: 'Open' },
      created: '2025-09-02T08:30:00.000Z',
      rootCause: 'Automatic heap dump creation without size limits',
      description: 'Multiple heap dumps filling server storage during memory issues'
    }
  },
  {
    id: '100',
    key: 'JSD-200',
    fields: {
      summary: 'BGP routing convergence delays affecting service availability',
      status: { name: 'Critical' },
      created: '2025-09-09T10:50:00.000Z',
      rootCause: 'BGP routing protocol convergence time too slow',
      description: 'Network routing changes taking too long to propagate'
    }
  },
  {
    id: '62',
    key: 'JSD-162',
    fields: {
      summary: 'File upload feature disabled due to storage constraints',
      status: { name: 'Critical' },
      created: '2025-09-04T18:50:00.000Z',
      rootCause: 'User upload directory exceeding allocated space limits',
      description: 'Users unable to upload files due to storage quota exceeded'
    }
  },
  {
    id: '60',
    key: 'JSD-160',
    fields: {
      summary: 'Log parsing operations failing due to disk space limits',
      status: { name: 'Open' },
      created: '2025-09-04T10:20:00.000Z',
      rootCause: 'Log processing requiring temporary space exceeding available',
      description: 'Analytics operations unable to process large log files'
    }
  },
  {
    id: '86',
    key: 'JSD-186',
    fields: {
      summary: 'WebSocket connection drops during high concurrency',
      status: { name: 'High Priority' },
      created: '2025-09-04T16:40:00.000Z',
      rootCause: 'WebSocket server unable to handle connection surge',
      description: 'Real-time features failing when user load increases'
    }
  },
  {
    id: '23',
    key: 'JSD-123',
    fields: {
      summary: 'Server-side template injection in email generation',
      status: { name: 'High Priority' },
      created: '2025-09-08T13:25:00.000Z',
      rootCause: 'Template engine allows execution of arbitrary code',
      description: 'Email templates process user input without sandboxing'
    }
  },
  {
    id: '17',
    key: 'JSD-117',
    fields: {
      summary: 'Deserialization vulnerability in session data handling',
      status: { name: 'Critical' },
      created: '2025-09-06T12:15:00.000Z',
      rootCause: 'Unsafe deserialization of user-controlled data',
      description: 'Session data deserialization allows remote code execution'
    }
  },
  {
    id: '45',
    key: 'JSD-145',
    fields: {
      summary: 'Concurrent modification exceptions in shared collections',
      status: { name: 'High Priority' },
      created: '2025-09-07T20:35:00.000Z',
      rootCause: 'Non-thread-safe collections used in concurrent context',
      description: 'Multiple threads modifying HashMap causing data corruption'
    }
  },
  {
    id: '3',
    key: 'JSD-103',
    fields: {
      summary: 'Weak encryption algorithm used for password storage',
      status: { name: 'Critical' },
      created: '2025-09-01T14:45:00.000Z',
      rootCause: 'Legacy cryptographic implementation not updated',
      description: 'MD5 hashing still in use instead of modern bcrypt for password storage'
    }
  },
  {
    id: '52',
    key: 'JSD-152',
    fields: {
      summary: 'Database transaction logs preventing system startup',
      status: { name: 'Critical' },
      created: '2025-09-01T11:20:00.000Z',
      rootCause: 'Transaction log cleanup procedures not running',
      description: 'Database unable to start due to disk space exhaustion'
    }
  },
  {
    id: '18',
    key: 'JSD-118',
    fields: {
      summary: 'Missing security headers enabling clickjacking attacks',
      status: { name: 'Open' },
      created: '2025-09-06T15:40:00.000Z',
      rootCause: 'HTTP security headers not configured in web server',
      description: 'X-Frame-Options and CSP headers missing allowing iframe embedding'
    }
  },
  {
    id: '66',
    key: 'JSD-166',
    fields: {
      summary: 'Configuration backup storage approaching capacity limits',
      status: { name: 'Open' },
      created: '2025-09-06T11:30:00.000Z',
      rootCause: 'Configuration versioning without size management',
      description: 'Historical configuration backups consuming increasing space'
    }
  },
  {
    id: '76',
    key: 'JSD-176',
    fields: {
      summary: 'Database connection pool exhaustion under high load',
      status: { name: 'Critical' },
      created: '2025-09-01T08:10:00.000Z',
      rootCause: 'Connection pool sizing inadequate for peak traffic',
      description: 'All database connections in use causing request failures'
    }
  },
  {
    id: '7',
    key: 'JSD-107',
    fields: {
      summary: 'Insecure direct object references in API endpoints',
      status: { name: 'Open' },
      created: '2025-09-03T08:25:00.000Z',
      rootCause: 'Authorization checks missing in REST API controllers',
      description: 'Users can access other users data by modifying object IDs in requests'
    }
  },
  {
    id: '98',
    key: 'JSD-198',
    fields: {
      summary: 'MTU size mismatch causing packet fragmentation',
      status: { name: 'High Priority' },
      created: '2025-09-08T18:20:00.000Z',
      rootCause: 'Network path MTU discovery not functioning correctly',
      description: 'Large packets being fragmented reducing network efficiency'
    }
  },
  {
    id: '85',
    key: 'JSD-185',
    fields: {
      summary: 'HTTP/2 multiplexing issues causing request queuing',
      status: { name: 'Critical' },
      created: '2025-09-04T12:25:00.000Z',
      rootCause: 'HTTP/2 implementation not handling stream prioritization',
      description: 'Request multiplexing creating head-of-line blocking'
    }
  },
  {
    id: '83',
    key: 'JSD-183',
    fields: {
      summary: 'CDN cache invalidation not propagating across edge nodes',
      status: { name: 'High Priority' },
      created: '2025-09-03T15:35:00.000Z',
      rootCause: 'Cache invalidation service experiencing delays',
      description: 'Stale content served from edge locations after updates'
    }
  },
  {
    id: '8',
    key: 'JSD-108',
    fields: {
      summary: 'SSL/TLS certificate validation disabled in production',
      status: { name: 'Critical' },
      created: '2025-09-03T12:40:00.000Z',
      rootCause: 'Development settings accidentally deployed to production',
      description: 'HTTPS connections accept invalid certificates creating MITM vulnerability'
    }
  },
  {
    id: '96',
    key: 'JSD-196',
    fields: {
      summary: 'IPv6 connectivity issues with dual-stack configuration',
      status: { name: 'Open' },
      created: '2025-09-07T23:30:00.000Z',
      rootCause: 'IPv6 routing not properly configured',
      description: 'Clients unable to connect via IPv6 falling back to IPv4'
    }
  },
  {
    id: '75',
    key: 'JSD-175',
    fields: {
      summary: 'Audit log retention exceeding compliance requirements',
      status: { name: 'High Priority' },
      created: '2025-09-09T09:45:00.000Z',
      rootCause: 'Audit log retention period longer than legally required',
      description: 'Security audit logs kept beyond necessary retention period'
    }
  },
  {
    id: '77',
    key: 'JSD-177',
    fields: {
      summary: 'API gateway timeout errors during peak traffic periods',
      status: { name: 'High Priority' },
      created: '2025-09-01T12:25:00.000Z',
      rootCause: 'Network latency exceeding configured timeout values',
      description: 'Backend services responding slowly causing gateway timeouts'
    }
  },
  {
    id: '70',
    key: 'JSD-170',
    fields: {
      summary: 'Disk fragmentation affecting file system performance',
      status: { name: 'High Priority' },
      created: '2025-09-07T17:50:00.000Z',
      rootCause: 'Frequent file creation/deletion fragmenting storage',
      description: 'File system fragmentation slowing disk operations'
    }
  },
  {
    id: '71',
    key: 'JSD-171',
    fields: {
      summary: 'Old application versions consuming unnecessary disk space',
      status: { name: 'Open' },
      created: '2025-09-07T22:25:00.000Z',
      rootCause: 'Deployment process not cleaning up previous versions',
      description: 'Multiple application versions stored without cleanup'
    }
  },
  {
    id: '30',
    key: 'JSD-130',
    fields: {
      summary: 'PermGen space exhaustion in legacy application components',
      status: { name: 'High Priority' },
      created: '2025-09-02T16:10:00.000Z',
      rootCause: 'Class loading strategy creating permanent generation overflow',
      description: 'Dynamic class loading exhausting permanent generation space'
    }
  },
  {
    id: '89',
    key: 'JSD-189',
    fields: {
      summary: 'Network latency spikes affecting user experience',
      status: { name: 'High Priority' },
      created: '2025-09-05T18:45:00.000Z',
      rootCause: 'Network path suboptimal due to routing changes',
      description: 'User requests experiencing inconsistent response times'
    }
  },
  {
    id: '48',
    key: 'JSD-148',
    fields: {
      summary: 'Classloader memory leaks in plugin architecture',
      status: { name: 'Open' },
      created: '2025-09-08T18:40:00.000Z',
      rootCause: 'Plugin classloaders not properly dereferenced',
      description: 'Plugin unloading leaving classloader references preventing GC'
    }
  },
  {
    id: '35',
    key: 'JSD-135',
    fields: {
      summary: 'Stack overflow in recursive algorithm implementation',
      status: { name: 'Critical' },
      created: '2025-09-04T13:45:00.000Z',
      rootCause: 'Recursive data processing without depth limits',
      description: 'Deep recursion exhausting thread stack space'
    }
  },
  {
    id: '87',
    key: 'JSD-187',
    fields: {
      summary: 'Network bandwidth saturation during backup operations',
      status: { name: 'Open' },
      created: '2025-09-04T20:15:00.000Z',
      rootCause: 'Backup traffic not properly rate-limited',
      description: 'Data backups consuming all available network bandwidth'
    }
  },
  {
    id: '90',
    key: 'JSD-190',
    fields: {
      summary: 'CORS policy preventing legitimate cross-origin requests',
      status: { name: 'Open' },
      created: '2025-09-05T22:20:00.000Z',
      rootCause: 'Cross-origin resource sharing configuration too restrictive',
      description: 'Web application unable to access required external APIs'
    }
  },
  {
    id: '57',
    key: 'JSD-157',
    fields: {
      summary: 'Disk space exhaustion preventing log file creation',
      status: { name: 'Critical' },
      created: '2025-09-03T12:15:00.000Z',
      rootCause: 'Log directory partition completely filled',
      description: 'Application unable to write logs due to no space left'
    }
  },
  {
    id: '47',
    key: 'JSD-147',
    fields: {
      summary: 'Memory allocation failures in high-frequency operations',
      status: { name: 'High Priority' },
      created: '2025-09-08T15:25:00.000Z',
      rootCause: 'Memory allocation rate exceeding garbage collection rate',
      description: 'Fast allocation causing allocation failures during GC'
    }
  },
  {
    id: '11',
    key: 'JSD-111',
    fields: {
      summary: 'Unvalidated redirects enabling phishing attacks',
      status: { name: 'High Priority' },
      created: '2025-09-04T11:15:00.000Z',
      rootCause: 'URL redirection parameters not properly validated',
      description: 'Users can be redirected to malicious sites through crafted URLs'
    }
  },
  {
    id: '14',
    key: 'JSD-114',
    fields: {
      summary: 'Race condition in payment processing allowing double charges',
      status: { name: 'Critical' },
      created: '2025-09-05T13:20:00.000Z',
      rootCause: 'Concurrent transaction handling lacks proper synchronization',
      description: 'Multiple simultaneous payment requests can be processed for same transaction'
    }
  },
  {
    id: '43',
    key: 'JSD-143',
    fields: {
      summary: 'Unsafe memory access causing JVM crashes',
      status: { name: 'Critical' },
      created: '2025-09-07T12:45:00.000Z',
      rootCause: 'Direct memory manipulation bypassing JVM safety checks',
      description: 'Unsafe API usage causing segmentation faults'
    }
  },
  {
    id: '33',
    key: 'JSD-133',
    fields: {
      summary: 'Large object allocation causing frequent garbage collection',
      status: { name: 'High Priority' },
      created: '2025-09-03T18:15:00.000Z',
      rootCause: 'Inefficient data structure choices for large datasets',
      description: 'Large arrays and collections triggering excessive GC activity'
    }
  },
  {
    id: '50',
    key: 'JSD-150',
    fields: {
      summary: 'Memory profiler overhead affecting production performance',
      status: { name: 'Open' },
      created: '2025-09-09T08:30:00.000Z',
      rootCause: 'Profiling tools left enabled in production environment',
      description: 'Memory profiling agents consuming excessive CPU and memory'
    }
  },
  {
    id: '61',
    key: 'JSD-161',
    fields: {
      summary: 'Monitoring system unable to store metrics due to disk full',
      status: { name: 'High Priority' },
      created: '2025-09-04T14:35:00.000Z',
      rootCause: 'Metrics storage growing without retention policies',
      description: 'Time-series database unable to accept new metric data'
    }
  },
  {
    id: '40',
    key: 'JSD-140',
    fields: {
      summary: 'Excessive string concatenation creating memory churn',
      status: { name: 'Open' },
      created: '2025-09-06T10:40:00.000Z',
      rootCause: 'String building operations not using StringBuilder',
      description: 'Repeated string concatenation creating temporary objects'
    }
  },
  {
    id: '27',
    key: 'JSD-127',
    fields: {
      summary: 'JVM garbage collection pauses exceeding acceptable thresholds',
      status: { name: 'High Priority' },
      created: '2025-09-01T13:45:00.000Z',
      rootCause: 'Inefficient memory allocation patterns in data processing',
      description: 'Stop-the-world GC events causing 5+ second application freezes'
    }
  },
  {
    id: '9',
    key: 'JSD-109',
    fields: {
      summary: 'Privilege escalation through role assignment manipulation',
      status: { name: 'Critical' },
      created: '2025-09-03T16:55:00.000Z',
      rootCause: 'Role-based access control implementation flaws',
      description: 'Users can modify their own role assignments through API manipulation'
    }
  },
  {
    id: '81',
    key: 'JSD-181',
    fields: {
      summary: 'DNS resolution delays causing application startup issues',
      status: { name: 'Open' },
      created: '2025-09-02T18:45:00.000Z',
      rootCause: 'DNS server performance degradation',
      description: 'Service discovery failing due to slow DNS responses'
    }
  },
  {
    id: '88',
    key: 'JSD-188',
    fields: {
      summary: 'Firewall blocking legitimate application traffic',
      status: { name: 'Critical' },
      created: '2025-09-05T14:30:00.000Z',
      rootCause: 'Firewall rules too restrictive for application requirements',
      description: 'Security policies preventing necessary service communication'
    }
  },
  {
    id: '15',
    key: 'JSD-115',
    fields: {
      summary: 'Insufficient logging of security events for audit trail',
      status: { name: 'Open' },
      created: '2025-09-05T17:45:00.000Z',
      rootCause: 'Security logging framework not comprehensively implemented',
      description: 'Login attempts, permission changes not properly logged'
    }
  },
  {
    id: '69',
    key: 'JSD-169',
    fields: {
      summary: 'Application cache files not cleaned up after restart',
      status: { name: 'Open' },
      created: '2025-09-07T13:35:00.000Z',
      rootCause: 'Cache cleanup routines not triggered during startup',
      description: 'Stale cache files accumulating across application restarts'
    }
  },
  {
    id: '99',
    key: 'JSD-199',
    fields: {
      summary: 'Network switch buffer overflow during traffic bursts',
      status: { name: 'Open' },
      created: '2025-09-08T22:35:00.000Z',
      rootCause: 'Network switch buffer configuration inadequate',
      description: 'Traffic bursts causing packet drops at network switches'
    }
  },
  {
    id: '39',
    key: 'JSD-139',
    fields: {
      summary: 'WeakReference accumulation preventing garbage collection',
      status: { name: 'High Priority' },
      created: '2025-09-05T19:25:00.000Z',
      rootCause: 'Weak reference queue not being processed efficiently',
      description: 'Accumulated weak references creating GC overhead'
    }
  },
  {
    id: '72',
    key: 'JSD-172',
    fields: {
      summary: 'Log indexing process creating duplicate storage requirements',
      status: { name: 'Critical' },
      created: '2025-09-08T12:40:00.000Z',
      rootCause: 'Search indexing keeping full copies of log data',
      description: 'Elasticsearch indices doubling log storage requirements'
    }
  },
  {
    id: '84',
    key: 'JSD-184',
    fields: {
      summary: 'VPN tunnel instability affecting remote worker connections',
      status: { name: 'Open' },
      created: '2025-09-03T19:50:00.000Z',
      rootCause: 'VPN gateway overloaded during peak usage hours',
      description: 'Remote employees experiencing frequent disconnections'
    }
  },
  {
    id: '91',
    key: 'JSD-191',
    fields: {
      summary: 'Network interface bonding failure causing connectivity loss',
      status: { name: 'Critical' },
      created: '2025-09-06T13:35:00.000Z',
      rootCause: 'Network interface bonding configuration error',
      description: 'Primary network interface failure not failing over properly'
    }
  },
  {
    id: '16',
    key: 'JSD-116',
    fields: {
      summary: 'API rate limiting bypass through header manipulation',
      status: { name: 'High Priority' },
      created: '2025-09-06T08:30:00.000Z',
      rootCause: 'Rate limiting implementation relies on client-controlled headers',
      description: 'X-Forwarded-For header manipulation allows rate limit circumvention'
    }
  },
  {
    id: '36',
    key: 'JSD-136',
    fields: {
      summary: 'Direct memory exhaustion in NIO buffer management',
      status: { name: 'High Priority' },
      created: '2025-09-04T17:20:00.000Z',
      rootCause: 'Direct ByteBuffer allocation without proper cleanup',
      description: 'Off-heap memory accumulation in network I/O operations'
    }
  },
  {
    id: '46',
    key: 'JSD-146',
    fields: {
      summary: 'Object finalizer queue buildup preventing garbage collection',
      status: { name: 'Critical' },
      created: '2025-09-08T11:50:00.000Z',
      rootCause: 'Slow finalize() methods blocking finalizer thread',
      description: 'Finalizer queue overflow preventing object cleanup'
    }
  },
  {
    id: '10',
    key: 'JSD-110',
    fields: {
      summary: 'Information disclosure in error messages exposing system details',
      status: { name: 'Open' },
      created: '2025-09-04T07:30:00.000Z',
      rootCause: 'Verbose error handling revealing internal system information',
      description: 'Stack traces and database errors exposed to end users'
    }
  },
  {
    id: '67',
    key: 'JSD-167',
    fields: {
      summary: 'Disk space monitoring alerts not triggering early enough',
      status: { name: 'High Priority' },
      created: '2025-09-06T15:45:00.000Z',
      rootCause: 'Disk space thresholds set too high for rapid growth',
      description: 'Space exhaustion occurring before monitoring alerts activate'
    }
  },
  {
    id: '82',
    key: 'JSD-182',
    fields: {
      summary: 'TCP connection reset errors in microservice communication',
      status: { name: 'Critical' },
      created: '2025-09-03T11:20:00.000Z',
      rootCause: 'Network connection pooling configuration mismatch',
      description: 'Service-to-service calls failing with connection resets'
    }
  },
  {
    id: '58',
    key: 'JSD-158',
    fields: {
      summary: 'Archive compression failing leading to storage overflow',
      status: { name: 'High Priority' },
      created: '2025-09-03T16:30:00.000Z',
      rootCause: 'Log compression utilities not functioning correctly',
      description: 'Uncompressed log archives consuming excessive storage'
    }
  },
  {
    id: '26',
    key: 'JSD-126',
    fields: {
      summary: 'OutOfMemoryError in user session management causing service disruption',
      status: { name: 'Critical' },
      created: '2025-09-01T09:20:00.000Z',
      rootCause: 'Memory leak in session storage implementation',
      description: 'User sessions not properly cleaned up leading to heap exhaustion'
    }
  },
  {
    id: '37',
    key: 'JSD-137',
    fields: {
      summary: 'Memory pressure causing application response degradation',
      status: { name: 'Open' },
      created: '2025-09-05T11:35:00.000Z',
      rootCause: 'Insufficient heap sizing for application workload',
      description: 'High memory utilization slowing all application operations'
    }
  },
  {
    id: '65',
    key: 'JSD-165',
    fields: {
      summary: 'Error log verbosity causing rapid disk consumption',
      status: { name: 'High Priority' },
      created: '2025-09-05T21:15:00.000Z',
      rootCause: 'Debug logging level accidentally enabled in production',
      description: 'Verbose debug messages filling disk space rapidly'
    }
  },
  {
    id: '93',
    key: 'JSD-193',
    fields: {
      summary: 'Network congestion affecting inter-datacenter replication',
      status: { name: 'Open' },
      created: '2025-09-06T21:25:00.000Z',
      rootCause: 'WAN link capacity insufficient for replication traffic',
      description: 'Data synchronization between sites experiencing delays'
    }
  },
  {
    id: '44',
    key: 'JSD-144',
    fields: {
      summary: 'Cache memory growth exceeding configured limits',
      status: { name: 'Open' },
      created: '2025-09-07T16:20:00.000Z',
      rootCause: 'Cache eviction policies not functioning correctly',
      description: 'In-memory cache growing beyond intended size limits'
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
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    console.log('⚠️  No valid OpenAI API key found. Please set OPENAI_API_KEY in backend/.env file');
    console.log('   Using fallback keyword-based filtering instead');
    return simulateNLPFilter(query, tickets);
  }

  console.log('🤖 Using OpenAI GPT-3.5-turbo for query:', query);

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
