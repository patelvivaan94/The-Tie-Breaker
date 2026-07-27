import React from 'react';
import { X, Trash2, Calendar, Award, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { SavedDecision } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: SavedDecision[];
  onSelectDecision: (saved: SavedDecision) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end font-sans">
      <div className="w-full max-w-md bg-[#F9F7F2] border-l-2 border-black h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 bg-black text-white border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-white" />
            <h3 className="font-serif font-black text-white text-xl uppercase tracking-tight">Saved Decisions Archive</h3>
            <span className="text-[10px] px-2 py-0.5 bg-white text-black font-sans font-bold uppercase">
              {savedDecisions.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white hover:text-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 text-gray-600 space-y-3 font-serif">
              <BookOpen className="w-10 h-10 mx-auto text-black opacity-40" />
              <p className="text-sm font-bold uppercase tracking-wider font-sans text-black">No saved decisions yet.</p>
              <p className="text-xs italic text-gray-600 max-w-xs mx-auto">
                Any decision analyzed will automatically save here so you can revisit it anytime!
              </p>
            </div>
          ) : (
            savedDecisions.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif font-bold text-[#1C1C1C] text-base line-clamp-2 leading-snug">
                    {item.analysis.title || item.prompt}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDecision(item.id);
                    }}
                    className="p-1 text-gray-400 hover:text-rose-800 transition"
                    title="Delete saved decision"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                  <span className="flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">
                    <Calendar className="w-3 h-3 text-black" />
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  <span className="flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">
                    <Award className="w-3 h-3" />
                    {item.analysis.verdict.winnerName}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onSelectDecision(item);
                    onClose();
                  }}
                  className="w-full mt-2 py-2 bg-[#E8E4DB] border border-black hover:bg-black hover:text-white text-black text-xs font-sans font-bold uppercase tracking-widest flex items-center justify-center space-x-1 transition"
                >
                  <span>Open Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedDecisions.length > 0 && (
          <div className="p-4 border-t-2 border-black bg-white">
            <button
              onClick={onClearAll}
              className="w-full py-2 text-xs font-sans font-bold uppercase tracking-widest text-rose-800 hover:bg-rose-50 border border-rose-800 transition"
            >
              Clear All Saved Decisions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
