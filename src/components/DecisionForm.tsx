import React, { useState } from 'react';
import { Sparkles, Plus, X, Lightbulb, ArrowRight, Layers, Sliders } from 'lucide-react';
import { PRESET_DECISIONS, PresetTemplate } from '../data/presets';

interface DecisionFormProps {
  onAnalyze: (prompt: string, options: string[], context: string) => Promise<void>;
  onSelectPreset: (preset: PresetTemplate) => void;
  isLoading: boolean;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onAnalyze,
  onSelectPreset,
  isLoading,
}) => {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [context, setContext] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOptionField = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const removeOptionField = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    onAnalyze(prompt.trim(), cleanOptions, context.trim());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Welcome Header */}
      <div className="text-center mb-10 pb-6 border-b border-gray-300">
        <div className="inline-block bg-black text-white px-3 py-1 text-[10px] uppercase font-sans tracking-widest font-bold mb-4">
          Strategic Deliberation & Arbitrage
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#1C1C1C] tracking-tight leading-tight mb-4">
          Stuck between choices? <br className="hidden sm:inline" />
          <span className="italic font-normal font-serif">Let AI break the tie.</span>
        </h2>
        <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto italic font-serif leading-relaxed">
          Input your dilemma. Receive side-by-side comparison matrices, 
          S.W.O.T. analysis, interactive priority weights, and an authoritative verdict.
        </p>
      </div>

      {/* Preset Quick-Start Cards */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 border-b border-black pb-2">
          <span className="text-xs uppercase tracking-widest font-sans font-bold text-black flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-700" />
            Instant Case Study Presets
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRESET_DECISIONS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="text-left p-5 bg-white border border-black hover:bg-[#E8E4DB] transition-all duration-200 group flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              <div>
                <span className="inline-block px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-widest bg-black text-white mb-3">
                  {preset.category}
                </span>
                <h3 className="font-serif font-bold text-[#1C1C1C] text-base group-hover:underline">
                  {preset.title}
                </h3>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2 italic font-serif">
                  {preset.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200 flex items-center text-xs font-sans font-bold uppercase tracking-widest text-black">
                <span>View Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
        <h3 className="text-xs uppercase tracking-widest font-sans font-bold bg-black text-white px-2 py-1 inline-block mb-6">
          Formulate Deliberation
        </h3>

        {/* Main Prompt Area */}
        <div className="mb-6">
          <label htmlFor="prompt-input" className="block text-xs uppercase tracking-widest font-sans font-bold text-black mb-2">
            What decision are you trying to make? <span className="text-rose-700">*</span>
          </label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Should I accept a new remote job offer with a 20% higher salary or stay at my current stable company? Or should we transition our core app to serverless architecture?"
            rows={3}
            className="w-full bg-[#F9F7F2] text-[#1C1C1C] placeholder-gray-500 p-4 border border-black focus:bg-white outline-none transition text-sm sm:text-base font-serif italic leading-relaxed"
            required
          />
        </div>

        {/* Options Input (Optional / Custom) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs uppercase tracking-widest font-sans font-bold text-black flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-black" />
              Specific Options to Compare <span className="text-[10px] text-gray-500 font-normal normal-case">(Optional — AI auto-detects if left blank)</span>
            </label>
            {options.length < 5 && (
              <button
                type="button"
                onClick={addOptionField}
                className="text-xs font-sans font-bold uppercase tracking-widest text-black hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Option
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option, idx) => (
              <div key={idx} className="relative flex items-center">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1} (e.g. ${idx === 0 ? 'Accept Remote Offer' : 'Stay In Office Job'})`}
                  className="w-full bg-[#F9F7F2] text-[#1C1C1C] placeholder-gray-400 text-sm px-3.5 py-2.5 pr-8 border border-gray-400 focus:border-black outline-none transition font-sans font-medium"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOptionField(idx)}
                    className="absolute right-2.5 text-gray-500 hover:text-rose-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Priorities / Context Input */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-sans font-bold uppercase tracking-widest text-gray-800 hover:text-black underline flex items-center gap-1.5 mb-2"
          >
            <Sliders className="w-3.5 h-3.5" />
            {showAdvanced ? 'Hide Personal Constraints & Priorities' : '+ Add Strategic Priorities & Constraints (Budget, Work-Life, Risk Tolerance)'}
          </button>

          {showAdvanced && (
            <div className="bg-[#E8E4DB] p-4 border border-black">
              <label htmlFor="context-input" className="block text-xs uppercase tracking-widest font-sans font-bold text-black mb-1.5">
                What matters most to you? Any dealbreakers or timeline?
              </label>
              <input
                id="context-input"
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Work-life balance is my #1 priority, max budget $40k, planning horizon 3 years"
                className="w-full bg-white text-[#1C1C1C] placeholder-gray-500 text-sm px-3.5 py-2 border border-black outline-none font-serif italic"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end pt-4 border-t border-gray-300">
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="w-full sm:w-auto px-8 py-4 bg-black text-white hover:bg-gray-800 font-sans font-bold text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Executing Deliberation Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Execute Tie Breaker Verdict</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
