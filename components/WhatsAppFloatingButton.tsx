'use client';

import { useTranslations } from 'next-intl';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const tc = useTranslations('common');
  return (
    <a
      href={tc('whatsapp')}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-emerald-900/20 animate-pulse-soft hover:brightness-95"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
