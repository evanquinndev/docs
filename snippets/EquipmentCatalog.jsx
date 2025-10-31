'use client';
import { useState, useEffect } from 'react';

/**
 * Interactive Equipment Catalog Browser
 * Demonstrates Quinn's inventory management capabilities
 */
export default function EquipmentCatalog({ apiUrl = 'https://your-instance.replit.app' }) {
  const [inventory, setInventory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample data (in production, fetch from Quinn API)
  const sampleInventory = [
    { id: 1, name: 'Compact Excavator CAT 305.5E2', category: 'Excavators', dailyRate: 425, weeklyRate: 1700, available: 3, imageUrl: '🚜' },
    { id: 2, name: 'Skid Steer Bobcat S650', category: 'Loaders', dailyRate: 350, weeklyRate: 1400, available: 5, imageUrl: '🏗️' },
    { id: 3, name: 'Telescopic Forklift JLG 1055', category: 'Forklifts', dailyRate: 500, weeklyRate: 2000, available: 2, imageUrl: '🔧' },
    { id: 4, name: 'Concrete Mixer 9 Cu Ft', category: 'Concrete', dailyRate: 75, weeklyRate: 300, available: 8, imageUrl: '🪣' },
    { id: 5, name: 'Scissor Lift 26ft Genie GS-2646', category: 'Lifts', dailyRate: 275, weeklyRate: 1100, available: 4, imageUrl: '⬆️' },
    { id: 6, name: 'Plate Compactor Wacker WP1550', category: 'Compaction', dailyRate: 90, weeklyRate: 360, available: 6, imageUrl: '💪' },
    { id: 7, name: 'Walk-Behind Trencher Ditch Witch', category: 'Trenchers', dailyRate: 225, weeklyRate: 900, available: 2, imageUrl: '⛏️' },
    { id: 8, name: 'Generator 10KW Diesel', category: 'Power', dailyRate: 125, weeklyRate: 500, available: 7, imageUrl: '⚡' },
  ];

  useEffect(() => {
    setInventory(sampleInventory);
  }, []);

  const categories = ['All', ...new Set(sampleInventory.map(item => item.category))];

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      borderRadius: '12px', 
      padding: '24px', 
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
        Equipment Catalog
      </h3>
      <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>
        Browse available rental equipment with real-time pricing
      </p>

      {/* Search and Filter */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '12px',
            boxSizing: 'border-box'
          }}
        />
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '6px 14px',
                border: selectedCategory === category ? '2px solid #3b82f6' : '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: selectedCategory === category ? '#eff6ff' : '#ffffff',
                color: selectedCategory === category ? '#3b82f6' : '#4b5563',
                fontSize: '13px',
                fontWeight: selectedCategory === category ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {filteredInventory.map(item => (
          <div
            key={item.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#f9fafb',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '12px', textAlign: 'center' }}>
              {item.imageUrl}
            </div>
            
            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: '#111827' }}>
              {item.name}
            </h4>
            
            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginBottom: '12px',
              padding: '4px 8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              display: 'inline-block'
            }}>
              {item.category}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', color: '#4b5563', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: '#111827' }}>${item.dailyRate}</span>/day
              </div>
              <div style={{ fontSize: '13px', color: '#4b5563' }}>
                <span style={{ fontWeight: '600', color: '#111827' }}>${item.weeklyRate}</span>/week
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px',
              backgroundColor: item.available > 0 ? '#d1fae5' : '#fee2e2',
              borderRadius: '6px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: item.available > 0 ? '#10b981' : '#ef4444'
              }} />
              <span style={{ 
                fontSize: '12px', 
                fontWeight: '600',
                color: item.available > 0 ? '#047857' : '#dc2626'
              }}>
                {item.available > 0 ? `${item.available} Available` : 'Out of Stock'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#9ca3af',
          fontSize: '14px'
        }}>
          No equipment found matching your criteria
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        backgroundColor: '#eff6ff', 
        borderRadius: '8px',
        fontSize: '13px',
        color: '#1e40af'
      }}>
        <strong>💡 Pro Tip:</strong> Quinn's inventory API supports real-time availability updates, automatic pricing tiers, and cross-sell recommendations based on customer history.
      </div>
    </div>
  );
}
