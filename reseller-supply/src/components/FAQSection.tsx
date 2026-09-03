import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronDown, HelpCircle, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FAQSection: React.FC = () => {
  const { faqs } = useStore();
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq-section" className="py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-neutral-900">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-950/80 text-red-500 border border-red-800/60 font-mono-code mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          KNOWLEDGE BASE & PROTOCOLS
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase font-display">
          FREQUENTLY ASKED <span className="text-red-600">QUESTIONS</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2">
          Clear, transparent details regarding order processing, shipping timeframes, and 1:1 master product specifications.
        </p>

        {/* FAQ Search */}
        <div className="mt-6 relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (shipping, MOQ, quality)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              id={item.id}
              className="rounded-2xl bg-neutral-950 border border-neutral-800/80 overflow-hidden transition-colors hover:border-neutral-700"
            >
              <button
                onClick={() => toggleFaq(item.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base group"
              >
                <span className="group-hover:text-red-400 transition-colors">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 group-hover:text-red-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-red-500' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 border-t border-neutral-900/80 leading-relaxed font-sans">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
