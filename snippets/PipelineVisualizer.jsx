'use client';
import { useState } from 'react';

/**
 * Interactive Sales Pipeline Visualizer
 * Shows opportunities moving through stages with AI insights
 */
export default function PipelineVisualizer() {
  const [selectedStage, setSelectedStage] = useState(null);

  const pipeline = [
    { 
      stage: 'Qualification', 
      count: 12, 
      value: 45000,
      color: '#94a3b8',
      deals: [
        { name: 'ABC Construction', value: 8500, probability: 25, aiInsight: 'Low engagement - recommend follow-up call' },
        { name: 'XYZ Contractors', value: 12000, probability: 40, aiInsight: 'High potential - website visit detected' }
      ]
    },
    { 
      stage: 'Proposal', 
      count: 8, 
      value: 72000,
      color: '#60a5fa',
      deals: [
        { name: 'DEF Builders', value: 25000, probability: 60, aiInsight: 'Strong signals - decision maker engaged' },
        { name: 'GHI Plumbing', value: 8500, probability: 55, aiInsight: 'Price-sensitive - consider discount' }
      ]
    },
    { 
      stage: 'Negotiation', 
      count: 5, 
      value: 95000,
      color: '#34d399',
      deals: [
        { name: 'JKL Roofing', value: 45000, probability: 85, aiInsight: 'Ready to close - final terms review' },
        { name: 'MNO Electric', value: 15000, probability: 70, aiInsight: 'Competitor quote received - match pricing' }
      ]
    },
    { 
      stage: 'Closed Won', 
      count: 3, 
      value: 52000,
      color: '#10b981',
      deals: [
        { name: 'PQR Concrete', value: 32000, probability: 100, aiInsight: 'Contract signed - schedule delivery' }
      ]
    }
  ];

  const totalValue = pipeline.reduce((sum, stage) => sum + stage.value, 0);
  const totalDeals = pipeline.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      borderRadius: '12px', 
      padding: '24px', 
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
        Sales Pipeline
      </h3>
      <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>
        AI-powered pipeline visualization with revenue forecasting
      </p>

      {/* Summary Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Pipeline</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
            ${(totalValue / 1000).toFixed(0)}K
          </div>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Active Deals</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>{totalDeals}</div>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Win Rate</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>68%</div>
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div style={{ marginBottom: '24px' }}>
        {pipeline.map((stage, index) => {
          const widthPercent = (stage.value / totalValue) * 100;
          return (
            <div key={stage.stage} style={{ marginBottom: '12px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '6px',
                fontSize: '13px'
              }}>
                <span style={{ fontWeight: '600', color: '#111827' }}>{stage.stage}</span>
                <span style={{ color: '#6b7280' }}>
                  {stage.count} deals • ${(stage.value / 1000).toFixed(0)}K
                </span>
              </div>
              
              <div 
                onClick={() => setSelectedStage(selectedStage === index ? null : index)}
                style={{
                  height: '48px',
                  backgroundColor: stage.color,
                  borderRadius: '8px',
                  width: `${widthPercent}%`,
                  minWidth: '25%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '14px',
                  position: 'relative',
                  boxShadow: selectedStage === index ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  transform: selectedStage === index ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                {widthPercent > 15 && `${widthPercent.toFixed(0)}%`}
              </div>

              {/* Expanded Deal Details */}
              {selectedStage === index && (
                <div style={{
                  marginTop: '12px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
                    Deals in {stage.stage}
                  </h4>
                  {stage.deals.map((deal, i) => (
                    <div 
                      key={i}
                      style={{
                        padding: '12px',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '600', fontSize: '13px', color: '#111827' }}>
                          {deal.name}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: stage.color }}>
                          ${(deal.value / 1000).toFixed(1)}K
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                        Win Probability: {deal.probability}%
                      </div>
                      <div style={{
                        padding: '8px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#1e40af',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px'
                      }}>
                        <span style={{ fontSize: '14px' }}>🤖</span>
                        <span><strong>AI Insight:</strong> {deal.aiInsight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ 
        padding: '16px', 
        backgroundColor: '#fef3c7', 
        borderRadius: '8px',
        fontSize: '13px',
        color: '#92400e',
        border: '1px solid #fde68a'
      }}>
        <strong>⚡ AI-Powered:</strong> Quinn automatically detects stage drift (deals stuck >30 days) and provides AI-generated recommendations to move deals forward.
      </div>
    </div>
  );
}
