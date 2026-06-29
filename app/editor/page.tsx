'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const EditorComponent = dynamic(() => import('@/components/Editor'), {
  ssr: false,
});

export default function EditorPage() {
  const router = useRouter();

  const handleSave = async (subject: string, html: string, design: object) => {
    const res = await fetch('/api/newsletters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, html, design }),
    });
    const data = await res.json();
    router.push(`/send/${data.id}`);
  };

  return <EditorComponent onSave={handleSave} />;
}