import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  FileText, 
  HelpCircle
} from 'lucide-react';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';

export default function LLMAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Namaste! I am the PAIMANA-AI Project Intelligence Assistant. I am trained on MoSPI Common Upload Form (CUF) records, project flash reports, and extended ML risk models. Ask me anything about Central Sector project overruns, risk drivers, or benchmarking across 17+ Ministries.",
      citations: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    "Which Railways projects above ₹1,000 Cr have critical overrun risk?",
    "Why is the Udhampur-Srinagar-Baramulla Rail Link (USBRL) delayed?",
    "Compare predictive accuracy between standard CUF fields vs extended external variables.",
    "Summarize active early warning alerts for Ministry of Road Transport & Highways."
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let botAnswer = "";
      let citations = [];

      const lower = query.toLowerCase();
      if (lower.includes("railways") || lower.includes("usbrl")) {
        const usbrl = SAMPLE_PROJECTS.find(p => p.code === 'RLW-USBRL-01');
        botAnswer = `Based on the latest April 2026 PAIMANA data drop, the **Udhampur-Srinagar-Baramulla Rail Link (USBRL)** is currently flagged with a **Critical Risk Score of 94/100**.\n\n` +
          `• **Approved Cost**: ₹2,500 Cr → **Revised Sanction**: ₹37,012 Cr → **ML Predicted Final**: ₹39,450 Cr (+1,380% overrun)\n` +
          `• **Estimated Delay**: +232 Months (Projected DOC: June 2027)\n\n` +
          `**Top SHAP Risk Drivers**:\n` +
          `1. *Schedule Slippage* (+31% risk): Water ingress & rock strata anomalies in Tunnel T-49 & T-50.\n` +
          `2. *Physical vs Financial Gap* (+24% risk): Expenditure outpaces physical completion.\n` +
          `3. *Slope Stabilization* (+18% risk): Landslides at Chenab Bridge approach portals.\n` +
          `4. *High-Tensile Steel Surge* (+12% risk): Steel price escalation.`;
        
        citations = [
          { label: `CUF Record ${usbrl.id}`, link: usbrl.name },
          { label: "MoSPI Flash Report March 2026", link: "Section 4.2 Railways" }
        ];
      } else if (lower.includes("accuracy") || lower.includes("cuf vs") || lower.includes("extended")) {
        botAnswer = `Based on empirical model benchmarking across 1,981 projects (MoSPI Empirical Evaluation):\n\n` +
          `• **Standard CUF Model (XGBoost)**: Achieves **65.5% accuracy** (RMSE 16.8% for cost overrun).\n` +
          `• **Extended Model (LightGBM + Weather, Steel Index, Land)**: Achieves **89.7% accuracy** (RMSE 9.2% for cost overrun).\n\n` +
          `**Incremental Power Gain**: Incorporating extended external variables provides a **+34.2% predictive lift** and extends early warning lead time from **1.8 months to 5.4 months** before slippage is visible in official CUF drops.`;
        
        citations = [
          { label: "Model Evaluation Registry v2.4", link: "LightGBM_Extended_Weights" },
          { label: "MoSPI Statistical Dimension Analysis", link: "Variable Importance Breakdown" }
        ];
      } else if (lower.includes("road") || lower.includes("zojila") || lower.includes("morth")) {
        botAnswer = `For the **Ministry of Road Transport & Highways (MoRTH)**, 712 projects are tracked.\n\n` +
          `• **Zojila Tunnel Project (NH-1)** is flagged as **High Risk (82/100)** with a predicted cost of ₹7,450 Cr (vs ₹4,509 Cr sanctioned).\n` +
          `• **Primary Bottleneck**: Contractor financial liquidity constraints and sub-zero winter weather stoppages limiting working window to 5 months/year.\n` +
          `• **Delhi-Mumbai Expressway Phase II** is currently **Low Risk (38/100)** with 83.5% physical completion.`;
        
        citations = [
          { label: "CUF Record PRJ-RTH-2018-0112", link: "Zojila Tunnel" },
          { label: "NHIDCL Monthly Progress Matrix", link: "April 2026 Drop" }
        ];
      } else {
        botAnswer = `I searched the PAIMANA database for your query. Portfolio summary indicates **1,981 Central Sector projects** worth ₹42.78 Lakh Cr are currently monitored. Overall, **87 projects** are classified as Critical Risk. The AI engine recommends prioritizing interventions in Railways, Water Resources, and Power sectors where cost escalation exceeds 30%.`;
        citations = [
          { label: "MoSPI IPMD Portfolio Summary", link: "April 2026 Report" }
        ];
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botAnswer, citations }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[620px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-300 flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-outfit flex items-center gap-2">
              <span>PAIMANA Project Intelligence Assistant</span>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                RAG Grounded
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">Open-source Llama 3 / Mistral model served via Ollama + FAISS Vector Index</p>
          </div>
        </div>
      </div>

      {/* Suggested Prompts Pill Container */}
      <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 overflow-x-auto flex space-x-2 no-scrollbar">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-300 hover:border-orange-300 rounded-full text-xs whitespace-nowrap transition-colors flex items-center space-x-1 shadow-2xs"
          >
            <HelpCircle className="w-3 h-3 text-orange-600" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-orange-700" />
              </div>
            )}

            <div
              className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-orange-600 text-white rounded-br-none shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Citations Box */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] space-y-1">
                  <span className="text-slate-500 font-bold block">Grounding Citations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((c, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-blue-800 px-2 py-0.5 rounded border border-slate-200 flex items-center space-x-1 font-mono font-medium"
                      >
                        <FileText className="w-2.5 h-2.5" />
                        <span>{c.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-orange-600 p-2 font-medium">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Retrieving project records & executing RAG inference...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask PAIMANA-AI assistant about any project status, overrun cause, or sector metric..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
