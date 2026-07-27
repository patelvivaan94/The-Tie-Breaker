export interface ProItem {
  id: string;
  text: string;
  importance: number; // 1-5
  category: string;
  explanation?: string;
  isUserAdded?: boolean;
}

export interface ConItem {
  id: string;
  text: string;
  severity: number; // 1-5
  category: string;
  explanation?: string;
  isUserAdded?: boolean;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionData {
  id: string;
  name: string;
  tagline: string;
  pros: ProItem[];
  cons: ConItem[];
  swot: SwotAnalysis;
}

export interface CriteriaScore {
  optionId: string;
  score: number; // 1-10
  reasoning: string;
}

export interface ComparisonCriterion {
  key: string;
  name: string;
  description: string;
  defaultWeight: number; // 1-5
  scores: CriteriaScore[];
}

export interface ConditionalAlternative {
  optionId: string;
  condition: string;
}

export interface DecisionVerdict {
  winnerOptionId: string;
  winnerName: string;
  confidencePercentage: number;
  headline: string;
  detailedRecommendation: string;
  whenToChooseOthers: ConditionalAlternative[];
  blindSpots: string[];
  diagnosticQuestions: string[];
}

export interface DecisionAnalysis {
  title: string;
  summary: string;
  options: OptionData[];
  comparisonCriteria: ComparisonCriterion[];
  verdict: DecisionVerdict;
}

export interface SavedDecision {
  id: string;
  createdAt: string; // ISO string
  prompt: string;
  optionsInput?: string[];
  contextInput?: string;
  analysis: DecisionAnalysis;
  customWeights?: Record<string, number>; // criterionKey -> weight
}

export type ActiveTab = 'pros-cons' | 'comparison' | 'swot' | 'matrix' | 'verdict';
