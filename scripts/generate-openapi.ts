#!/usr/bin/env tsx
/**
 * OpenAPI Spec Generator for Quinn CRM
 * 
 * Automatically extracts all API endpoints from routes.ts and generates
 * an OpenAPI 3.0 specification for Mintlify documentation.
 * 
 * Usage: tsx scripts/generate-openapi.ts
 */

import fs from 'fs';
import path from 'path';

interface RouteDefinition {
  method: string;
  path: string;
  middleware: string[];
  description?: string;
  requestSchema?: string;
  responseType?: string;
}

interface OpenAPIOperation {
  summary: string;
  description?: string;
  operationId: string;
  tags: string[];
  security?: Array<{ cookieAuth: [] }>;
  parameters?: Array<{
    name: string;
    in: 'path' | 'query' | 'header';
    required: boolean;
    schema: { type: string };
    description?: string;
  }>;
  requestBody?: {
    required: boolean;
    content: {
      'application/json': {
        schema: any;
      };
    };
  };
  responses: {
    [statusCode: string]: {
      description: string;
      content?: {
        'application/json': {
          schema: any;
        };
      };
    };
  };
}

/**
 * Parse routes.ts and extract all endpoint definitions
 */
function parseRoutes(routesContent: string): RouteDefinition[] {
  const routes: RouteDefinition[] = [];
  
  // More robust regex that handles multiple middleware
  // Matches: app.METHOD("path", middleware1, middleware2, ..., async (req, res) =>
  const routeRegex = /app\.(get|post|put|delete|patch)\(\s*["']([^"']+)["']\s*,([\s\S]*?)(?:async\s*)?\(req[^)]*\)\s*=>/g;
  
  let match;
  while ((match = routeRegex.exec(routesContent)) !== null) {
    const method = match[1].toUpperCase();
    const path = match[2];
    const middlewareStr = match[3];
    
    // Extract middleware by splitting on commas outside of function calls
    // Handles: requireAuth, requireAdmin, upload.single('file'), etc.
    const middleware: string[] = [];
    let depth = 0;
    let current = '';
    
    for (let i = 0; i < middlewareStr.length; i++) {
      const char = middlewareStr[i];
      if (char === '(') depth++;
      else if (char === ')') depth--;
      else if (char === ',' && depth === 0) {
        const trimmed = current.trim();
        if (trimmed && !trimmed.includes('req') && !trimmed.includes('res')) {
          middleware.push(trimmed);
        }
        current = '';
        continue;
      }
      current += char;
    }
    
    // Don't forget the last middleware
    const trimmed = current.trim();
    if (trimmed && !trimmed.includes('req') && !trimmed.includes('res')) {
      middleware.push(trimmed);
    }
    
    routes.push({
      method,
      path,
      middleware: middleware.filter(m => m.length > 0)
    });
  }
  
  return routes;
}

/**
 * Generate human-readable summary from path
 */
function generateSummary(method: string, path: string): string {
  const parts = path.split('/').filter(p => p && !p.startsWith(':'));
  const resource = parts[parts.length - 1] || parts[parts.length - 2] || 'resource';
  
  const action = {
    'GET': path.includes('/:id') ? 'Get' : 'List',
    'POST': 'Create',
    'PUT': 'Update',
    'PATCH': 'Update',
    'DELETE': 'Delete'
  }[method] || method;
  
  // Convert kebab-case to Title Case
  const resourceName = resource
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  
  return `${action} ${resourceName}`;
}

/**
 * Extract tag (category) from path
 */
