'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Wifi, CheckCircle2 } from 'lucide-react';

export default function ServerWakeupBanner() {
    const [isWakingUp, setIsWakingUp] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isReconnected, setIsReconnected] = useState(false);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleColdStart = () => {
            if (isWakingUp || isReconnected) return;
            setIsWakingUp(true);
            setProgress(5);
        };

        const handleAwake = () => {
            if (!isWakingUp) return;
            handleConnectionRestored();
        };

        window.addEventListener('server-cold-starting', handleColdStart);
        window.addEventListener('server-awake', handleAwake);

        return () => {
            window.removeEventListener('server-cold-starting', handleColdStart);
            window.removeEventListener('server-awake', handleAwake);
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        };
    }, [isWakingUp, isReconnected]);

    useEffect(() => {
        if (isWakingUp && !isReconnected) {
            const start = Date.now();
            const totalDuration = 35000;

            progressTimerRef.current = setInterval(() => {
                const elapsed = Date.now() - start;
                const pct = Math.min(92, Math.round((elapsed / totalDuration) * 90) + 5);
                setProgress(pct);
            }, 500);

            pollIntervalRef.current = setInterval(async () => {
                try {
                    const res = await fetch('/api/health', { cache: 'no-store' });
                    if (res.ok) {
                        handleConnectionRestored();
                    }
                } catch (e) {
                    // Still booting
                }
            }, 3000);

            return () => {
                if (progressTimerRef.current) clearInterval(progressTimerRef.current);
                if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            };
        }
    }, [isWakingUp, isReconnected]);

    const handleConnectionRestored = () => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        setProgress(100);
        setIsReconnected(true);

        setTimeout(() => {
            setIsWakingUp(false);
            setIsReconnected(false);
            setProgress(0);
            window.location.reload();
        }, 1200);
    };

    if (!isWakingUp) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            maxWidth: '440px',
            width: 'calc(100vw - 48px)',
            background: 'linear-gradient(135deg, rgba(43, 24, 16, 0.96) 0%, rgba(92, 18, 23, 0.96) 100%)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(212, 155, 53, 0.4)',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35), 0 0 20px rgba(212, 155, 53, 0.2)',
            color: '#FAF6F0',
            fontFamily: 'inherit',
            animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: isReconnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(212, 155, 53, 0.2)',
                    border: `1px solid ${isReconnected ? '#10B981' : '#D49B35'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    {isReconnected ? (
                        <CheckCircle2 size={20} color="#10B981" />
                    ) : (
                        <Wifi size={20} color="#D49B35" className="animate-pulse" />
                    )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#FAF6F0', letterSpacing: '-0.01em' }}>
                            {isReconnected ? 'Server Connected!' : 'Connecting to Cloud Server...'}
                        </h4>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isReconnected ? '#10B981' : '#D49B35' }}>
                            {progress}%
                        </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#D4C4B5', lineHeight: 1.4 }}>
                        {isReconnected
                            ? 'Server is online. Refreshing page data now...'
                            : 'Backend is waking up from idle mode (~35s). Your page will open automatically!'}
                    </p>

                    <div style={{
                        marginTop: '12px',
                        width: '100%',
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: isReconnected
                                ? 'linear-gradient(90deg, #10B981, #34D399)'
                                : 'linear-gradient(90deg, #D49B35, #E5B358)',
                            borderRadius: '3px',
                            transition: 'width 0.4s ease-out'
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
