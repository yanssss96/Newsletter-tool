'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Newsletter { id: string; subject: string; html: string; }

export default function PreviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);

  useEffect(() => {
    fetch('/api/newsletters').then(r => r.json()).then((list: Newsletter[]) => {
      setNewsletter(list.find(n => n.id === id) || null);
    });
  }, [id]);

  if (!newsletter) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', fontFamily: 'Inter, sans-serif' }}>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 52, background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✉️</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Nakama <span style={{ color: '#818cf8' }}>Mail</span></span>
        </div>
        <button onClick={() => router.push(`/send/${id}`)} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          🚀 Envoyer
        </button>
      </div>

      {/* Preview */}
      <div style={{ padding: '40px 20px' }}>
        <iframe
          srcDoc={newsletter.html}
          style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: 680, height: '80vh', border: 'none', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
          title="Aperçu newsletter"
        />
      </div>
    </div>
  );
}