function extractTag(path: string): string {
  const match = path.match(/^\/api\/([^\/]+)/);
  if (!match) return 'General';
  
  const segment = match[1];
  
  // Map segments to friendly category names
  const tagMap: Record<string, string> = {
    'auth': 'Authentication',
    'customers': 'Customers',
    'leads': 'Leads',
    'contacts': 'Contacts',
    'companies': 'Companies',
    'opportunities': 'Opportunities',
    'pipeline': 'Pipeline',
    'tasks': 'Tasks',
    'inventory': 'Inventory',
    'transactions': 'Transactions',
    'activities': 'Activities',
    'communications': 'Communications',
    'voice': 'Voice & Calling',
    'sms': 'SMS',
    'email': 'Email',
    'calendar': 'Calendar',
    'analytics': 'Analytics',
    'settings': 'Settings',
    'organization': 'Organization',
    'users': 'Users',
    'webhooks': 'Webhooks',
    'integrations': 'Integrations',
    'ai': 'AI Features',
    'notifications': 'Notifications',
    'browse-ai-data-sources': 'Job Site Prospecting',
    'xlsx-data-sources': 'XLSX Data Sources',
    'service-areas': 'Service Areas',
    'snowflake': 'Snowflake Integration'
  };
  
  return tagMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

/**
 * Extract path parameters
 */
function extractPathParameters(path: string): Array<{name: string; description: string}> {
  const params: Array<{name: string; description: string}> = [];
  const paramRegex = /:([a-zA-Z0-9_]+)/g;
  
  let match;
  while ((match = paramRegex.exec(path)) !== null) {
    const paramName = match[1];
    params.push({
      name: paramName,
      description: `${paramName.charAt(0).toUpperCase() + paramName.slice(1)} identifier`
    });
  }
  
  return params;
}

/**
 * Determine if route requires authentication
 */
function requiresAuth(middleware: string[]): boolean {
  return middleware.some(m => 
    m.includes('requireAuth') || 
    m.includes('requireAdmin') || 
    m.includes('requireSuperAdmin')
  );
}

/**
 * Generate OpenAPI operation object
 */
function generateOperation(route: RouteDefinition): OpenAPIOperation {
  const pathParams = extractPathParameters(route.path);
  const tag = extractTag(route.path);
  const summary = generateSummary(route.method, route.path);
  const operationId = `${route.method.toLowerCase()}_${route.path.replace(/[\/:-]/g, '_')}`;
  
  const operation: OpenAPIOperation = {
    summary,
    operationId,
    tags: [tag],
    responses: {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      },
      '400': {
        description: 'Bad request'
      },
      '401': {
        description: 'Unauthorized'
      },
      '404': {
        description: 'Not found'
      },
      '500': {
        description: 'Internal server error'
      }
    }
  };
  
  // Add authentication requirement
  if (requiresAuth(route.middleware)) {
    operation.security = [{ cookieAuth: [] }];
  }
  
  // Add path parameters
  if (pathParams.length > 0) {
    operation.parameters = pathParams.map(param => ({
      name: param.name,
      in: 'path' as const,
      required: true,
      schema: { type: 'string' },
      description: param.description
    }));
  }
  
  // Add request body for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(route.method)) {
    operation.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {},
            description: `Request body for ${summary.toLowerCase()}`
          }
        }
      }
    };
  }
  
  return operation;
}

/**
 * Generate complete OpenAPI specification
 */
