import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ThumbsUp,
  Table as TableIcon,
  ShieldCheck,
  Sliders,
  Award,
  Share2,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTableView } from './components/ComparisonTableView';
import { SwotView } from './components/SwotView';
import { WeightedMatrixView } from './components/WeightedMatrixView';
import { VerdictView } from './components/VerdictView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ExportModal } from './components/ExportModal';
import { PresetTemplate } from './data/presets';
import { ActiveTab, DecisionAnalysis, ProItem, ConItem, SavedDecision } from './types';

const LOCAL_STORAGE_KEY = 'the_tie_breaker_saved_decisions_v1';

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<DecisionAnalysis | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('verdict');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // History & Storage
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [customWeights, setCustomWeights] = useState<Record<string, number>>({});

  // Sync saved decisions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedDecisions));
    } catch (e) {
      console.error('Failed to save decisions to localStorage', e);
    }
  }, [savedDecisions]);

  // Handle Preset Select
  const handleSelectPreset = (preset: PresetTemplate) => {
    setCurrentPrompt(preset.prompt);
    setCurrentAnalysis(preset.sampleAnalysis);
    setActiveTab('verdict');
    setError(null);

    // Save to history if not existing
    const existingIndex = savedDecisions.findIndex((s) => s.id === preset.id);
    if (existingIndex === -1) {
      const newSaved: SavedDecision = {
        id: preset.id,
        createdAt: new Date().toISOString(),
        prompt: preset.prompt,
        optionsInput: preset.options,
        contextInput: preset.context,
        analysis: preset.sampleAnalysis,
      };
      setSavedDecisions((prev) => [newSaved, ...prev]);
    }
  };

  // API Analyze Decision
  const handleAnalyzeDecision = async (
    prompt: string,
    options: string[],
    context: string
  ) => {
    setIsLoading(true);
    setError(null);
    setCurrentPrompt(prompt);

    try {
      const response = await fetch('/api/gemini/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, options, context }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to analyze decision with Gemini.');
      }

      const analysis: DecisionAnalysis = resData.data;
      setCurrentAnalysis(analysis);
      setActiveTab('verdict');

      // Auto save to history
      const newSaved: SavedDecision = {
        id: `dec-${Date.now()}`,
        createdAt: new Date().toISOString(),
        prompt,
        optionsInput: options,
        contextInput: context,
        analysis,
      };

      setSavedDecisions((prev) => [newSaved, ...prev.slice(0, 19)]); // keep latest 20
    } catch (err: any) {
      console.error('Error analyzing decision:', err);
      setError(err.message || 'An unexpected error occurred while analyzing your decision.');
    } finally {
      setIsLoading(false);
    }
  };

  // User Add Pro/Con Factor
  const handleAddUserFactor = (
    optionId: string,
    type: 'pro' | 'con',
    item: ProItem | ConItem
  ) => {
    if (!currentAnalysis) return;

    const updatedOptions = currentAnalysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;

      if (type === 'pro') {
        return { ...opt, pros: [...opt.pros, item as ProItem] };
      } else {
        return { ...opt, cons: [...opt.cons, item as ConItem] };
      }
    });

    const updatedAnalysis = { ...currentAnalysis, options: updatedOptions };
    setCurrentAnalysis(updatedAnalysis);

    // Update in saved history if present
    setSavedDecisions((prev) =>
      prev.map((s) => (s.prompt === currentPrompt ? { ...s, analysis: updatedAnalysis } : s))
    );
  };

  const handleSelectHistoryDecision = (saved: SavedDecision) => {
    setCurrentPrompt(saved.prompt);
    setCurrentAnalysis(saved.analysis);
    if (saved.customWeights) setCustomWeights(saved.customWeights);
    setActiveTab('verdict');
    setError(null);
  };

  const handleDeleteHistoryDecision = (id: string) => {
    setSavedDecisions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearAllHistory = () => {
    setSavedDecisions([]);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1C1C1C] flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Top Bar Header */}
      <Header
        onNewDecision={() => {
          setCurrentAnalysis(null);
          setError(null);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedDecisions.length}
        hasCurrentAnalysis={!!currentAnalysis}
      />

      {/* Main Body */}
      <main className="flex-1 pb-16">
        {/* Error Alert */}
        {error && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="bg-rose-50 border-2 border-rose-800 p-4 text-rose-900 flex items-start space-x-3 text-sm font-sans">
              <AlertCircle className="w-5 h-5 text-rose-800 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold uppercase tracking-wider block mb-0.5">Analysis Issue</span>
                <p className="font-serif italic">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-xs text-rose-800 uppercase tracking-widest font-bold underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {!currentAnalysis ? (
          /* FORM VIEW */
          <DecisionForm
            onAnalyze={handleAnalyzeDecision}
            onSelectPreset={handleSelectPreset}
            isLoading={isLoading}
          />
        ) : (
          /* ANALYSIS RESULTS DASHBOARD */
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
            {/* Top Navigation & Context Summary */}
            <div className="bg-white border-2 border-black p-4 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6 border-b border-gray-300 pb-5 sm:pb-6">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <button
                      onClick={() => setCurrentAnalysis(null)}
                      className="hover:underline flex items-center gap-1 text-black font-bold"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Form</span>
                    </button>
                    <span className="hidden xs:inline">•</span>
                    <span className="text-black bg-[#E8E4DB] px-2 py-0.5 font-bold">Active Deliberation</span>
                  </div>
                  <h2 className="text-xl sm:text-4xl font-serif font-black text-[#1C1C1C] leading-tight">
                    {currentAnalysis.title}
                  </h2>
                  <p className="text-xs sm:text-base text-gray-700 italic font-serif max-w-3xl leading-relaxed">
                    "{currentAnalysis.summary}"
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200">
                  <button
                    onClick={() => setIsExportOpen(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-sans font-bold uppercase tracking-widest bg-white text-black border border-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Export Brief</span>
                  </button>

                  <button
                    onClick={() => setCurrentAnalysis(null)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-sans font-bold uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>New Query</span>
                  </button>
                </div>
              </div>

              {/* View Mode Navigation Tabs */}
              <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap gap-2 no-scrollbar scroll-smooth">
                {[
                  {
                    id: 'verdict',
                    label: 'Verdict',
                    fullLabel: 'The Tie Breaker Verdict',
                    icon: Award,
                    badge: `${currentAnalysis.verdict.confidencePercentage}%`,
                  },
                  {
                    id: 'pros-cons',
                    label: 'Pros & Cons',
                    fullLabel: 'Pros & Cons',
                    icon: ThumbsUp,
                    badge: `${currentAnalysis.options.length} Options`,
                  },
                  {
                    id: 'comparison',
                    label: 'Comparison',
                    fullLabel: 'Comparison Table',
                    icon: TableIcon,
                    badge: `${currentAnalysis.comparisonCriteria.length} Factors`,
                  },
                  {
                    id: 'matrix',
                    label: 'Weighted Matrix',
                    fullLabel: 'Weighted Matrix',
                    icon: Sliders,
                    badge: 'Interactive',
                  },
                  {
                    id: 'swot',
                    label: 'SWOT',
                    fullLabel: 'SWOT Analysis',
                    icon: ShieldCheck,
                    badge: '4 Quadrants',
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as ActiveTab)}
                      className={`shrink-0 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs uppercase tracking-widest font-sans font-bold transition-all flex items-center space-x-2 border min-h-[40px] ${
                        isActive
                          ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]'
                          : 'bg-[#F9F7F2] text-black border-black hover:bg-[#E8E4DB]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="hidden sm:inline">{tab.fullLabel}</span>
                      <span className="sm:hidden">{tab.label}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 font-sans font-bold uppercase shrink-0 ${
                          isActive ? 'bg-[#E8E4DB] text-black' : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB CONTENT WITH MOTION ANIMATIONS */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeTab === 'verdict' && (
                    <VerdictView
                      verdict={currentAnalysis.verdict}
                      options={currentAnalysis.options}
                    />
                  )}

                  {activeTab === 'pros-cons' && (
                    <ProsConsView
                      options={currentAnalysis.options}
                      onAddUserFactor={handleAddUserFactor}
                    />
                  )}

                  {activeTab === 'comparison' && (
                    <ComparisonTableView
                      criteria={currentAnalysis.comparisonCriteria}
                      options={currentAnalysis.options}
                    />
                  )}

                  {activeTab === 'matrix' && (
                    <WeightedMatrixView
                      criteria={currentAnalysis.comparisonCriteria}
                      options={currentAnalysis.options}
                      onWeightsChange={setCustomWeights}
                      initialWeights={customWeights}
                    />
                  )}

                  {activeTab === 'swot' && <SwotView options={currentAnalysis.options} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* Editorial Footer Decorative */}
      <footer className="mt-auto py-6 border-t border-black bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-sans uppercase tracking-widest text-gray-500 gap-2">
          <div>© {new Date().getFullYear()} The Tie Breaker / Neural Arbitration Division</div>
          <div className="italic font-serif normal-case text-gray-600">AI-Assisted Decision Logic & Strategic Arbitrage</div>
        </div>
      </footer>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectHistoryDecision}
        onDeleteDecision={handleDeleteHistoryDecision}
        onClearAll={handleClearAllHistory}
      />

      {/* Export Modal */}
      {currentAnalysis && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          analysis={currentAnalysis}
        />
      )}
    </div>
  );
}
