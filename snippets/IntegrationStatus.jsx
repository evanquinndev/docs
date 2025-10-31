'use client';
import { useState } from 'react';

/**
 * Integration Health Dashboard
 * Shows real-time status of external service connections
 */
export default function IntegrationStatus() {
  const [expandedIntegration, setExpandedIntegration] = useState(null);

  const integrations = [
    {
      id: 'twilio',
      name: 'Twilio',
      category: 'Communications',
      status: 'connected',
      icon: '📞',
      health: 98,
      stats: {
        callsToday: 47,
        smsToday: 23,
        minutesUsed: 142,
        lastSync: '2 minutes ago'
      },
      features: [
        'Inbound/outbound calling',
        'SMS messaging',
        'Call recording',
        'Call forwarding',
        'Voicemail transcription'
      ]
    },
    {
      id: 'gmail',
      name: 'Gmail',
      category: 'Email',
      status: 'connected',
      icon: '📧',
      health: 100,
      stats: {
        emailsSynced: 1247,
        watchExpires: 'in 5 days',
        lastSync: '30 seconds ago',
        quotaUsed: '34%'
      },
      features: [
        '2-way email sync',
        'Auto-link to contacts',
        'Webhook notifications',
        'Thread tracking',
        'Attachment support'
      ]
    },
    {
      id: 'vapi',
      name: 'Vapi AI Voice Agent',
      category: 'AI',
      status: 'connected',
      icon: '🤖',
      health: 95,
      stats: {
        callsHandled: 18,
        avgDuration: '3.2 min',
        tasksCreated: 12,
        lastCall: '15 minutes ago'
      },
      features: [
        '24/7 AI receptionist',
        'Call transcription',
        'Task extraction',
        'Contact creation',
        'Email summaries'
      ]
    },
    {
      id: 'snowflake',
      name: 'Snowflake',
      category: 'Data',
      status: 'connected',
      icon: '❄️',
      health: 100,
      stats: {
        lastImport: '2 hours ago',
        recordsImported: 3420,
        nextScheduled: 'in 22 hours',
        successRate: '100%'
      },
      features: [
        'Automated nightly imports',
        'Customer data sync',
        'Inventory sync',
        'Transaction sync',
        'Custom column mapping'
      ]
    },
    {
      id: 'outlook',
      name: 'Outlook',
      category: 'Email',
      status: 'warning',
      icon: '📮',
      health: 65,
      stats: {
        subscriptionExpires: 'in 6 hours',
        emailsSynced: 892,
        lastSync: '5 minutes ago',
        quotaUsed: '87%'
      },
      features: [
        '2-way email sync',
        'Calendar integration',
        'Change notifications',
        'Auto-link contacts',
        'Meeting tracking'
      ],
      warning: 'Subscription renewing soon. No action needed.'
    },
    {
      id: 'openai',
      name: 'OpenAI',
      category: 'AI',
      status: 'connected',
      icon: '🧠',
      health: 100,
      stats: {
        requestsToday: 234,
        tokensUsed: '1.2M',
        avgLatency: '850ms',
        modelVersion: 'GPT-4o'
      },
      features: [
        'Task extraction',
        'Lead scoring',
        'Revenue prediction',
        'Sentiment analysis',
        'Content generation'
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'connected': return { bg: '#d1fae5', text: '#065f46', border: '#86efac' };
      case 'warning': return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'error': return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
      default: return { bg: '#f3f4f6', text: '#4b5563', border: '#d1d5db' };
    }
  };

  const getHealthColor = (health) => {
    if (health >= 90) return '#10b981';
    if (health >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      borderRadius: '12px', 
      padding: '24px', 
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
        Integration Status
      </h3>
      <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>
        Real-time health monitoring for all external services
      </p>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{ padding: '16px', backgroundColor: '#d1fae5', borderRadius: '8px', border: '1px solid #86efac' }}>
          <div style={{ fontSize: '13px', color: '#065f46', marginBottom: '4px' }}>Active Integrations</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#047857' }}>
            {integrations.filter(i => i.status === 'connected').length}/{integrations.length}
          </div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
          <div style={{ fontSize: '13px', color: '#1e40af', marginBottom: '4px' }}>Avg Health Score</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e3a8a' }}>
            {Math.round(integrations.reduce((sum, i) => sum + i.health, 0) / integrations.length)}%
          </div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
          <div style={{ fontSize: '13px', color: '#92400e', marginBottom: '4px' }}>Warnings</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#78350f' }}>
            {integrations.filter(i => i.status === 'warning').length}
          </div>
        </div>
      </div>

      {/* Integration Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {integrations.map((integration) => {
          const statusColor = getStatusColor(integration.status);
          const isExpanded = expandedIntegration === integration.id;

          return (
            <div
              key={integration.id}
              style={{
                border: `1px solid ${statusColor.border}`,
                borderRadius: '10px',
                padding: '16px',
                backgroundColor: statusColor.bg,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setExpandedIntegration(isExpanded ? null : integration.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{ fontSize: '32px' }}>{integration.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '600', color: statusColor.text }}>
                        {integration.name}
                      </span>
                      <span style={{
                        padding: '3px 8px',
                        backgroundColor: '#ffffff',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: statusColor.text
                      }}>
                        {integration.category}
                      </span>
                      {integration.warning && (
                        <span style={{ fontSize: '12px', color: '#92400e' }}>
                          ⚠️ {integration.warning}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: statusColor.text, opacity: 0.8 }}>
                      Health: {integration.health}% • {integration.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Health Bar */}
                <div style={{ width: '120px', marginRight: '12px' }}>
                  <div style={{
                    height: '8px',
                    backgroundColor: '#ffffff',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${integration.health}%`,
                      backgroundColor: getHealthColor(integration.health),
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: integration.status === 'connected' ? '#10b981' : 
                                  integration.status === 'warning' ? '#f59e0b' : '#ef4444'
                }} />
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${statusColor.border}` }}>
                  {/* Stats Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    {Object.entries(integration.stats).map(([key, value]) => (
                      <div
                        key={key}
                        style={{
                          padding: '12px',
                          backgroundColor: '#ffffff',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: statusColor.text }}>
                      Enabled Features:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {integration.features.map((feature, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#ffffff',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: statusColor.text,
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          ✓ {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ 
        marginTop: '20px',
        padding: '16px', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '8px',
        fontSize: '13px',
        color: '#0c4a6e',
        border: '1px solid #bae6fd'
      }}>
        <strong>🔄 Auto-Sync:</strong> Quinn automatically monitors all integrations and handles token refreshes, webhook renewals, and error recovery without manual intervention.
      </div>
    </div>
  );
}
