"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { Store, ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Connect to the REST API on localhost:8080
      const data = await fetchApi('/vendor/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Save token (Assuming the backend returns a JWT inside { token: '...' })
      if (data && data.token) {
        localStorage.setItem('vendor_token', data.token);
        // Optionally save vendor data
        localStorage.setItem('vendor_profile', JSON.stringify(data.vendor || {}));
        
        // Redirect to dashboard
        router.push('/');
      } else {
        throw new Error('Invalid response from server. Missing token.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--royal-cream)',
      padding: '24px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '440px',
        padding: '40px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
        border: '1px solid var(--royal-border)'
      }}>
        {/* Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'var(--royal-maroon)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Store size={32} color="var(--royal-gold)" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--royal-text-dark)', margin: '0 0 8px' }}>
            Vendor Portal
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--royal-text-gray)', margin: 0, textAlign: 'center' }}>
            Sign in to manage your store, products, and orders on SwadDesh.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '24px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--royal-text-gray)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                placeholder="vendor@swaddesh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  borderRadius: '12px',
                  border: '1px solid var(--royal-border)',
                  background: 'var(--royal-cream)',
                  fontSize: '15px',
                  color: 'var(--royal-text-dark)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Password</label>
              <a href="#" style={{ fontSize: '12px', color: 'var(--royal-maroon)', fontWeight: 600, textDecoration: 'none' }}>Forgot?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--royal-text-gray)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  borderRadius: '12px',
                  border: '1px solid var(--royal-border)',
                  background: 'var(--royal-cream)',
                  fontSize: '15px',
                  color: 'var(--royal-text-dark)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '16px',
              background: 'var(--royal-maroon)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isLoading ? 0.8 : 1,
              transition: 'var(--royal-transition)'
            }}
          >
            {isLoading ? (
              <Loader2 size={20} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>Sign In <ArrowRight size={20} /></>
            )}
          </button>
        </form>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
