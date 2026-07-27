import React, { useState } from 'react';
import { Table, Info } from 'lucide-react';
import { ComparisonCriterion, OptionData } from '../types';

interface ComparisonTableViewProps {
  criteria: ComparisonCriterion[];
  options: OptionData[];
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({ criteria, options }) => {
  const [activeReasoning, setActiveReasoning] = useState<{ criterionKey: string; optionId: string } | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-100 text-emerald-900 border-emerald-800';
    if (score >= 6) return 'bg-amber-100 text-amber-900 border-amber-800';
    return 'bg-rose-100 text-rose-900 border-rose-800';
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-serif font-black text-[#1C1C1C] flex items-center gap-2">
            <Table className="w-5 h-5 text-black" />
            Side-by-Side Criteria Matrix
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 italic font-serif mt-0.5">
            Direct comparison across key strategic parameters rated on a 1–10 objective scale.
          </p>
        </div>
        <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-black flex items-center space-x-3 bg-[#E8E4DB] px-3 py-2 border border-black shrink-0">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-emerald-800 border border-black inline-block" /> 8–10 High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-amber-600 border border-black inline-block" /> 6–7 Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-rose-800 border border-black inline-block" /> 1–5 Low
          </span>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-black text-white text-xs uppercase font-sans tracking-widest border-b-2 border-black">
              <th className="py-4 px-5 font-bold w-1/3">Evaluation Criterion</th>
              {options.map((opt) => (
                <th key={opt.id} className="py-4 px-5 font-bold text-center border-l border-gray-800">
                  <div className="text-sm font-sans font-black text-white uppercase">{opt.name}</div>
                  <div className="text-[10px] text-gray-300 font-serif italic normal-case truncate max-w-[150px] mx-auto mt-0.5">
                    {opt.tagline}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black text-xs sm:text-sm text-[#1C1C1C]">
            {criteria.map((criterion) => (
              <tr key={criterion.key} className="hover:bg-[#F9F7F2] transition-colors">
                <td className="py-4 px-5 align-top border-r border-gray-300">
                  <div className="font-serif font-bold text-[#1C1C1C] text-base">{criterion.name}</div>
                  <div className="text-xs text-gray-600 font-serif italic mt-0.5 leading-snug">
                    {criterion.description}
                  </div>
                </td>

                {options.map((opt) => {
                  const scoreObj = criterion.scores.find((s) => s.optionId === opt.id);
                  const score = scoreObj?.score || 5;
                  const isReasoningActive =
                    activeReasoning?.criterionKey === criterion.key &&
                    activeReasoning?.optionId === opt.id;

                  return (
                    <td key={opt.id} className="py-4 px-5 text-center align-top border-r border-gray-200">
                      <div className="flex flex-col items-center justify-center space-y-1.5">
                        <button
                          onClick={() =>
                            setActiveReasoning(
                              isReasoningActive
                                ? null
                                : { criterionKey: criterion.key, optionId: opt.id }
                            )
                          }
                          className={`px-3 py-1.5 border-2 font-sans font-black text-sm sm:text-base flex items-center space-x-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105 ${getScoreColor(
                            score
                          )}`}
                          title="Click to view AI reasoning"
                        >
                          <span>{score}/10</span>
                          <Info className="w-3.5 h-3.5 opacity-80" />
                        </button>

                        {/* Reasoning Popup / Inline Accordion */}
                        {isReasoningActive && (
                          <div className="mt-2 p-3 bg-white text-[#1C1C1C] border-2 border-black text-xs text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-xs animate-in fade-in duration-150">
                            <div className="font-sans font-bold uppercase text-[10px] tracking-widest text-black mb-1 flex items-center justify-between border-b border-black pb-1">
                              <span>Strategic Rationale</span>
                              <span className="text-gray-500">Score: {score}/10</span>
                            </div>
                            <p className="leading-relaxed font-serif italic text-gray-800 text-xs">
                              {scoreObj?.reasoning || 'No detailed reasoning provided.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Average Summary Row */}
            <tr className="bg-[#E8E4DB] font-bold border-t-2 border-black text-[#1C1C1C]">
              <td className="py-4 px-5 text-xs font-sans font-bold uppercase tracking-widest text-black border-r border-black">
                Average Matrix Rating
              </td>
              {options.map((opt) => {
                const optScores = criteria
                  .map((c) => c.scores.find((s) => s.optionId === opt.id)?.score || 0)
                  .filter((s) => s > 0);
                const avg = optScores.length
                  ? (optScores.reduce((a, b) => a + b, 0) / optScores.length).toFixed(1)
                  : 'N/A';

                return (
                  <td key={opt.id} className="py-4 px-5 text-center border-r border-black">
                    <span className="text-xl sm:text-2xl font-sans font-black text-black">
                      {avg} <span className="text-xs text-gray-600 font-sans font-normal">/ 10</span>
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
