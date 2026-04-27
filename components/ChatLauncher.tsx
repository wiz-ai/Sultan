'use client';

import { useEffect, useRef, useState } from 'react';
import { Globe, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS_EN = [
  "What's good for a Palestinian breakfast?",
  'Build me a shish taouk cart',
  'Do you have single-origin olive oil?',
  'When do you deliver to North Tampa?',
];

const SUGGESTIONS_AR = [
  'شو عندكم حلويات؟',
  'بدي أعمل تبولة، شو بحتاج؟',
  'في قهوة سعودية؟',
  'متى التوصيل لشمال تامبا؟',
];

export function ChatLauncher() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (user?.role === 'driver') return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-sultan-emerald-700 to-sultan-emerald-900 text-sultan-cream shadow-glow flex items-center justify-center hover:scale-105 transition"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-sultan-gold-400 text-sultan-ink text-[10px] font-bold rounded-full px-1.5 py-0.5">
          AI
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-md h-[72vh] max-h-[640px] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-sultan-sand"
          >
            <ChatAssistantPanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ChatAssistantPanel({
  className,
  featured = false,
  onClose,
}: {
  className?: string;
  featured?: boolean;
  onClose?: () => void;
}) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content:
        "Marhaba! I'm Sultan's shop assistant. Ask me in English or Arabic. I'll help you find products, build a recipe cart, or plan your delivery.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const nextUser: Msg = { role: 'user', content: text.trim() };
    const nextMessages = [...messages, nextUser];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, lang }),
      });
      const data = await res.json();
      setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content:
            'Sorry, something went wrong reaching the AI. Make sure OPENAI_API_KEY is set in your environment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = lang === 'ar' ? SUGGESTIONS_AR : SUGGESTIONS_EN;

  return (
    <div
      className={cn(
        'bg-sultan-cream overflow-hidden flex flex-col',
        featured
          ? 'min-h-[540px] rounded-[2rem] shadow-2xl ring-1 ring-sultan-gold-300/60'
          : 'h-full',
        className
      )}
    >
      <div className={cn('p-4 bg-gradient-to-br from-sultan-emerald-800 to-sultan-emerald-950 text-sultan-cream', featured && 'p-5')}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-sultan-gold-400/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-sultan-gold-300" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold">Sultan Assistant</div>
              <div className="text-xs opacity-70">Shop by chat in English or Arabic</div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 rounded-full px-2.5 py-1 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'EN' : 'عربي'}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {featured && (
          <div className="mt-5">
            <div className="heading-display text-3xl leading-tight">Tell us what you want to cook.</div>
            <p className="mt-2 text-sm text-sultan-cream/70">
              The assistant can suggest products, build recipe ideas, and answer delivery questions before you browse the aisles.
            </p>
          </div>
        )}
      </div>

      <div ref={scrollRef} className={cn('flex-1 overflow-y-auto p-4 space-y-3 bg-parchment', featured && 'min-h-[260px]')}>
        {messages.map((m, i) => (
          <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
                m.role === 'user'
                  ? 'bg-sultan-emerald-900 text-sultan-cream rounded-br-sm'
                  : 'bg-white text-sultan-ink rounded-bl-sm ring-1 ring-sultan-sand/70',
                /[\u0600-\u06FF]/.test(m.content) && 'arabic text-right'
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 ring-1 ring-sultan-sand/70 flex gap-1">
              <span className="w-2 h-2 rounded-full bg-sultan-emerald-700 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-sultan-emerald-700 animate-pulse [animation-delay:0.15s]" />
              <span className="w-2 h-2 rounded-full bg-sultan-emerald-700 animate-pulse [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 bg-parchment">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full bg-white ring-1 ring-sultan-sand hover:bg-sultan-emerald-50 text-sultan-ink/80 transition',
                /[\u0600-\u06FF]/.test(s) && 'arabic'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-3 border-t border-sultan-sand bg-white flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === 'ar' ? 'اكتب رسالة...' : 'Ask Sultan anything...'}
          className={cn(
            'flex-1 min-w-0 bg-sultan-cream/50 rounded-full px-4 py-2.5 text-sm outline-none ring-1 ring-sultan-sand/80 focus:ring-sultan-emerald-600 transition',
            lang === 'ar' && 'arabic text-right'
          )}
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary !p-2.5 !rounded-full disabled:opacity-40">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