function generateOpenAPISpec(routes: RouteDefinition[]): any {
  const paths: any = {};
  
  // Group routes by path
  routes.forEach(route => {
    const openApiPath = route.path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
    
    if (!paths[openApiPath]) {
      paths[openApiPath] = {};
    }
    
    paths[openApiPath][route.method.toLowerCase()] = generateOperation(route);
  });
  
  // Extract unique tags
  const tags = Array.from(new Set(
    routes.map(r => extractTag(r.path))
  )).sort().map(name => ({ name }));
  
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'Quinn CRM API',
      version: '1.0.0',
      description: `
AI-powered CRM API for equipment rental businesses. Quinn streamlines customer management, 
sales pipeline tracking, inventory management, and communication workflows with intelligent 
automation and insights.

## Authentication

Quinn uses session-based authentication with HTTP-only cookies. To authenticate:

1. Call \`POST /api/auth/login\` with email and password
2. Receive a session cookie (\`sessionId\`)
3. Include this cookie in all subsequent requests

## Multi-Tenant Architecture

All API endpoints are scoped to your organization. When authenticated, your requests 
automatically access only your organization's data.

## Rate Limiting

API endpoints are rate-limited to prevent abuse. Standard limits:
- Authentication endpoints: 10 requests/minute
- Read operations: 100 requests/minute  
- Write operations: 50 requests/minute

## Webhooks

Quinn supports webhooks for real-time integrations:
- Twilio (voice/SMS): \`/api/webhooks/twilio/*\`
- Gmail: \`/api/webhooks/gmail/pubsub\`
- Outlook: \`/api/webhooks/outlook/email\`
- Vapi (voice agent): \`/api/webhooks/vapi\`
- Aircall: \`/api/webhooks/aircall\`

All webhooks require signature validation for security.
      `.trim(),
      contact: {
        name: 'Quinn Support',
        email: 'support@quinn.app'
      },
      license: {
        name: 'Proprietary'
      }
    },
    servers: [
      {
        url: 'https://your-quinn-instance.replit.app',
        description: 'Production server'
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    tags,
    paths,
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'sessionId',
          description: 'Session cookie obtained via /api/auth/login'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          },
          required: ['error']
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            currentPage: { type: 'integer' },
            totalPages: { type: 'integer' },
            totalItems: { type: 'integer' },
            pageSize: { type: 'integer' },
            hasNextPage: { type: 'boolean' },
            hasPreviousPage: { type: 'boolean' }
          }
        },
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            organizationId: { type: 'string', format: 'uuid' },
            customerName: { type: 'string' },
            email: { type: 'string', format: 'email', nullable: true },
            phone: { type: 'string', nullable: true },
            address1: { type: 'string', nullable: true },
            city: { type: 'string', nullable: true },
            state: { type: 'string', nullable: true },
            zipCode: { type: 'string', nullable: true },
            companyId: { type: 'string', format: 'uuid', nullable: true },
            ownerId: { type: 'string', format: 'uuid', nullable: true },
            lifetimeOrders: { type: 'number', description: 'Total lifetime transaction value' }
          }
        },
        Lead: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            organizationId: { type: 'string', format: 'uuid' },
            leadName: { type: 'string' },
            email: { type: 'string', format: 'email', nullable: true },
            phone: { type: 'string', nullable: true },
            companyName: { type: 'string', nullable: true },
            status: { 
              type: 'string',
              enum: ['new', 'contacted', 'qualified', 'negotiation', 'converted', 'lost']
            },
            assignedTo: { type: 'string', format: 'uuid', nullable: true },
            aiScore: { 
              type: 'integer',
              minimum: 0,
              maximum: 7,
              description: 'AI-generated lead quality score (0-7)'
            }
          }
        },
        Opportunity: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            organizationId: { type: 'string', format: 'uuid' },
            customerId: { type: 'string', format: 'uuid', nullable: true },
            contactId: { type: 'string', format: 'uuid', nullable: true },
            stageId: { type: 'string', format: 'uuid' },
            estimatedValue: { type: 'number' },
            probability: { type: 'integer', minimum: 0, maximum: 100 },
            expectedCloseDate: { type: 'string', format: 'date', nullable: true },
            isArchived: { type: 'boolean' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            organizationId: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            assignedTo: { type: 'string', format: 'uuid', nullable: true },
            customerId: { type: 'string', format: 'uuid', nullable: true },
            leadId: { type: 'string', format: 'uuid', nullable: true },
            contactId: { type: 'string', format: 'uuid', nullable: true },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            status: { type: 'string', enum: ['pending', 'completed'] },
            isAiGenerated: { type: 'boolean', description: 'True if task was created by AI' }
          }
        }
      }
    }
  };
  
  return spec;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🔍 Reading routes.ts...');
    const routesPath = path.join(process.cwd(), 'server', 'routes.ts');
    const routesContent = fs.readFileSync(routesPath, 'utf-8');
    
    console.log('📋 Parsing route definitions...');
    const routes = parseRoutes(routesContent);
    console.log(`✅ Found ${routes.length} API endpoints`);
    
    console.log('🏗️  Generating OpenAPI specification...');
    const spec = generateOpenAPISpec(routes);
    
    // Write to file
    const outputPath = path.join(process.cwd(), 'docs', 'openapi.json');
    const docsDir = path.join(process.cwd(), 'docs');
    
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
    console.log(`✅ OpenAPI spec generated: ${outputPath}`);
    
    // Print statistics
    const tags = spec.tags.map((t: any) => t.name);
    console.log('\n📊 Statistics:');
    console.log(`   Total endpoints: ${routes.length}`);
    console.log(`   Categories: ${tags.length}`);
    console.log(`   Top categories:`);
    
    const tagCounts: Record<string, number> = {};
    routes.forEach(r => {
      const tag = extractTag(r.path);
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([tag, count]) => {
        console.log(`      - ${tag}: ${count} endpoints`);
      });
    
    console.log('\n🎉 OpenAPI generation complete!');
    console.log('   Next steps:');
    console.log('   1. Review docs/openapi.json');
    console.log('   2. Configure Mintlify to use this spec');
    console.log('   3. Run: npx mintlify dev (to preview docs locally)');
    
  } catch (error) {
    console.error('❌ Error generating OpenAPI spec:', error);
    process.exit(1);
  }
}

main();
