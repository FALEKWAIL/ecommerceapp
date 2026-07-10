'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message || 'Invalid email or password. Please try again.');
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--col-dark)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '0 24px',
      }}>
        {/* Brand */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '42px',
            fontWeight: 900,
            letterSpacing: '0.22em',
            color: 'var(--col-bg)',
          }}>
            VORN
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            letterSpacing: '0.28em',
            color: 'var(--col-muted)',
            marginTop: '8px',
          }}>
            SELLER ACCESS
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'var(--col-muted)',
              marginBottom: '8px',
            }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '2px',
                padding: '14px 16px',
                color: 'var(--col-bg)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--col-sand)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'var(--col-muted)',
              marginBottom: '8px',
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '2px',
                padding: '14px 16px',
                color: 'var(--col-bg)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--col-sand)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
          </div>

          {error && (
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: '#e05252',
              padding: '12px 14px',
              background: 'rgba(224,82,82,0.10)',
              border: '1px solid rgba(224,82,82,0.25)',
              borderRadius: '2px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              width: '100%',
              background: 'var(--col-sand)',
              color: 'var(--col-dark)',
              border: 'none',
              padding: '16px',
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.2s, transform 0.15s',
              borderRadius: '2px',
            }}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          color: 'rgba(240,237,232,0.25)',
        }}>
          VORN — Admin Portal
        </div>
      </div>
    </div>
  );
}
