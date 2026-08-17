"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi } from '../../lib/api';
import { 
  Store, 
  ArrowRight, 
  Lock, 
  Mail, 
  Loader2, 
  PackageCheck, 
  Truck, 
  Wallet, 
  ShieldCheck 
} from 'lucide-react';

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      let msg = err.message || 'Invalid email or password. Please try again.';
      msg = msg.replace(/^API request failed \[[^\]]+\]:\s*/, '');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes blob-move {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-10px, 10px) scale(0.97); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-panel { animation: fadeSlideUp 0.45s ease both; }
        .auth-blob { animation: blob-move 8s ease-in-out infinite; }
        .auth-blob:nth-child(2) { animation-delay: -3s; animation-duration: 11s; }
        .auth-input-field {
          width: 100%;
          padding: 13px 16px 13px 44px;
          border-radius: 12px;
          border: 1.5px solid var(--royal-border, #e5e7eb);
          background: white;
          font-size: 15px;
          color: var(--royal-text-dark, #111827);
          outline: none;
          font-family: var(--font-jakarta), sans-serif;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }
        .auth-input-field:focus {
          border-color: var(--royal-maroon, #4F5D2F);
          box-shadow: 0 0 0 3px rgba(79, 93, 47, 0.12);
        }
        .auth-input-field::placeholder { color: #a0a0a0; }
        .auth-primary-btn {
          width: 100%;
          padding: 15px;
          background: var(--royal-maroon, #4F5D2F);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          font-family: var(--font-jakarta), sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
          box-shadow: 0 4px 15px rgba(79, 93, 47, 0.35);
        }
        .auth-primary-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          background: var(--royal-maroon-hover, #3B4623);
          box-shadow: 0 8px 24px rgba(79, 93, 47, 0.45);
        }
        .auth-primary-btn:disabled { opacity: 0.75; cursor: not-allowed; }
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>

      <div style={{
        height: '100vh', display: 'flex', overflow: 'hidden',
        background: 'var(--royal-cream, #fefcfb)',
        fontFamily: 'var(--font-jakarta), sans-serif',
      }}>
        {/* Left Panel */}
        <div className="auth-left-panel" style={{
          flex: '1', height: '100%',
          background: 'var(--royal-maroon, #4F5D2F)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px', position: 'relative', overflow: 'hidden',
        }}>
          <div className="auth-blob" style={{
            position: 'absolute', top: '-80px', left: '-80px',
            width: '320px', height: '320px',
            background: 'rgba(212, 155, 53, 0.15)',
            borderRadius: '50%', filter: 'blur(60px)',
          }} />
          <div className="auth-blob" style={{
            position: 'absolute', bottom: '-60px', right: '-60px',
            width: '280px', height: '280px',
            background: 'rgba(212, 155, 53, 0.1)',
            borderRadius: '50%', filter: 'blur(50px)',
          }} />

          {/* Logo Section */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <Image
                src="/logo.png"
                alt="SwadDesh"
                width={260}
                height={80}
                style={{ width: '250px', height: 'auto', maxHeight: '75px', objectFit: 'contain' }}
                priority
              />
            </div>
            <div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '100px',
                padding: '4px 14px',
                color: '#fefcfb',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--royal-gold, #C9A14A)' }} />
                Vendor Partner Portal
              </span>
            </div>
          </div>

          {/* Headline & Value Proposition */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '520px', width: '100%', marginBottom: '26px' }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: '20px', 
              fontWeight: 800, 
              margin: '0 0 8px', 
              lineHeight: 1.3,
              whiteSpace: 'nowrap'
            }}>
              Apne Shehar Ka Asli Swad, Desh Ke Har Ghar Tak
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '13.5px', lineHeight: 1.5, margin: '0 auto', maxWidth: '440px' }}>
              Manage products, streamline orders & dispatches, and get transparent bank settlements — all in one unified seller console.
            </p>
          </div>

          {/* Operational Feature Cards */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '420px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '26px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 14px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              backdropFilter: 'blur(6px)',
            }}>
              <div style={{
                width: '34px', height: '34px',
                borderRadius: '9px',
                background: 'rgba(201, 161, 74, 0.22)',
                border: '1px solid rgba(201, 161, 74, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                color: '#EBB85A',
              }}>
                <PackageCheck size={17} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>Real-Time Order & Dispatch Management</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11.5px', marginTop: '1px' }}>Instant order sync, shipping labels & express courier pickups</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 14px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              backdropFilter: 'blur(6px)',
            }}>
              <div style={{
                width: '34px', height: '34px',
                borderRadius: '9px',
                background: 'rgba(201, 161, 74, 0.22)',
                border: '1px solid rgba(201, 161, 74, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                color: '#EBB85A',
              }}>
                <Wallet size={17} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>Transparent Bank Settlements</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11.5px', marginTop: '1px' }}>Automated GST invoices, zero hidden cuts & direct bank payouts</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 14px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              backdropFilter: 'blur(6px)',
            }}>
              <div style={{
                width: '34px', height: '34px',
                borderRadius: '9px',
                background: 'rgba(201, 161, 74, 0.22)',
                border: '1px solid rgba(201, 161, 74, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                color: '#EBB85A',
              }}>
                <Truck size={17} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>Pan-India Fast Logistics Network</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11.5px', marginTop: '1px' }}>Safe, monitored express delivery for fresh regional sweets & snacks</div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '100px',
            padding: '7px 18px',
            color: 'rgba(255,255,255,0.75)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <ShieldCheck size={15} color="#EBB85A" />
            <span>FSSAI Compliant & Verified Partner Network</span>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{
          width: '100%', maxWidth: '580px', height: '100%',
          display: 'flex', flexDirection: 'column',
          background: 'white',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.06)',
          overflowY: 'auto',
        }}>
          <div style={{
             margin: 'auto 0',
             padding: '48px 40px',
             width: '100%',
             display: 'flex',
             justifyContent: 'center'
          }}>
            <div className="auth-panel" style={{ width: '100%', maxWidth: '400px' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--royal-text-dark, #111827)', margin: '0 0 10px', lineHeight: 1.2 }}>
                Welcome back
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--royal-text-gray, #6b7280)', margin: 0 }}>
                Sign in to manage your SwadDesh store.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: '#fff1f1', color: '#c0392b',
                padding: '12px 16px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 500,
                marginBottom: '24px', border: '1px solid #fcd4d4',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color={focusedField === 'email' ? 'var(--royal-maroon, #4F5D2F)' : 'var(--royal-text-gray, #9ca3af)'} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s ease' }} />
                  <input 
                    type="email" 
                    placeholder="vendor@swaddesh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input-field"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>Password</label>
                  <a href="#" style={{ fontSize: '13px', color: 'var(--royal-maroon, #4F5D2F)', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color={focusedField === 'password' ? 'var(--royal-maroon, #4F5D2F)' : 'var(--royal-text-gray, #9ca3af)'} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s ease' }} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input-field"
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="auth-primary-btn"
                style={{ marginTop: '8px' }}
              >
                {isLoading ? (
                  <Loader2 size={20} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>Sign In <ArrowRight size={20} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '32px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--royal-border, #e5e7eb)' }} />
              <span style={{ fontSize: '13px', color: 'var(--royal-text-gray, #6b7280)', whiteSpace: 'nowrap' }}>New to SwadDesh?</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--royal-border, #e5e7eb)' }} />
            </div>

            <Link
              href="/register"
              style={{
                display: 'block', padding: '14px',
                background: 'var(--royal-cream, #fefcfb)',
                border: '1.5px solid var(--royal-border, #e5e7eb)',
                borderRadius: '12px',
                fontSize: '15px', fontWeight: 600,
                color: 'var(--royal-maroon, #4F5D2F)',
                textAlign: 'center', textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--royal-maroon, #4F5D2F)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--royal-border, #e5e7eb)'; }}
            >
              Create Vendor Account
            </Link>

          </div>
        </div>
      </div>
      </div>
    </>
  );
}
