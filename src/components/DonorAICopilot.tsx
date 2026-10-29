import React, { useState } from 'react';
import { Bot, Send, Sparkles, ShieldCheck, Calculator, AlertCircle, HelpCircle } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
  badge?: string;
}

export const DonorAICopilot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello Chef! I am LoopAI, your Kitchen Food Safety & ESG Copilot. Ask me anything about HACCP temperature compliance, safe packaging, tax write-offs (80G / IRC §170), or dynamic shelf-life calculation.',
      time: 'Just now',
      badge: 'LoopAI v4.2'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQueries = [
    'How should I pack 100 hot meals for safe delivery?',
    'What tax deduction can I claim for 50 kg surplus food?',
    'What are the legal liability protections for donors?',
    'How do I safely hold leftover cooked rice?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    soundManager.playNotificationTone();
    const userMsg: Message = {
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('pack') || lower.includes('package') || lower.includes('hot meals')) {
        reply = 'For 100 hot meals, use commercial food-grade aluminum or compostable sugarcane bagasse containers. Ensure core food temperature is >= 65°C when sealing. Apply tamper-evident tape seals and pack inside insulated thermal cambro warmers. Couriers will log probe temperatures at your loading bay.';
      } else if (lower.includes('tax') || lower.includes('deduction') || lower.includes('write-off') || lower.includes('80g') || lower.includes('170')) {
        reply = 'Under US IRC §170(e)(3) and Indian Section 80G CSR provisions, you are entitled to enhanced tax deductions equal to the lesser of: (1) Cost of goods + 50% of fair market markup, or (2) Twice the production cost basis. FoodLoop generates verifiable tamper-proof digital receipts for your financial audit!';
      } else if (lower.includes('liability') || lower.includes('legal') || lower.includes('protection') || lower.includes('samaritan')) {
        reply = 'You are 100% legally shielded under the Bill Emerson Good Samaritan Food Donation Act (and FSSAI Safe Food Donation Directives). Donors who donate surplus food in good faith that meets hygiene standards at dispatch are immune from civil or criminal liability.';
      } else if (lower.includes('rice') || lower.includes('leftover') || lower.includes('bacillus')) {
        reply = 'Cooked rice is vulnerable to Bacillus cereus spores if left in the danger zone (10°C to 50°C). Always keep it held above 60°C in an insulated thermal vessel, or rapidly chill it to below 4°C within 90 minutes. FoodLoop automatically flags batches held longer than 3 hours.';
      } else {
        reply = `LoopAI Analysis for: "${text}"\n\n1. Food Safety: Ensure items remain outside the 4°C - 60°C danger zone.\n2. Dispatch Window: Best redistributed within 2.5 hours of service end.\n3. ESG Credit: Every kg logged diverts 2.5 kg CO₂e from landfills and earns verified CSR impact score.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          badge: 'Verified HACCP Guide'
        }
      ]);
      setIsTyping(false);
      soundManager.playSuccessChime();
    }, 900);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md shadow-slate-100 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">LoopAI Kitchen Copilot</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">HACCP Compliance, Storage & Tax Exemption Assistant</p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
        {suggestedQueries.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-xl px-3 py-1.5 whitespace-nowrap transition-all cursor-pointer shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {m.badge && (
              <span className="text-[10px] font-bold text-emerald-700 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                {m.badge}
              </span>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed font-medium whitespace-pre-line shadow-xs ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-2xl w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] ml-1 font-semibold text-slate-600">LoopAI is analyzing...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask LoopAI about safe storage, tax certificates, shelf-life..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
