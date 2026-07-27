import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Plus, Tag } from 'lucide-react';
import { OptionData, ProItem, ConItem } from '../types';

interface ProsConsViewProps {
  options: OptionData[];
  onAddUserFactor: (optionId: string, type: 'pro' | 'con', item: ProItem | ConItem) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({ options, onAddUserFactor }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const [addingType, setAddingType] = useState<'pro' | 'con' | null>(null);
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState<number>(3);
  const [newCategory, setNewCategory] = useState('Personal');

  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !addingType) return;

    if (addingType === 'pro') {
      const item: ProItem = {
        id: `user-p-${Date.now()}`,
        text: newText.trim(),
        importance: newRating,
        category: newCategory,
        explanation: 'Custom user-added factor.',
        isUserAdded: true,
      };
      onAddUserFactor(activeOption.id, 'pro', item);
    } else {
      const item: ConItem = {
        id: `user-c-${Date.now()}`,
        text: newText.trim(),
        severity: newRating,
        category: newCategory,
        explanation: 'Custom user-added factor.',
        isUserAdded: true,
      };
      onAddUserFactor(activeOption.id, 'con', item);
    }

    setNewText('');
    setAddingType(null);
  };

  if (!activeOption) return null;

  // Score calculations
  const totalProsWeight = activeOption.pros.reduce((sum, p) => sum + p.importance, 0);
  const totalConsWeight = activeOption.cons.reduce((sum, c) => sum + c.severity, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Option Selector Tabs if multiple options */}
      <div className="flex flex-wrap gap-2 border-b-2 border-black pb-3">
        {options.map((option) => {
          const isSelected = option.id === activeOption.id;
          const pScore = option.pros.reduce((s, p) => s + p.importance, 0);
          const cScore = option.cons.reduce((s, c) => s + c.severity, 0);
          const diff = pScore - cScore;

          return (
            <button
              key={option.id}
              onClick={() => setSelectedOptionId(option.id)}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-sans font-bold transition-all flex items-center space-x-2 border ${
                isSelected
                  ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]'
                  : 'bg-white text-black border-black hover:bg-[#E8E4DB]'
              }`}
            >
              <span>{option.name}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 font-sans font-bold ${
                  diff >= 0 ? 'bg-emerald-800 text-white' : 'bg-rose-800 text-white'
                }`}
              >
                {diff > 0 ? `+${diff}` : diff} balance
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Option Banner */}
      <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif font-black text-[#1C1C1C]">{activeOption.name}</h3>
          <p className="text-xs sm:text-sm text-gray-700 italic font-serif mt-0.5">{activeOption.tagline}</p>
        </div>
        <div className="flex items-center space-x-4 text-xs font-sans font-bold uppercase tracking-widest bg-[#E8E4DB] px-4 py-2.5 border border-black shrink-0">
          <div className="text-emerald-800 flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Pros Weight: {totalProsWeight}</span>
          </div>
          <div className="text-gray-400">|</div>
          <div className="text-rose-800 flex items-center gap-1">
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Cons Weight: {totalConsWeight}</span>
          </div>
        </div>
      </div>

      {/* Pros & Cons Dual Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PROS COLUMN */}
        <div className="bg-[#F9F7F2] border-2 border-emerald-800 p-5 shadow-[4px_4px_0px_0px_rgba(4,120,87,0.2)] space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-emerald-800 text-white flex items-center justify-center font-bold">
                <ThumbsUp className="w-4 h-4" />
              </div>
              <h4 className="font-sans font-bold text-emerald-900 uppercase text-xs tracking-widest">
                Pros ({activeOption.pros.length})
              </h4>
            </div>
            <button
              onClick={() => {
                setAddingType('pro');
                setNewText('');
              }}
              className="text-xs font-sans font-bold uppercase tracking-widest text-emerald-900 hover:underline flex items-center gap-1 px-2.5 py-1 bg-emerald-100 border border-emerald-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pro</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeOption.pros.map((pro) => (
              <div
                key={pro.id}
                className="bg-white p-4 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2 relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-serif italic text-[#1C1C1C] leading-snug font-medium">
                    {pro.text}
                  </p>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-sans font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-800">
                    +{pro.importance} pts
                  </span>
                </div>

                {pro.explanation && (
                  <p className="text-xs text-gray-600 font-serif leading-relaxed">{pro.explanation}</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-[10px] font-sans uppercase tracking-widest text-gray-500">
                  <span className="inline-flex items-center gap-1 text-black bg-[#E8E4DB] px-2 py-0.5 font-bold">
                    <Tag className="w-3 h-3 text-emerald-800" />
                    {pro.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Impact:</span>
                    <div className="flex space-x-0.5 text-emerald-700">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= pro.importance ? 'text-emerald-800' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONS COLUMN */}
        <div className="bg-[#F9F7F2] border-2 border-rose-800 p-5 shadow-[4px_4px_0px_0px_rgba(190,18,60,0.2)] space-y-4">
          <div className="flex items-center justify-between border-b border-rose-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-rose-800 text-white flex items-center justify-center font-bold">
                <ThumbsDown className="w-4 h-4" />
              </div>
              <h4 className="font-sans font-bold text-rose-900 uppercase text-xs tracking-widest">
                Cons ({activeOption.cons.length})
              </h4>
            </div>
            <button
              onClick={() => {
                setAddingType('con');
                setNewText('');
              }}
              className="text-xs font-sans font-bold uppercase tracking-widest text-rose-900 hover:underline flex items-center gap-1 px-2.5 py-1 bg-rose-100 border border-rose-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Con</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeOption.cons.map((con) => (
              <div
                key={con.id}
                className="bg-white p-4 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2 relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-serif italic text-[#1C1C1C] leading-snug font-medium">
                    {con.text}
                  </p>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-sans font-bold uppercase tracking-widest bg-rose-100 text-rose-800 border border-rose-800">
                    -{con.severity} pts
                  </span>
                </div>

                {con.explanation && (
                  <p className="text-xs text-gray-600 font-serif leading-relaxed">{con.explanation}</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-[10px] font-sans uppercase tracking-widest text-gray-500">
                  <span className="inline-flex items-center gap-1 text-black bg-[#E8E4DB] px-2 py-0.5 font-bold">
                    <Tag className="w-3 h-3 text-rose-800" />
                    {con.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Severity:</span>
                    <div className="flex space-x-0.5 text-rose-700">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= con.severity ? 'text-rose-800' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Custom Factor Modal / Drawer inline */}
      {addingType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 max-w-md w-full border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <h3 className="text-base font-sans font-bold uppercase tracking-widest text-black flex items-center gap-2 border-b border-black pb-2">
              {addingType === 'pro' ? (
                <>
                  <ThumbsUp className="w-5 h-5 text-emerald-800" />
                  Add Custom Pro to {activeOption.name}
                </>
              ) : (
                <>
                  <ThumbsDown className="w-5 h-5 text-rose-800" />
                  Add Custom Con to {activeOption.name}
                </>
              )}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest font-sans font-bold text-black mb-1">
                  Description / Factor
                </label>
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="e.g., Saves 2 hours of daily travel..."
                  className="w-full bg-[#F9F7F2] text-[#1C1C1C] placeholder-gray-400 p-3 text-sm border border-black outline-none font-serif italic"
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-sans font-bold text-black mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#F9F7F2] text-[#1C1C1C] p-2.5 text-xs font-sans border border-black outline-none font-bold"
                  >
                    <option value="Financial">Financial</option>
                    <option value="Career">Career</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Health">Health</option>
                    <option value="Personal">Personal</option>
                    <option value="Effort">Effort</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-sans font-bold text-black mb-1">
                    {addingType === 'pro' ? 'Impact (1-5)' : 'Severity (1-5)'}
                  </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full bg-[#F9F7F2] text-[#1C1C1C] p-2.5 text-xs font-sans border border-black outline-none font-bold"
                  >
                    <option value={1}>1 - Minimal</option>
                    <option value={2}>2 - Low</option>
                    <option value={3}>3 - Moderate</option>
                    <option value={4}>4 - High</option>
                    <option value={5}>5 - Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-300">
                <button
                  type="button"
                  onClick={() => setAddingType(null)}
                  className="px-4 py-2 text-xs font-sans font-bold uppercase tracking-widest text-black border border-gray-400 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-sans font-bold uppercase tracking-widest text-white ${
                    addingType === 'pro'
                      ? 'bg-emerald-800 hover:bg-emerald-900'
                      : 'bg-rose-800 hover:bg-rose-900'
                  }`}
                >
                  Save Factor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
