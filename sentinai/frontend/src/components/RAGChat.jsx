import React, { useState } from 'react';
import { BookOpen, Send, Sparkles, FileCheck } from 'lucide-react';
import { queryRAG } from '../services/api';

export default function RAGChat({ telemetry }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'SentinAI Regulatory Compliance Assistant. Search statutory rules from OISD-STD-105, Factories Act 1948, or DGMS guidelines.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await queryRAG(userText, telemetry);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.answer,
          citations: res.citations
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error querying regulatory knowledge base.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Regulatory RAG Compliance Agent
          </h2>
          <p className="text-xs text-slate-400">OISD • Factories Act 1948 • DGMS Corpus</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded p-3 overflow-y-auto space-y-3 min-h-[200px] max-h-[280px]">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] rounded p-3 text-xs leading-relaxed ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-200 border border-slate-800'}`}>
              <div className="whitespace-pre-wrap">{m.text}</div>

              {m.citations && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-col gap-1 text-[11px] font-mono text-slate-300">
                  <span className="font-semibold flex items-center gap-1"><FileCheck className="w-3 h-3 text-blue-400" /> Statutory References:</span>
                  {m.citations.map((c) => (
                    <div key={c.id} className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      [{c.standard} {c.section}] {c.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-xs font-mono text-blue-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" /> Querying compliance index...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 'Is hot work permitted near gas lines during shift handoff?'"
          className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" /> Search
        </button>
      </form>
    </div>
  );
}
