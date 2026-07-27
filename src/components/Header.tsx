import React from 'react';
import { Scale, History, Plus } from 'lucide-react';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  savedCount: number;
  hasCurrentAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenHistory,
  savedCount,
  hasCurrentAnalysis
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F9F7F2]/95 backdrop-blur-md border-b-2 border-black text-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <div 
          onClick={onNewDecision}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black text-white flex items-center justify-center font-serif font-black text-base sm:text-lg shrink-0 group-hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
            <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            {/* Desktop Tagline */}
            <div className="hidden sm:flex items-center space-x-2 mb-0.5">
              <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-gray-500">
                CASE STUDY № 442
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-black bg-[#E8E4DB] px-1.5 py-0.5">
                AI Arbitrage
              </span>
            </div>
            {/* Mobile Badge */}
            <div className="sm:hidden flex items-center mb-0.5">
              <span className="text-[9px] uppercase tracking-widest font-sans font-bold text-black bg-[#E8E4DB] px-1 py-0.5">
                AI Arbitrage
              </span>
            </div>
            <h1 className="text-base xs:text-lg sm:text-2xl font-black uppercase leading-none tracking-tight font-serif text-[#1C1C1C] truncate">
              The Tie Breaker
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {hasCurrentAnalysis && (
            <button
              onClick={onNewDecision}
              className="inline-flex items-center justify-center space-x-1 px-2.5 sm:px-3 py-2 min-h-[38px] text-xs uppercase tracking-widest font-sans font-bold bg-white text-black border border-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
              title="New Deliberation"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">New Deliberation</span>
              <span className="hidden sm:inline md:hidden">New</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="inline-flex items-center justify-center space-x-1.5 px-2.5 sm:px-3.5 py-2 min-h-[38px] text-xs uppercase tracking-widest font-sans font-bold bg-black text-white hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
            title="Saved Decisions Archive"
          >
            <History className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Archive</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#E8E4DB] text-black shrink-0">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
