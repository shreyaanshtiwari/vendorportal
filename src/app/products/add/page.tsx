"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Loader2, CheckCircle } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import '../../../styles/dashboard.css';

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    category: '',
    region: '',
    state: '',
    taste: '',
    shelf_life: '',
    ingredients: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name) {
      setError('Product name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const productData: any = {
        name: form.name,
        category: form.category || null,
        region: form.region || null,
        state: form.state || null,
        taste: form.taste || null,
        shelf_life: form.shelf_life || null,
        ingredients: form.ingredients || null,
        // Default values for removed fields to avoid db constraints
        price: 0,
        stock: 0,
        image_url: "", 
      };

      await fetchApi('/vendor/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      setSuccess('Product added successfully! It is now pending admin approval.');
      setTimeout(() => router.push('/products'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid var(--royal-border)',
    outline: 'none',
    fontSize: '14px',
    color: 'var(--royal-text-dark)',
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    width: '100%',
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      
      {/* Page Title */}
      <div className="desktop-only" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>Add New Product</h1>
        <p style={{ fontSize: '14px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>Enter details to list a new item. It will be sent for admin approval.</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div style={{ padding: '16px', background: '#dcfce7', color: '#166534', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <CheckCircle size={20} /> {success}
        </div>
      )}
      {error && (
        <div style={{ padding: '16px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '16px', fontWeight: 600 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Product Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>Product Name *</label>
          <input 
            type="text" 
            placeholder="Enter product name" 
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>Category</label>
          <div style={{ position: 'relative' }}>
            <select 
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">Select category</option>
              <option value="Sweets">Sweets</option>
              <option value="Snacks">Snacks</option>
              <option value="Namkeen">Namkeen</option>
              <option value="Pickles">Pickles</option>
              <option value="Spices">Spices</option>
              <option value="Beverages">Beverages</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown size={18} color="var(--royal-text-gray)" style={{ position: 'absolute', right: '16px', top: '14px', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Region & State Row */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>Region</label>
            <input 
              type="text" 
              placeholder="e.g. North India" 
              value={form.region}
              onChange={(e) => handleChange('region', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>State</label>
            <input 
              type="text" 
              placeholder="e.g. Bihar" 
              value={form.state}
              onChange={(e) => handleChange('state', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Taste & Shelf Life Row */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>Taste</label>
            <input 
              type="text" 
              placeholder="e.g. Sweet, Spicy" 
              value={form.taste}
              onChange={(e) => handleChange('taste', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>Shelf Life</label>
            <input 
              type="text" 
              placeholder="e.g. 15 days" 
              value={form.shelf_life}
              onChange={(e) => handleChange('shelf_life', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Ingredients */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>Ingredients</label>
          <input 
            type="text" 
            placeholder="e.g. Wheat flour, Jaggery, Ghee" 
            value={form.ingredients}
            onChange={(e) => handleChange('ingredients', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Save Button */}
        <div style={{ marginTop: '8px' }}>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: isSubmitting ? '#999' : 'var(--royal-maroon)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '15px', 
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(74, 4, 4, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Submitting...
              </>
            ) : (
              'Save Product'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
