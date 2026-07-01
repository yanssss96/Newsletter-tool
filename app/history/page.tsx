'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface HistoryEntry {
  id: string;
  type: 'created' | 'sent' | 'test';
  newsletterId: string;
  subject: string;
  details?: string;
  date: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'created' | 'sent' | 'test'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    fetch('/api/history').then(r => r.json()).then(data => {
      setHistory(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  const handleClearAll = async () => {
    await fetch('/api/history', { method: 'DELETE' });
    setHistory([]);
    setShowClearConfirm(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatFullDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) +
      ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const TYPE_CONFIG = {
    created: { icon: '📝', label: 'Créée', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
    sent: { icon: '🚀', label: 'Envoyée', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
    test: { icon: '✉️', label: 'Test', color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.25)' },
  };

  const filtered = filter === 'all' ? history : history.filter(e => e.type === filter);

  const groupByDate = (entries: HistoryEntry[]) => {
    const groups: Record<string, HistoryEntry[]> = {};
    entries.forEach(entry => {
      const d = new Date(entry.date);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const days = Math.floor(diff / 86400000);
      let label = '';
      if (days === 0) label = "Aujourd'hui";
      else if (days === 1) label = 'Hier';
      else if (days < 7) label = `Il y a ${days} jours`;
      else label = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      if (!groups[label]) groups[label] = [];
      groups[label].push(entry);
    });
    return groups;
  };

  const groups = groupByDate(filtered);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', sans-serif;
          background: radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.15) 0%, transparent 55%),
                      radial-gradient(ellipse at 80% 100%, rgba(139,92,246,0.1) 0%, transparent 50%),
                      #0a0a0f;
          min-height: 100vh;
          color: #fff;
        }

        .filter-btn {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.4);
          color: #818cf8;
        }
        .filter-btn:hover:not(.active) { background: rgba(255,255,255,0.08); color: #fff; }

        .history-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 10px;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .history-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--accent-color);
          border-radius: 4px 0 0 4px;
        }
        .history-card:hover {
          border-color: rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
        }

        .type-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
        }

        .delete-btn {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.15);
          color: rgba(248,113,113,0.5);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 13px;
          flex-shrink: 0;
          transition: all 0.2s;
          opacity: 0;
        }
        .history-card:hover .delete-btn { opacity: 1; }
        .delete-btn:hover { background: rgba(248,113,113,0.2); color: #f87171; }

        .action-link {
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          color: #818cf8;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .action-link:hover { background: rgba(99,102,241,0.2); }

        .group-label {
          font-size: 11px; font-weight: 700;
          color: rgba(255,255,255,0.25);
          letter-spacing: 1.2px;
          margin: 24px 0 12px;
          text-transform: uppercase;
          display: flex; align-items: center; gap: 10px;
        }
        .group-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .clear-btn {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          color: #f87171;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .clear-btn:hover { background: rgba(248,113,113,0.15); }

        .confirm-box {
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.25);
          border-radius: 12px;
          padding: 16px 18px;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
          animation: slideIn 0.2s ease;
        }
        @keyframes slideIn { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: rgba(255,255,255,0.3);
        }

        .stat-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 13px; font-weight: 600;
        }
      `}</style>

      <div style={{ minHeight: '100vh', padding: '48px 20px 60px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <button
                onClick={() => router.push('/')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                ← Tableau de bord
              </button>
              <h1 style={{ fontSize: 28, fontWeight: 800 }}>Historique</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 6 }}>
                Toutes les actions effectuées sur tes newsletters
              </p>
            </div>

            {history.length > 0 && (
              <button className="clear-btn" onClick={() => setShowClearConfirm(true)}>
                🗑 Tout effacer
              </button>
            )}
          </div>

          {/* Confirm clear */}
          {showClearConfirm && (
            <div className="confirm-box">
              <span style={{ fontSize: 14, color: '#fca5a5' }}>⚠️ Effacer tout l'historique ?</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleClearAll} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Oui, effacer</button>
                <button onClick={() => setShowClearConfirm(false)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Annuler</button>
              </div>
            </div>
          )}

          {/* Stats */}
          {history.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              <span className="stat-pill">
                <span style={{ color: '#818cf8' }}>📋</span>
                {history.length} action{history.length > 1 ? 's' : ''}
              </span>
              <span className="stat-pill">
                <span style={{ color: '#10b981' }}>🚀</span>
                {history.filter(e => e.type === 'sent').length} envoi{history.filter(e => e.type === 'sent').length > 1 ? 's' : ''}
              </span>
              <span className="stat-pill">
                <span style={{ color: '#f59e0b' }}>📝</span>
                {history.filter(e => e.type === 'created').length} créée{history.filter(e => e.type === 'created').length > 1 ? 's' : ''}
              </span>
              <span className="stat-pill">
                <span style={{ color: '#818cf8' }}>✉️</span>
                {history.filter(e => e.type === 'test').length} test{history.filter(e => e.type === 'test').length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {(['all', 'created', 'sent', 'test'] as const).map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? '🗂 Tout' : f === 'created' ? '📝 Créées' : f === 'sent' ? '🚀 Envois' : '✉️ Tests'}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
              Chargement...
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Aucune action</p>
              <p style={{ fontSize: 14 }}>
                {filter === 'all'
                  ? 'Aucune action enregistrée pour le moment.'
                  : `Aucune action de type "${filter === 'created' ? 'création' : filter === 'sent' ? 'envoi' : 'test'}" trouvée.`}
              </p>
            </div>
          ) : (
            Object.entries(groups).map(([groupLabel, entries]) => (
              <div key={groupLabel}>
                <div className="group-label">{groupLabel}</div>
                {entries.map(entry => {
                  const config = TYPE_CONFIG[entry.type];
                  return (
                    <div
                      key={entry.id}
                      className="history-card"
                      style={{ '--accent-color': config.color } as React.CSSProperties}
                    >
                      {/* Icon */}
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: config.bg, border: `1px solid ${config.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span className="type-badge" style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.color }}>
                            {config.label}
                          </span>
                          <span style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {entry.subject || '(Sans titre)'}
                          </span>
                        </div>
                        {entry.details && (
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                            {entry.details}
                          </p>
                        )}
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }} title={formatFullDate(entry.date)}>
                          🕐 {formatDate(entry.date)}
                        </p>
                      </div>

                      {/* Action */}
                      <button
                        className="action-link"
                        onClick={() => router.push(`/send/${entry.newsletterId}`)}
                      >
                        Voir →
                      </button>

                      {/* Delete */}
                      <div className="delete-btn" onClick={() => handleDelete(entry.id)}>
                        ✕
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}

        </div>
      </div>
    </>
  );
}