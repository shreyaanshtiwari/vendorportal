"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi } from '../../lib/api';
import {
  Eye, EyeOff, ArrowRight, ArrowLeft, Loader2,
  CheckCircle2, Store, MapPin, User,
} from 'lucide-react';

type Step = 1 | 2 | 3;

interface FormData {
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  storeName: string;
  businessType: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const INITIAL_FORM: FormData = {
  ownerName: '', email: '', phone: '', password: '', confirmPassword: '',
  storeName: '', businessType: 'Grocery & Food', gstNumber: '',
  address: '', city: '', state: '', pincode: '',
};

const STEPS = [
  { number: 1, label: 'Personal Info', icon: <User size={16} /> },
  { number: 2, label: 'Business Info', icon: <Store size={16} /> },
  { number: 3, label: 'Location', icon: <MapPin size={16} /> },
];

export default function VendorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validateStep = (): string | null => {
    if (step === 1) {
      if (!form.ownerName.trim()) return 'Owner name is required.';
      if (!form.email.trim()) return 'Email is required.';
      if (!form.phone.trim() || form.phone.length < 10) return 'Valid phone number is required.';
      if (!form.password || form.password.length < 8) return 'Password must be at least 8 characters.';
      if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    }
    if (step === 2) {
      if (!form.storeName.trim()) return 'Store name is required.';
    }
    if (step === 3) {
      if (!form.address.trim()) return 'Address is required.';
      if (!form.city.trim()) return 'City is required.';
      if (!form.state.trim()) return 'State is required.';
      if (!form.pincode.trim() || form.pincode.length !== 6) return 'Valid 6-digit pincode is required.';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep((prev) => (prev + 1) as Step);
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => (prev - 1) as Step);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { setError(err); return; }
    setIsLoading(true);
    setError('');

    try {
      await fetchApi('/vendor/register', {
        method: 'POST',
        body: JSON.stringify({
          ownerName: form.ownerName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          storeName: form.storeName,
          businessType: form.businessType,
          gstNumber: form.gstNumber,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        }),
      });
      setSuccess(true);
    } catch (err: any) {
      let msg = err.message || 'Registration failed. Please try again.';
      msg = msg.replace(/^API request failed \[[^\]]+\]:\s*/, '');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--royal-cream, #fefcfb)',
        fontFamily: 'var(--font-jakarta), sans-serif',
      }}>
        <div style={{
          background: 'white', borderRadius: '24px', padding: '56px 48px',
          maxWidth: '480px', width: '100%', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          border: '1px solid var(--royal-border, #e5e7eb)',
        }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
          }}>
            <CheckCircle2 size={40} color="white" />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--royal-text-dark, #111827)', margin: '0 0 12px' }}>
            Registration Submitted!
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--royal-text-gray, #6b7280)', margin: '0 0 32px', lineHeight: 1.6 }}>
            Your vendor application has been received. Our team will review your details and send you an approval email within <strong>24–48 hours</strong>.
          </p>
          <Link href="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 32px',
            background: 'var(--royal-maroon, #4F5D2F)',
            color: 'white', borderRadius: '12px', fontWeight: 700,
            fontSize: '15px', textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(79, 93, 47, 0.35)',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--royal-maroon-hover, #3B4623)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'var(--royal-maroon, #4F5D2F)'; }}
          >
            Go to Sign In <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const PasswordStrength = ({ value }: { value: string }) => {
    if (!value.length) return null;
    const strength = value.length >= 12 ? 4 : value.length >= 10 ? 3 : value.length >= 8 ? 2 : 1;
    const label = strength >= 4 ? 'Strong' : strength >= 3 ? 'Good' : strength >= 2 ? 'Fair' : 'Weak';
    const color = strength >= 3 ? '#22c55e' : strength >= 2 ? '#f59e0b' : '#ef4444';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '4px', borderRadius: '4px',
            background: i < strength ? color : 'var(--royal-border, #e5e7eb)',
            transition: 'background 0.2s',
          }} />
        ))}
        <span style={{ fontSize: '11px', color: 'var(--royal-text-gray, #6b7280)', whiteSpace: 'nowrap', minWidth: '32px' }}>{label}</span>
      </div>
    );
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
        .reg-panel { animation: fadeSlideUp 0.45s ease both; }
        .reg-step-panel { animation: fadeSlideUp 0.35s ease both; }
        .reg-auth-blob { animation: blob-move 8s ease-in-out infinite; }
        .reg-auth-blob:nth-child(2) { animation-delay: -3s; animation-duration: 11s; }
        .reg-input-field {
          width: 100%;
          padding: 13px 16px;
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
        .reg-input-field:focus {
          border-color: var(--royal-maroon, #4F5D2F);
          box-shadow: 0 0 0 3px rgba(79, 93, 47, 0.12);
        }
        .reg-input-field::placeholder { color: #a0a0a0; }
        .reg-primary-btn {
          flex: 1;
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
        .reg-primary-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          background: var(--royal-maroon-hover, #3B4623);
          box-shadow: 0 8px 24px rgba(79, 93, 47, 0.45);
        }
        .reg-primary-btn:disabled { opacity: 0.75; cursor: not-allowed; }
        .reg-back-btn {
          padding: 14px 20px;
          background: var(--royal-cream, #fefcfb);
          color: var(--royal-text-dark, #111827);
          border: 1.5px solid var(--royal-border, #e5e7eb);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          font-family: var(--font-jakarta), sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }
        .reg-back-btn:hover {
          border-color: var(--royal-maroon, #5c1217);
          color: var(--royal-maroon, #5c1217);
        }
        .reg-eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--royal-text-gray, #6b7280);
          display: flex;
          align-items: center;
          padding: 2px;
          transition: color 0.2s;
        }
        .reg-eye-btn:hover { color: var(--royal-maroon, #5c1217); }
        @media (max-width: 768px) {
          .reg-auth-left-panel { display: none !important; }
        }
      `}</style>

      <div style={{
        height: '100vh', display: 'flex', overflow: 'hidden',
        background: 'var(--royal-cream, #fefcfb)',
        fontFamily: 'var(--font-jakarta), sans-serif',
      }}>
        {/* Left Panel */}
        <div className="reg-auth-left-panel" style={{
          flex: '1', height: '100%',
          background: 'var(--royal-maroon, #4F5D2F)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px', position: 'relative', overflow: 'hidden',
        }}>
          <div className="reg-auth-blob" style={{
            position: 'absolute', top: '-80px', left: '-80px',
            width: '320px', height: '320px',
            background: 'rgba(212, 155, 53, 0.15)',
            borderRadius: '50%', filter: 'blur(60px)',
          }} />
          <div className="reg-auth-blob" style={{
            position: 'absolute', bottom: '-60px', right: '-60px',
            width: '280px', height: '280px',
            background: 'rgba(212, 155, 53, 0.1)',
            borderRadius: '50%', filter: 'blur(50px)',
          }} />

          {/* Logo Section */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '36px' }}>
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

          {/* Step indicators */}
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Registration Steps
            </p>
            {STEPS.map((s) => {
              const isActive = step === s.number;
              const isDone = step > s.number;
              return (
                <div key={s.number} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  background: isActive ? 'rgba(255,255,255,0.15)' : isDone ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '14px', padding: '14px 18px',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: isDone ? '#22c55e' : isActive ? 'var(--royal-gold, #d49b35)' : 'rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.3s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(212, 155, 53, 0.5)' : 'none',
                  }}>
                    {isDone
                      ? <CheckCircle2 size={18} color="white" />
                      : <span style={{ color: isActive ? 'var(--royal-text-dark, #111827)' : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 700 }}>{s.number}</span>
                    }
                  </div>
                  <div>
                    <p style={{ color: isActive ? 'white' : isDone ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)', fontWeight: isActive ? 700 : 500, fontSize: '14px', margin: 0 }}>
                      {s.label}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: 0 }}>
                      {isDone ? 'Completed ✓' : isActive ? 'In progress' : 'Upcoming'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            position: 'absolute', bottom: '32px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px', padding: '8px 20px',
            color: 'rgba(255,255,255,0.5)', fontSize: '13px',
          }}>
            Trusted by 2,000+ vendors across India
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
            <div className="reg-panel" style={{ width: '100%', maxWidth: '460px' }}>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <span style={{
                display: 'inline-block', padding: '4px 12px',
                background: 'rgba(79, 93, 47, 0.1)',
                borderRadius: '100px', fontSize: '12px', fontWeight: 700,
                color: 'var(--royal-maroon, #4F5D2F)', letterSpacing: '0.5px', marginBottom: '12px',
              }}>
                Step {step} of 3
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--royal-text-dark, #111827)', margin: '0 0 8px', lineHeight: 1.2 }}>
                {step === 1 ? 'Create your account' : step === 2 ? 'Tell us about your business' : 'Where are you located?'}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--royal-text-gray, #6b7280)', margin: 0 }}>
                {step === 1 ? 'Start your journey as a SwadDesh vendor partner.' : step === 2 ? 'Help customers discover your store.' : 'Provide your store address for delivery coordination.'}
              </p>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '24px', background: 'var(--royal-border, #e5e7eb)', borderRadius: '100px', height: '5px' }}>
              <div style={{
                width: `${(step / 3) * 100}%`,
                height: '100%',
                background: 'var(--royal-maroon, #4F5D2F)',
                borderRadius: '100px',
                transition: 'width 0.4s ease',
              }} />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#fff1f1', color: '#c0392b',
                padding: '12px 16px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 500,
                marginBottom: '20px', border: '1px solid #fcd4d4',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* STEP 1 ─ Personal Info */}
            {step === 1 && (
              <div className="reg-step-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>Full Name</label>
                  <input id="ownerName" type="text" placeholder="Rajesh Kumar" value={form.ownerName} onChange={set('ownerName')} required className="reg-input-field" onFocus={() => setFocusedField('ownerName')} onBlur={() => setFocusedField(null)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>Email Address</label>
                  <input id="email" type="email" placeholder="rajesh@example.com" value={form.email} onChange={set('email')} required className="reg-input-field" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>Phone Number</label>
                  <input id="phone" type="tel" placeholder="9876543210" value={form.phone} onChange={set('phone')} required className="reg-input-field" onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={set('password')}
                      required
                      className="reg-input-field"
                      style={{ paddingRight: '48px' } as React.CSSProperties}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button type="button" className="reg-eye-btn" onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
                      {showPassword ? <EyeOff size={18} color={focusedField === 'password' ? 'var(--royal-maroon, #4F5D2F)' : 'currentColor'} /> : <Eye size={18} color={focusedField === 'password' ? 'var(--royal-maroon, #4F5D2F)' : 'currentColor'} />}
                    </button>
                  </div>
                  <PasswordStrength value={form.password} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={set('confirmPassword')}
                      required
                      className="reg-input-field"
                      style={{ paddingRight: '48px' } as React.CSSProperties}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button type="button" className="reg-eye-btn" onClick={() => setShowConfirm(p => !p)} tabIndex={-1}>
                      {showConfirm ? <EyeOff size={18} color={focusedField === 'confirmPassword' ? 'var(--royal-maroon, #4F5D2F)' : 'currentColor'} /> : <Eye size={18} color={focusedField === 'confirmPassword' ? 'var(--royal-maroon, #4F5D2F)' : 'currentColor'} />}
                    </button>
                  </div>
                  {form.confirmPassword && form.confirmPassword !== form.password && (
                    <p style={{ fontSize: '12px', color: '#ef4444', margin: '2px 0 0', fontWeight: 500 }}>Passwords do not match</p>
                  )}
                  {form.confirmPassword && form.confirmPassword === form.password && form.password.length >= 8 && (
                    <p style={{ fontSize: '12px', color: '#22c55e', margin: '2px 0 0', fontWeight: 500 }}>✓ Passwords match</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2 ─ Business Info */}
            {step === 2 && (
              <div className="reg-step-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>Store Name</label>
                  <input id="storeName" type="text" placeholder="Rajesh General Store" value={form.storeName} onChange={set('storeName')} required className="reg-input-field" onFocus={() => setFocusedField('storeName')} onBlur={() => setFocusedField(null)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>GST Number <span style={{ color: 'var(--royal-text-gray, #6b7280)', fontWeight: 400 }}>(Optional)</span></label>
                  <input id="gstNumber" type="text" placeholder="22AAAAA0000A1Z5" value={form.gstNumber} onChange={set('gstNumber')} className="reg-input-field" onFocus={() => setFocusedField('gstNumber')} onBlur={() => setFocusedField(null)} />
                </div>
                <div style={{
                  background: 'rgba(212, 155, 53, 0.08)',
                  border: '1px solid rgba(212, 155, 53, 0.3)',
                  borderRadius: '12px', padding: '14px 16px',
                  fontSize: '13px', color: 'var(--royal-text-gray, #6b7280)', lineHeight: 1.6,
                }}>
                  💡 <strong>Tip:</strong> Providing your GST number helps with faster payouts and builds customer trust.
                </div>
              </div>
            )}

            {/* STEP 3 ─ Location */}
            {step === 3 && (
              <div className="reg-step-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>Street Address</label>
                  <input id="address" type="text" placeholder="123 Market Street, Near Bus Stand" value={form.address} onChange={set('address')} required className="reg-input-field" onFocus={() => setFocusedField('address')} onBlur={() => setFocusedField(null)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>City</label>
                    <input id="city" type="text" placeholder="Jaipur" value={form.city} onChange={set('city')} required className="reg-input-field" onFocus={() => setFocusedField('city')} onBlur={() => setFocusedField(null)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>State</label>
                    <input id="state" type="text" placeholder="Rajasthan" value={form.state} onChange={set('state')} required className="reg-input-field" onFocus={() => setFocusedField('state')} onBlur={() => setFocusedField(null)} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-dark, #111827)' }}>Pincode</label>
                  <input id="pincode" type="text" placeholder="302001" value={form.pincode} onChange={set('pincode')} required maxLength={6} className="reg-input-field" onFocus={() => setFocusedField('pincode')} onBlur={() => setFocusedField(null)} />
                </div>
                <div style={{
                  background: 'rgba(79, 93, 47, 0.05)',
                  border: '1px solid rgba(79, 93, 47, 0.15)',
                  borderRadius: '12px', padding: '14px 16px',
                  fontSize: '13px', color: 'var(--royal-text-gray, #6b7280)', lineHeight: 1.6,
                }}>
                  🔒 Your address is used only for delivery coordination and won&apos;t be shared publicly.
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              {step > 1 && (
                <button type="button" onClick={handleBack} className="reg-back-btn">
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="reg-primary-btn">
                  Continue <ArrowRight size={18} />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={isLoading} className="reg-primary-btn">
                  {isLoading
                    ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    : <>Submit Application <ArrowRight size={18} /></>
                  }
                </button>
              )}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--royal-border, #e5e7eb)' }} />
              <span style={{ fontSize: '13px', color: 'var(--royal-text-gray, #6b7280)', whiteSpace: 'nowrap' }}>Already a vendor?</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--royal-border, #e5e7eb)' }} />
            </div>

            <Link
              href="/login"
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
              Sign In Instead
            </Link>

            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--royal-text-gray, #6b7280)', marginTop: '20px', marginBottom: 0 }}>
              By registering, you agree to SwadDesh&apos;s{' '}
              <a href="#" style={{ color: 'var(--royal-maroon, #4F5D2F)', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: 'var(--royal-maroon, #4F5D2F)', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
