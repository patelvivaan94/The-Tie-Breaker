import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Lightbulb, ShieldAlert } from 'lucide-react';
import { OptionData } from '../types';

interface SwotViewProps {
  options: OptionData[];
}

export const SwotView: React.FC<SwotViewProps> = ({ options }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');

  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  if (!activeOption) return null;

  const { strengths, weaknesses, opportunities, threats } = activeOption.swot;

  return (
    <div className="space-y-6 font-sans">
      {/* Option Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-black pb-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOptionId(option.id)}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-sans font-bold transition-all border ${
              option.id === activeOption.id
                ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]'
                : 'bg-white text-black border-black hover:bg-[#E8E4DB]'
            }`}
          >
            <span>{option.name}</span>
          </button>
        ))}
      </div>

      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-2xl font-serif font-black text-[#1C1C1C]">
          SWOT Analysis: {activeOption.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 italic font-serif mt-1">
          Internal forces (Strengths & Weaknesses) and External vectors (Opportunities & Threats)
        </p>
      </div>

      {/* 4 Quadrants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STRENGTHS */}
        <div className="bg-white border-2 border-emerald-800 p-5 shadow-[4px_4px_0px_0px_rgba(4,120,87,0.2)] space-y-3">
          <div className="flex items-center space-x-2 text-emerald-900 border-b border-emerald-800 pb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
            <h4 className="font-sans font-bold text-xs tracking-widest uppercase text-emerald-900">Strengths (Internal +)</h4>
          </div>
          <ul className="space-y-2">
            {strengths.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-[#F9F7F2] p-2.5 border-l-2 border-emerald-800 border-y border-r border-gray-200">
                <span className="text-emerald-800 font-bold mt-0.5">•</span>
                <span className="text-sm font-serif italic text-gray-900 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES */}
        <div className="bg-white border-2 border-rose-800 p-5 shadow-[4px_4px_0px_0px_rgba(190,18,60,0.2)] space-y-3">
          <div className="flex items-center space-x-2 text-rose-900 border-b border-rose-800 pb-2">
            <AlertTriangle className="w-5 h-5 text-rose-800" />
            <h4 className="font-sans font-bold text-xs tracking-widest uppercase text-rose-900">Weaknesses (Internal -)</h4>
          </div>
          <ul className="space-y-2">
            {weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-[#F9F7F2] p-2.5 border-l-2 border-rose-800 border-y border-r border-gray-200">
                <span className="text-rose-800 font-bold mt-0.5">•</span>
                <span className="text-sm font-serif italic text-gray-900 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OPPORTUNITIES */}
        <div className="bg-white border-2 border-indigo-900 p-5 shadow-[4px_4px_0px_0px_rgba(49,46,129,0.2)] space-y-3">
          <div className="flex items-center space-x-2 text-indigo-900 border-b border-indigo-900 pb-2">
            <Lightbulb className="w-5 h-5 text-indigo-900" />
            <h4 className="font-sans font-bold text-xs tracking-widest uppercase text-indigo-900">Opportunities (External +)</h4>
          </div>
          <ul className="space-y-2">
            {opportunities.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-[#F9F7F2] p-2.5 border-l-2 border-indigo-900 border-y border-r border-gray-200">
                <span className="text-indigo-900 font-bold mt-0.5">•</span>
                <span className="text-sm font-serif italic text-gray-900 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* THREATS */}
        <div className="bg-white border-2 border-amber-800 p-5 shadow-[4px_4px_0px_0px_rgba(180,83,9,0.2)] space-y-3">
          <div className="flex items-center space-x-2 text-amber-900 border-b border-amber-800 pb-2">
            <ShieldAlert className="w-5 h-5 text-amber-800" />
            <h4 className="font-sans font-bold text-xs tracking-widest uppercase text-amber-900">Threats (External -)</h4>
          </div>
          <ul className="space-y-2">
            {threats.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-[#F9F7F2] p-2.5 border-l-2 border-amber-800 border-y border-r border-gray-200">
                <span className="text-amber-800 font-bold mt-0.5">•</span>
                <span className="text-sm font-serif italic text-gray-900 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
