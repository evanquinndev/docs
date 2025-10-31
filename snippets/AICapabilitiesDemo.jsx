'use client';
import { useState } from 'react';

/**
 * Interactive AI Capabilities Demo
 * Showcases Quinn's AI-powered features
 */
export default function AICapabilitiesDemo() {
  const [activeTab, setActiveTab] = useState('task-extraction');
  const [isProcessing, setIsProcessing] = useState(false);

  const demos = {
    'task-extraction': {
      title: 'AI Task Extraction',
      icon: '✅',
      description: 'Automatically extract action items from conversations',
      input: `Customer called about renting excavator for Monday. Told him we have CAT 305.5E2 available. Need to:
- Send quote by EOD Friday
- Check delivery schedule for Monday 7am
- Follow up on insurance certificate`,
      output: [
        { title: 'Send excavator quote', priority: 'high', dueDate: 'Friday 5:00 PM', assignee: 'Sales Team' },
        { title: 'Verify delivery schedule for Monday 7am', priority: 'medium', dueDate: 'Friday 3:00 PM', assignee: 'Logistics' },
        { title: 'Request insurance certificate', priority: 'medium', dueDate: 'Friday 2:00 PM', assignee: 'Admin' }
      ]
    },
    'lead-scoring': {
      title: 'AI Lead Scoring',
      icon: '🎯',
      description: 'Intelligent lead quality assessment (0-7 scale)',
      input: {
        companyName: 'ABC Construction LLC',
        website: 'abcconstruction.com',
        googleRating: 4.8,
        reviewCount: 156,
        hasEmail: true,
        hasPhone: true,
        industry: 'Commercial Construction'
      },
      output: {
        score: 7,
        rating: 'Hot Lead',
        signals: [
          { factor: 'Google Rating (4.8/5)', weight: '+2 points' },
          { factor: 'High review count (156)', weight: '+1 point' },
          { factor: 'Professional website', weight: '+1 point' },
          { factor: 'Complete contact info', weight: '+1 point' },
          { factor: 'Commercial construction (high value)', weight: '+2 points' }
        ],
        recommendation: 'High-priority lead. Auto-enriched with CEO contact info. Assign to senior sales rep immediately.'
      }
    },
    'revenue-prediction': {
      title: 'Revenue Prediction',
      icon: '💰',
      description: 'AI-powered deal value forecasting',
      input: {
        customer: 'XYZ Contractors',
        opportunityStage: 'Proposal',
        historicalOrders: '$45K (last 12 months)',
        industryAverage: '$32K',
        seasonality: 'High (Spring)'
      },
      output: {
        predictedValue: 18500,
        confidence: 82,
        range: { low: 14000, high: 24000 },
        factors: [
          'Customer has 3x industry avg spending pattern',
          'Spring season = +25% typical increase',
          'Similar deals closed avg $18.2K',
          'Proposal stage = 60% win probability'
        ],
        recommendedAction: 'Upsell premium equipment package. Customer likely to accept +$5K add-ons based on history.'
      }
    },
    'sentiment-analysis': {
      title: 'Sentiment Analysis',
      icon: '😊',
      description: 'Real-time emotion detection in communications',
      input: `Hi, thanks for the quote! The pricing looks great and we're excited to work with you. Just one concern - we need delivery by Monday 6am sharp or the whole project timeline is at risk. Can you guarantee that?`,
      output: {
        overallSentiment: 'Positive with urgency',
        score: 0.65,
        emotions: {
          positive: 70,
          neutral: 15,
          urgent: 10,
          concerned: 5
        },
        keyPhrases: [
          { text: 'pricing looks great', sentiment: 'positive' },
          { text: 'excited to work with you', sentiment: 'positive' },
          { text: 'whole project timeline is at risk', sentiment: 'urgent/concerned' }
        ],
        aiRecommendation: 'Customer is ready to buy but needs delivery assurance. Respond within 1 hour with firm delivery commitment to close deal.'
      }
    }
  };

  const currentDemo = demos[activeTab];

  const simulateProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500);
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
        AI Capabilities
      </h3>
      <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>
        Experience Quinn's AI-powered automation in action
      </p>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '12px'
      }}>
        {Object.entries(demos).map(([key, demo]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderBottom: activeTab === key ? '3px solid #3b82f6' : '3px solid transparent',
              backgroundColor: activeTab === key ? '#eff6ff' : 'transparent',
              color: activeTab === key ? '#3b82f6' : '#6b7280',
              fontSize: '13px',
              fontWeight: activeTab === key ? '600' : '500',
              cursor: 'pointer',
              borderRadius: '6px 6px 0 0',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{demo.icon}</span>
            <span>{demo.title}</span>
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
          {currentDemo.description}
        </p>

        {/* Input */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
            Input:
          </div>
          <div style={{
            padding: '12px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontSize: '13px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            color: '#1f2937'
          }}>
            {typeof currentDemo.input === 'string' 
              ? currentDemo.input 
              : JSON.stringify(currentDemo.input, null, 2)}
          </div>
        </div>

        {/* Process Button */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button
            onClick={simulateProcessing}
            disabled={isProcessing}
            style={{
              padding: '12px 24px',
              backgroundColor: isProcessing ? '#9ca3af' : '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isProcessing ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</span>
                Processing with GPT-4...
              </>
            ) : (
              <>
                <span>🤖</span>
                Analyze with AI
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
            AI Output:
          </div>
          
          {activeTab === 'task-extraction' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentDemo.output.map((task, i) => (
                <div key={i} style={{
                  padding: '14px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  border: '1px solid #86efac'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#065f46' }}>
                      ✓ {task.title}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: task.priority === 'high' ? '#fee2e2' : '#fef3c7',
                      color: task.priority === 'high' ? '#991b1b' : '#92400e',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#047857' }}>
                    Due: {task.dueDate} • Assigned: {task.assignee}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'lead-scoring' && (
            <div style={{
              padding: '16px',
              backgroundColor: '#ecfdf5',
              borderRadius: '8px',
              border: '2px solid #10b981'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: '700'
                }}>
                  {currentDemo.output.score}
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#065f46' }}>
                    {currentDemo.output.rating}
                  </div>
                  <div style={{ fontSize: '13px', color: '#047857' }}>
                    AI Confidence: 94%
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#065f46' }}>
                  Scoring Factors:
                </div>
                {currentDemo.output.signals.map((signal, i) => (
                  <div key={i} style={{ 
                    fontSize: '12px', 
                    color: '#047857',
                    marginBottom: '4px',
                    paddingLeft: '12px'
                  }}>
                    • {signal.factor}: <strong>{signal.weight}</strong>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#065f46'
              }}>
                <strong>💡 Recommendation:</strong> {currentDemo.output.recommendation}
              </div>
            </div>
          )}

          {activeTab === 'revenue-prediction' && (
            <div style={{
              padding: '16px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #3b82f6'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#1e40af', marginBottom: '4px' }}>
                    Predicted Value
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e3a8a' }}>
                    ${currentDemo.output.predictedValue.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: '#1e40af', marginBottom: '4px' }}>
                    Confidence
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>
                    {currentDemo.output.confidence}%
                  </div>
                </div>
              </div>

              <div style={{ 
                padding: '12px', 
                backgroundColor: '#dbeafe', 
                borderRadius: '6px',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '4px' }}>
                  Value Range:
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>
                  ${currentDemo.output.range.low.toLocaleString()} - ${currentDemo.output.range.high.toLocaleString()}
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '8px' }}>
                <strong>Contributing Factors:</strong>
              </div>
              {currentDemo.output.factors.map((factor, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#1e40af', marginBottom: '4px', paddingLeft: '12px' }}>
                  • {factor}
                </div>
              ))}

              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#1e40af'
              }}>
                <strong>🎯 Action:</strong> {currentDemo.output.recommendedAction}
              </div>
            </div>
          )}

          {activeTab === 'sentiment-analysis' && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #fbbf24'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', color: '#92400e', marginBottom: '8px' }}>
                  Overall Sentiment: <strong>{currentDemo.output.overallSentiment}</strong>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {Object.entries(currentDemo.output.emotions).map(([emotion, percent]) => (
                    <div key={emotion} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#92400e', marginBottom: '4px', textTransform: 'capitalize' }}>
                        {emotion}
                      </div>
                      <div style={{
                        height: '6px',
                        backgroundColor: '#fde68a',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${percent}%`,
                          backgroundColor: emotion === 'positive' ? '#10b981' : 
                                         emotion === 'urgent' ? '#ef4444' :
                                         emotion === 'concerned' ? '#f59e0b' : '#6b7280',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#92400e', marginTop: '2px' }}>
                        {percent}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#92400e' }}>
                  Key Phrases:
                </div>
                {currentDemo.output.keyPhrases.map((phrase, i) => (
                  <div key={i} style={{
                    padding: '8px 12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    marginBottom: '6px',
                    fontSize: '12px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#78350f' }}>"{phrase.text}"</span>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: '#fef3c7',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#92400e'
                    }}>
                      {phrase.sentiment}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: '#fde68a',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#92400e'
              }}>
                <strong>⚡ AI Recommendation:</strong> {currentDemo.output.aiRecommendation}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ 
        padding: '14px', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '8px',
        fontSize: '12px',
        color: '#0c4a6e',
        border: '1px solid #bae6fd'
      }}>
        <strong>🚀 Powered by GPT-4 & Custom ML Models:</strong> All AI features run automatically in the background. No manual configuration required.
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
