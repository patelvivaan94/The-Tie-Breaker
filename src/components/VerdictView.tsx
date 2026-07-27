import React, { useState } from 'react';
import { Award, ShieldAlert, HelpCircle, CheckSquare, Square, CornerDownRight } from 'lucide-react';
import { DecisionVerdict, OptionData } from '../types';

interface VerdictViewProps {
  verdict: DecisionVerdict;
  options: OptionData[];
}

export const VerdictView: React.FC<VerdictViewProps> = ({ verdict, options }) => {
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});

  const toggleQuestion = (index: number) => {
    setCheckedQuestions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const winnerOption = options.find((o) => o.id === verdict.winnerOptionId) || options[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans">
      {/* Executive Winner Hero Box */}
      <div className="bg-[#E8E4DB] border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-2 border-black pb-6">
          <div className="space-y-2">
            <div className="inline-block bg-black text-white px-3 py-1 text-[10px] uppercase font-sans tracking-widest font-bold">
              The Tie-Breaker Verdict
            </div>
            <h3 className="text-3xl sm:text-5xl font-serif font-black uppercase tracking-tight text-[#1C1C1C]">
              {verdict.winnerName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 italic font-serif">{winnerOption?.tagline}</p>
          </div>

          {/* Confidence Badge */}
          <div className="bg-white border-2 border-black p-4 text-center shrink-0 min-w-[150px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500 block">
              Strategic Alignment
            </span>
            <div className="text-5xl font-sans font-black text-black my-1">
              {verdict.confidencePercentage}<span className="text-2xl">%</span>
            </div>
            <span className="text-[10px] uppercase font-sans tracking-widest font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5">
              Strong Advantage
            </span>
          </div>
        </div>

        {/* Headline & Detailed Rationale */}
        <div className="mt-6 space-y-4">
          <h4 className="text-xl sm:text-2xl font-serif italic text-black leading-snug">
            "{verdict.headline}"
          </h4>
          <div className="bg-white border border-black p-6 font-serif text-base text-[#1C1C1C] leading-relaxed shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p>{verdict.detailedRecommendation}</p>
          </div>
        </div>
      </div>

      {/* When to Choose the Runner-Up / Contingencies */}
      {verdict.whenToChooseOthers && verdict.whenToChooseOthers.length > 0 && (
        <div className="bg-white border-2 border-black p-6 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h4 className="text-xs uppercase tracking-widest font-sans font-bold text-black flex items-center gap-2 border-b border-black pb-2">
            <CornerDownRight className="w-4 h-4 text-black" />
            <span>Strategic Arbitrage: Contingencies to Pivot Choice</span>
          </h4>
          <div className="space-y-3">
            {verdict.whenToChooseOthers.map((item, idx) => {
              const altOpt = options.find((o) => o.id === item.optionId);

              return (
                <div
                  key={idx}
                  className="bg-[#F9F7F2] p-4 border border-black space-y-1"
                >
                  <span className="font-sans font-bold uppercase text-xs tracking-wider text-black bg-[#E8E4DB] px-2 py-0.5 inline-block mb-1">
                    Pivot to {altOpt?.name || 'Alternative'}:
                  </span>
                  <p className="text-sm text-gray-800 font-serif italic leading-relaxed">{item.condition}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Critical Blind Spots */}
      <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="flex items-center space-x-2 text-rose-800 border-b border-black pb-3">
          <ShieldAlert className="w-5 h-5 text-rose-800" />
          <h4 className="font-sans font-bold text-xs tracking-widest uppercase text-black">
            Critical Blind Spots & Risk Factors
          </h4>
        </div>
        <ul className="space-y-3">
          {verdict.blindSpots.map((spot, idx) => (
            <li key={idx} className="flex items-start space-x-3 bg-[#F9F7F2] p-3.5 border-l-4 border-rose-800 border-y border-r border-gray-300">
              <span className="text-rose-800 font-bold text-base leading-none">•</span>
              <span className="text-sm font-serif italic text-gray-900 leading-snug">{spot}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3 Diagnostic Questions Self-Quiz */}
      <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="flex items-center justify-between border-b border-black pb-3">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-black" />
            <h4 className="font-sans font-bold text-black text-xs uppercase tracking-widest">
              Self-Diagnostic Reflection Matrix
            </h4>
          </div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">
            Audit Checklist
          </span>
        </div>

        <div className="space-y-3">
          {verdict.diagnosticQuestions.map((question, idx) => {
            const isChecked = !!checkedQuestions[idx];

            return (
              <button
                key={idx}
                onClick={() => toggleQuestion(idx)}
                className={`w-full text-left p-4 border transition-all flex items-start space-x-3 ${
                  isChecked
                    ? 'bg-[#E8E4DB] border-black text-black'
                    : 'bg-[#F9F7F2] border-gray-400 text-gray-800 hover:border-black'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-black">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-black" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-gray-500 block">
                    Diagnostic № {idx + 1}
                  </span>
                  <p className="text-sm font-serif italic font-medium leading-relaxed">{question}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
