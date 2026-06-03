'use client';

import { useRef, useState } from 'react';
import EmailEditor, { EditorRef } from 'react-email-editor';

interface EditorComponentProps {
  onSave: (subject: string, html: string, design: object) => void;
  initialDesign?: object;
}

const NAKAMA_TEMPLATE = {
  counters: { u_row: 6, u_column: 8, u_content_text: 6, u_content_image: 3, u_content_button: 2, u_content_divider: 2 },
  body: {
    rows: [
      {
        id: 'header-row',
        cells: [1],
        columns: [{
          id: 'header-col',
          contents: [{
            id: 'logo-text',
            type: 'text',
            values: {
              text: '<p style="text-align:center;margin:0"><span style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px">Nakama <span style="color:#a5b4fc">Mail</span></span></p><p style="text-align:center;margin:6px 0 0"><span style="font-size:13px;color:rgba(255,255,255,0.6);font-weight:400">La newsletter interne de l\'équipe</span></p>',
              containerPadding: '32px 40px',
              _meta: { htmlID: 'u_content_text_1' }
            }
          }],
          values: { backgroundColor: '', padding: '0px', border: {} }
        }],
        values: {
          backgroundColor: '#6366f1',
          padding: '0px',
          _meta: { htmlID: 'u_row_1' }
        }
      },
      {
        id: 'hero-row',
        cells: [1],
        columns: [{
          id: 'hero-col',
          contents: [
            {
              id: 'hero-img',
              type: 'image',
              values: {
                src: { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', width: 800, height: 400 },
                textAlign: 'center',
                altText: 'Nakama team',
                action: { name: 'web', values: { href: '', target: '_blank' } },
                containerPadding: '0px',
                _meta: { htmlID: 'u_content_image_1' }
              }
            },
            {
              id: 'hero-text',
              type: 'text',
              values: {
                text: '<p style="margin:0 0 12px"><span style="font-size:26px;font-weight:700;color:#1e1b4b;letter-spacing:-0.5px;line-height:1.3">🚀 Bienvenue dans cette édition !</span></p><p style="margin:0;font-size:15px;color:#6b7280;line-height:1.7">Voici les dernières nouvelles de l\'équipe Nakama. Cette semaine, on vous partage nos avancées, découvertes et moments forts.</p>',
                containerPadding: '32px 40px 24px',
                _meta: { htmlID: 'u_content_text_2' }
              }
            }
          ],
          values: { backgroundColor: '', padding: '0px', border: {} }
        }],
        values: { backgroundColor: '#ffffff', padding: '0px', _meta: { htmlID: 'u_row_2' } }
      },
      {
        id: 'cards-row',
        cells: [1, 1],
        columns: [
          {
            id: 'card-col-1',
            contents: [{
              id: 'card-text-1',
              type: 'text',
              values: {
                text: '<p style="margin:0 0 8px"><span style="font-size:20px">🎯</span></p><p style="margin:0 0 8px"><span style="font-size:16px;font-weight:700;color:#1e1b4b">Objectif de la semaine</span></p><p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6">Décrivez ici l\'objectif principal de la semaine.</p>',
                containerPadding: '24px',
                _meta: { htmlID: 'u_content_text_3' }
              }
            }],
            values: { backgroundColor: '#f5f3ff', padding: '0px', border: {} }
          },
          {
            id: 'card-col-2',
            contents: [{
              id: 'card-text-2',
              type: 'text',
              values: {
                text: '<p style="margin:0 0 8px"><span style="font-size:20px">💡</span></p><p style="margin:0 0 8px"><span style="font-size:16px;font-weight:700;color:#1e1b4b">Bonne pratique</span></p><p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6">Partagez une astuce ou découverte utile.</p>',
                containerPadding: '24px',
                _meta: { htmlID: 'u_content_text_4' }
              }
            }],
            values: { backgroundColor: '#eff6ff', padding: '0px', border: {} }
          }
        ],
        values: { backgroundColor: '#ffffff', padding: '0px', _meta: { htmlID: 'u_row_4' } }
      },
      {
        id: 'cta-row',
        cells: [1],
        columns: [{
          id: 'cta-col',
          contents: [
            {
              id: 'cta-text',
              type: 'text',
              values: {
                text: '<p style="text-align:center;margin:0 0 20px"><span style="font-size:22px;font-weight:700;color:#ffffff">Tu as quelque chose à partager ?</span></p><p style="text-align:center;margin:0;font-size:14px;color:rgba(255,255,255,0.75);line-height:1.6">N\'hésite pas à contribuer à la prochaine édition.</p>',
                containerPadding: '40px 40px 24px',
                _meta: { htmlID: 'u_content_text_5' }
              }
            },
            {
              id: 'cta-btn',
              type: 'button',
              values: {
                text: '✉️ Contribuer à la newsletter',
                href: { name: 'web', values: { href: 'mailto:team@nakama.tech', target: '_blank' } },
                buttonColors: { color: '#6366f1', backgroundColor: '#ffffff', hoverColor: '#ffffff', hoverBackgroundColor: '#a5b4fc' },
                size: { autoWidth: true },
                textAlign: 'center',
                padding: '14px 32px',
                border: {},
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                containerPadding: '0px 40px 40px',
                _meta: { htmlID: 'u_content_button_1' }
              }
            }
          ],
          values: { backgroundColor: '', padding: '0px', border: {} }
        }],
        values: { backgroundColor: '#6366f1', padding: '0px', _meta: { htmlID: 'u_row_5' } }
      },
      {
        id: 'footer-row',
        cells: [1],
        columns: [{
          id: 'footer-col',
          contents: [{
            id: 'footer-text',
            type: 'text',
            values: {
              text: '<p style="text-align:center;margin:0 0 4px"><span style="font-size:12px;color:#9ca3af">Newsletter interne Nakama · Tous droits réservés</span></p><p style="text-align:center;margin:0"><span style="font-size:12px;color:#9ca3af">Pour se désabonner : </span><a href="mailto:team@nakama.tech" style="color:#6366f1;font-size:12px">team@nakama.tech</a></p>',
              containerPadding: '24px 40px',
              _meta: { htmlID: 'u_content_text_6' }
            }
          }],
          values: { backgroundColor: '', padding: '0px', border: {} }
        }],
        values: { backgroundColor: '#f9fafb', padding: '0px', _meta: { htmlID: 'u_row_6' } }
      }
    ],
    values: {
      backgroundColor: '#f3f4f6',
      contentWidth: '600px',
      fontFamily: { label: 'Inter', value: 'Inter,sans-serif' },
      _meta: { htmlID: 'u_body' }
    }
  }
};

export default function EditorComponent({ onSave, initialDesign }: EditorComponentProps) {
  const emailEditorRef = useRef<EditorRef>(null);
  const [subject, setSubject] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    emailEditorRef.current?.editor?.exportHtml((data) => {
      const { design, html } = data;
      onSave(subject, html, design);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const onReady = () => {
    const design = initialDesign || NAKAMA_TEMPLATE;
    emailEditorRef.current?.editor?.loadDesign(design as any);
  };

  const TOPBAR_HEIGHT = 60;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }

        .topbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; gap: 12px;
          padding: 0 20px; height: ${TOPBAR_HEIGHT}px;
          background: linear-gradient(90deg, #0f0f13 0%, #13111f 100%);
          border-bottom: 1px solid rgba(99,102,241,0.15);
          box-shadow: 0 1px 0 rgba(99,102,241,0.1), 0 4px 20px rgba(0,0,0,0.4);
          font-family: 'Inter', sans-serif;
        }

        .logo { display: flex; align-items: center; gap: 10px; margin-right: 20px; }
        .logo-icon {
          width: 30px; height: 30px; border-radius: 9px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          box-shadow: 0 0 12px rgba(99,102,241,0.5);
        }
        .logo-name { color: #fff; font-weight: 700; font-size: 15px; letter-spacing: -0.4px; }
        .logo-name span { color: #818cf8; }

        .logo-divider {
          width: 1px; height: 20px;
          background: rgba(255,255,255,0.08);
          margin-right: 4px;
        }

        .subject-wrap { flex: 1; position: relative; }
        .subject-prefix {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          font-size: 12px; color: rgba(255,255,255,0.25); pointer-events: none;
          font-weight: 500;
        }
        .subject-input {
          width: 100%; height: 38px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #fff; font-size: 13px;
          padding: 0 14px 0 68px;
          outline: none; transition: all 0.2s;
          box-sizing: border-box; font-family: 'Inter', sans-serif;
        }
        .subject-input::placeholder { color: rgba(255,255,255,0.2); }
        .subject-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .save-btn {
          height: 38px; padding: 0 20px;
          border: none; border-radius: 10px;
          color: #fff; font-size: 13px; font-weight: 600;
          transition: all 0.3s ease; white-space: nowrap;
          display: flex; align-items: center; gap: 7px;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.1px;
        }
        .save-btn:not(:disabled) { cursor: pointer; }
        .save-btn:not(:disabled):hover { transform: translateY(-1px); filter: brightness(1.1); }
        .save-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .editor-wrapper {
          position: fixed;
          top: ${TOPBAR_HEIGHT}px;
          left: 0; right: 0; bottom: 0;
        }
      `}</style>

      <div className="topbar">
        <div className="logo">
          <div className="logo-icon">✉️</div>
          <span className="logo-name">Nakama <span>Mail</span></span>
        </div>

        <div className="logo-divider" />

        <div className="subject-wrap">
          <span className="subject-prefix">Sujet —</span>
          <input
            className="subject-input"
            type="text"
            placeholder="Titre de votre newsletter..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <button
          className="save-btn"
          onClick={handleSave}
          disabled={saving || !subject}
          style={{
            background: saved
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: saved
              ? '0 4px 15px rgba(16,185,129,0.3)'
              : '0 4px 15px rgba(99,102,241,0.3)',
          }}
        >
          {saving ? (
            <><span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⟳</span> Sauvegarde...</>
          ) : saved ? <>✓ Sauvegardé !</> : <>💾 Sauvegarder</>}
        </button>
      </div>

      <div className="editor-wrapper">
        <EmailEditor
          ref={emailEditorRef}
          onReady={onReady}
          minHeight="100%"
          style={{ height: '100%', width: '100%' }}
          options={{
            locale: 'fr-FR',
            features: { imageEditor: true },
            appearance: {
              theme: 'dark',
              panels: { tools: { dock: 'left' } },
            },
          }}
        />
      </div>
    </>
  );
}