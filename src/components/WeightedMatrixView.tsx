import React, { useState } from 'react';
import { Sliders, Trophy, RefreshCw } from 'lucide-react';
import { ComparisonCriterion, OptionData } from '../types';

interface WeightedMatrixViewProps {
  criteria: ComparisonCriterion[];
  options: OptionData[];
  onWeightsChange?: (weights: Record<string, number>) => void;
  initialWeights?: Record<string, number>;
}

export const WeightedMatrixView: React.FC<WeightedMatrixViewProps> = ({
  criteria,
  options,
  onWeightsChange,
  initialWeights,
}) => {
  // Initialize weights state from initialWeights or criteria defaultWeight
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    if (initialWeights) return initialWeights;
    const initial: Record<string, number> = {};
    criteria.forEach((c) => {
      initial[c.key] = c.defaultWeight || 3;
    });
    return initial;
  });

  const handleWeightChange = (key: string, value: number) => {
    const updated = { ...weights, [key]: value };
    setWeights(updated);
    if (onWeightsChange) {
      onWeightsChange(updated);
    }
  };

  const resetWeights = () => {
    const resetMap: Record<string, number> = {};
    criteria.forEach((c) => {
      resetMap[c.key] = c.defaultWeight || 3;
    });
    setWeights(resetMap);
    if (onWeightsChange) {
      onWeightsChange(resetMap);
    }
  };

  // Calculate Weighted Totals for each option
  const optionCalculations = options.map((opt) => {
    let rawWeightedSum = 0;
    let maxPossibleWeightedSum = 0;

    criteria.forEach((crit) => {
      const weight = weights[crit.key] || 3;
      const scoreObj = crit.scores.find((s) => s.optionId === opt.id);
      const score = scoreObj?.score || 5;

      rawWeightedSum += score * weight;
      maxPossibleWeightedSum += 10 * weight;
    });

    const percentage =
      maxPossibleWeightedSum > 0
        ? Math.round((rawWeightedSum / maxPossibleWeightedSum) * 100)
        : 0;

    return {
      option: opt,
      rawWeightedSum,
      percentage,
    };
  });

  // Sort descending to determine current calculated winner
  const sortedCalculations = [...optionCalculations].sort((a, b) => b.percentage - a.percentage);
  const calculatedWinner = sortedCalculations[0];

  return (
    <div className="space-y-8 font-sans">
      {/* Dynamic Leaderboard Banner */}
      <div className="bg-[#E8E4DB] border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-black pb-6">
          <div>
            <div className="inline-block bg-black text-white px-3 py-1 text-[10px] uppercase font-sans tracking-widest font-bold mb-2">
              Interactive Decision Calculator
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-black uppercase text-[#1C1C1C]">
              Personalized Priority Simulator
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 italic font-serif mt-1 max-w-xl">
              Adjust the weight sliders below to align with your personal priorities. The score bar chart updates live.
            </p>
          </div>

          <button
            onClick={resetWeights}
            className="self-start md:self-auto inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-sans font-bold uppercase tracking-widest bg-white text-black border border-black hover:bg-black hover:text-white transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Weights</span>
          </button>
        </div>

        {/* Live Score Bars */}
        <div className="mt-6 space-y-4">
          <div className="text-xs font-sans font-bold text-black uppercase tracking-widest">
            Live Score Leaderboard
          </div>
          <div className="space-y-4">
            {optionCalculations.map(({ option, percentage }) => {
              const isLeader = calculatedWinner && calculatedWinner.option.id === option.id;

              return (
                <div key={option.id} className="space-y-1.5 bg-white p-4 border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center text-xs font-sans font-bold">
                    <span className="flex items-center gap-2 text-[#1C1C1C]">
                      {isLeader && <Trophy className="w-4 h-4 text-black" />}
                      <span className="text-sm font-serif italic">{option.name}</span>
                      {isLeader && (
                        <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest bg-black text-white font-sans font-bold">
                          Leading Choice
                        </span>
                      )}
                    </span>
                    <span className="font-sans text-base font-black text-black">{percentage}%</span>
                  </div>
                  <div className="w-full bg-[#E8E4DB] h-4 border border-black p-0.5">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isLeader ? 'bg-black' : 'bg-gray-500'
                      }`}
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <div className="flex items-center space-x-2 border-b border-black pb-3">
          <Sliders className="w-5 h-5 text-black" />
          <h4 className="font-sans font-bold uppercase text-xs tracking-widest text-black">
            Adjust Criteria Weights (1 to 5)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {criteria.map((crit) => {
            const currentWeight = weights[crit.key] || 3;

            return (
              <div
                key={crit.key}
                className="bg-[#F9F7F2] p-4 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-serif font-bold text-[#1C1C1C] text-base">{crit.name}</span>
                    <p className="text-xs text-gray-600 font-serif italic mt-0.5">{crit.description}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-sans font-bold uppercase tracking-widest bg-[#E8E4DB] text-black border border-black shrink-0">
                    Weight: {currentWeight} / 5
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={currentWeight}
                    onChange={(e) => handleWeightChange(crit.key, Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-none appearance-none cursor-pointer accent-black border border-black"
                  />
                  <div className="flex justify-between text-[9px] font-sans font-bold uppercase tracking-widest text-gray-500">
                    <span>1 (Low)</span>
                    <span>3 (Moderate)</span>
                    <span>5 (Critical)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
