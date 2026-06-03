'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Recipient { email: string; prenom: string; }
interface Newsletter { id: string; subject: string; html: string; }

export default function SendPage() {
  const { id } = useParams();
  const router = useRouter();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [testEmail, setTestEmail] = useState('');
  const [testError, setTestError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'test' | 'all'>('all');
  const [modalEmail, setModalEmail] = useState('');

  useEffect(() => {
    fetch('/api/newsletters').then(r => r.json()).then((list: Newsletter[]) => {
      setNewsletter(list.find(n => n.id === id) || null);
    });
    fetch('/api/recipients').then(r => r.json()).then(setRecipients);
  }, [id]);

  const handleSendAll = async () => {
    setSending(true);
    await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsletterId: id }),
    });
    setSending(false);
    setSent(true);
    setModalType('all');
    setShowModal(true);
  };

  const handleTest = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!testEmail || !emailRegex.test(testEmail)) {
      setTestError('Veuillez saisir un email valide');
      return;
    }
    setTestError('');
    await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newsletterId: id, testEmail }),
    });
    setModalEmail(testEmail);
    setModalType('test');
    setShowModal(true);
  };

  const COLORS: Record<string, string> = {
    A:'#6366f1', B:'#8b5cf6', C:'#ec4899', D:'#10b981', E:'#f59e0b',
  };

  const FIREWORK_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#f472b6','#a78bfa'];

  if (!newsletter) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', sans-serif;
          background: radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.1) 0%, transparent 50%),
                      #0a0a0f;
          min-height: 100vh;
          color: #fff;
        }

        .modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        .modal-box {
          background: linear-gradient(145deg, #13111f, #0f0e1a);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 24px;
          padding: 40px 36px;
          max-width: 420px; width: 90%;
          text-align: center;
          position: relative;
          box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1);
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
          overflow: hidden;
        }
        @keyframes popIn {
          from { transform: scale(0.7) translateY(30px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        .modal-box::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #8b5cf6, #6366f1);
          background-size: 200%;
          animation: gradientMove 2s linear infinite;
        }
        @keyframes gradientMove { from { background-position: 0% } to { background-position: 200% } }

        .modal-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2));
          border: 2px solid rgba(99,102,241,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; margin: 0 auto 20px;
          animation: iconBounce 0.6s 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes iconBounce {
          from { transform: scale(0) rotate(-180deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .modal-close {
          position: absolute; top: 16px; right: 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          width: 30px; height: 30px; border-radius: 8px;
          cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .firework {
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          animation: firework var(--dur) ease-out var(--delay) both;
          pointer-events: none;
        }
        @keyframes firework {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }

        .sparkle {
          position: absolute;
          font-size: var(--size, 14px);
          animation: sparkle var(--dur) ease-out var(--delay) both;
          pointer-events: none;
        }
        @keyframes sparkle {
          0%   { transform: translate(0,0) scale(0) rotate(0deg); opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 0; }
        }

        .modal-btn {
          margin-top: 28px;
          padding: 13px 32px;
          border-radius: 12px; border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; font-size: 14px; font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(99,102,241,0.4);
          transition: all 0.2s;
          width: 100%;
        }
        .modal-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }

        .error-msg {
          color: #f87171;
          font-size: 12px;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          animation: shake 0.3s ease;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>

            {[...Array(24)].map((_, i) => {
              const angle = (i / 24) * 360;
              const dist = 60 + Math.random() * 80;
              const color = FIREWORK_COLORS[i % FIREWORK_COLORS.length];
              return (
                <div key={i} className="firework" style={{
                  left: '50%', top: '30%',
                  background: color,
                  boxShadow: `0 0 6px ${color}`,
                  '--tx': `${Math.cos(angle * Math.PI / 180) * dist}px`,
                  '--ty': `${Math.sin(angle * Math.PI / 180) * dist}px`,
                  '--dur': `${0.6 + Math.random() * 0.6}s`,
                  '--delay': `${Math.random() * 0.3}s`,
                } as React.CSSProperties} />
              );
            })}

            {['✨','🎉','⭐','💫','🌟','✨','🎊','💥'].map((emoji, i) => {
              const angle = (i / 8) * 360 + Math.random() * 30;
              const dist = 80 + Math.random() * 60;
              return (
                <div key={i} className="sparkle" style={{
                  left: '50%', top: '30%',
                  '--tx': `${Math.cos(angle * Math.PI / 180) * dist}px`,
                  '--ty': `${Math.sin(angle * Math.PI / 180) * dist}px`,
                  '--rot': `${Math.random() * 360}deg`,
                  '--dur': `${0.8 + Math.random() * 0.6}s`,
                  '--delay': `${0.1 + Math.random() * 0.4}s`,
                  '--size': `${14 + Math.random() * 10}px`,
                } as React.CSSProperties}>
                  {emoji}
                </div>
              );
            })}

            <div className="modal-icon">
              {modalType === 'test' ? '✉️' : '🚀'}
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, background: 'linear-gradient(135deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {modalType === 'test' ? 'Email de test envoyé !' : 'Newsletter envoyée !'}
            </h2>

            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6 }}>
              {modalType === 'test'
                ? <>Email envoyé avec succès à <span style={{ color: '#818cf8', fontWeight: 600 }}>{modalEmail}</span></>
                : <>Ta newsletter a été envoyée à <span style={{ color: '#818cf8', fontWeight: 600 }}>{recipients.length} destinataire{recipients.length > 1 ? 's' : ''}</span> avec succès !</>
              }
            </p>

            <button className="modal-btn" onClick={() => setShowModal(false)}>
              {modalType === 'test' ? 'Parfait !' : '🎉 Super !'}
            </button>
          </div>
        </div>
      )}

      <div style={{ minHeight: '100vh', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>

        {/* Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
          <button onClick={() => router.push('/editor')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            ← Retour à l'éditeur
          </button>
          <button onClick={() => router.push(`/preview/${id}`)} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            👁 Aperçu
          </button>
        </div>

        <div style={{ maxWidth: 560, margin: '0 auto' }}>

          {/* Status badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '4px 12px', marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', letterSpacing: 1 }}>PRÊT À ENVOYER</span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Envoyer la newsletter</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 32, fontSize: 14 }}>
            Sujet : <span style={{ color: '#818cf8', fontWeight: 600 }}>{newsletter.subject}</span>
          </p>

          {/* Recipients */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>DESTINATAIRES</span>
              <span style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                {recipients.length} contacts
              </span>
            </div>
            {recipients.map((r) => (
              <div key={r.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: COLORS[r.prenom[0]] || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {r.prenom[0]}
                </div>
                <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{r.prenom}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>{r.email}</span>
              </div>
            ))}
          </div>

          {/* Test email */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, display: 'block', marginBottom: 14 }}>ENVOYER UN TEST</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={testEmail}
                  onChange={e => { setTestEmail(e.target.value); setTestError(''); }}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${testError ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 10, padding: '10px 14px',
                    color: '#fff', fontSize: 14, outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
                {testError && (
                  <p className="error-msg">⚠️ {testError}</p>
                )}
              </div>
              <button
                onClick={handleTest}
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}
              >
                ⚡ Envoyer
              </button>
            </div>
          </div>

          {/* Send button */}
          <button
            onClick={handleSendAll}
            disabled={sending || sent}
            style={{
              width: '100%', padding: '18px',
              borderRadius: 14, border: 'none',
              cursor: sending || sent ? 'not-allowed' : 'pointer',
              fontSize: 16, fontWeight: 700,
              background: sent
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              boxShadow: sent
                ? '0 8px 30px rgba(16,185,129,0.4)'
                : '0 8px 30px rgba(99,102,241,0.4)',
              opacity: sending ? 0.7 : 1,
              transition: 'all 0.3s',
            }}
          >
            {sent ? '✓ Envoyé avec succès !'
              : sending ? 'Envoi en cours...'
              : `🚀 Envoyer à tous — ${recipients.length} destinataires`}
          </button>

        </div>
      </div>
    </>
  );
}