export type Lens = 'ai' | 'quant';
export type Track = Lens | 'both';

export const person = {
  name: 'Meet Babariya',
  email: 'meetbabariya001@gmail.com',
  city: 'Stuttgart, DE',
  tz: 'Europe/Berlin',
  links: {
    github: 'https://github.com/MeetBabariya',
    linkedin: 'https://www.linkedin.com/in/meet-babariya-3044b0196/',
    kaggle: 'https://www.kaggle.com/meetbabariya',
  },
  cv: { ai: '/Meet_Babariya_AI_CV.pdf', quant: '/Meet_Babariya_Quant_CV.pdf' },
} as const;

export const facts = [
  { k: 'Now', v: 'ML Benchmark Engineer', sub: 'Datacurve · Y Combinator' },
  { k: 'Before', v: 'Derivatives Trader', sub: 'Jainam Broking · 2022–24' },
  { k: 'Studying', v: 'B.Sc. Business Info. Systems', sub: 'Furtwangen University · 1.55' },
  { k: 'Looking for', v: 'Internship / Werkstudent', sub: 'AI · ML · Quant — Germany' },
] as const;

export interface Role {
  org: string;
  title: string;
  period: string;
  place: string;
  track: Track;
  tag?: string;
  summary: string;
  points: string[];
  caseStudy?: string;
}

export const experience: Role[] = [
  {
    org: 'Datacurve',
    tag: 'YC',
    title: 'ML Benchmark Engineer · Project Eris',
    period: 'Sep 2026 — now',
    place: 'Remote',
    track: 'ai',
    summary: 'Designing the Kaggle-style challenges Datacurve uses to train and evaluate autonomous AI agents.',
    points: [
      'Own each challenge end to end: data sourcing, leak-free split pipeline, evaluator, rubrics and a reference solution.',
      '25+ designs across vision fine-tuning, sequence-to-sequence, from-scratch and LLM-evaluation tracks, on licensed real-world data.',
      'Calibrate difficulty so frontier agents land below 0.8, from ridge floors and fine-tuned CNNs to exact Bayes-optimal decoders.',
    ],
    caseStudy: '/work/benchmark-design',
  },
  {
    org: 'Jainam Broking',
    title: 'Derivatives Trader',
    period: 'Apr 2022 — Dec 2024',
    place: 'Surat, India',
    track: 'quant',
    summary: 'Two and a half years trading weekly index options on a live desk.',
    points: [
      'Traded NIFTY and BANKNIFTY weekly options with delta-neutral structures across expiry cycles.',
      'Hedged in real time, re-balancing delta and vega as volatility expanded.',
      'Sized and monitored positions with pricing models and Greeks-based limits.',
    ],
  },
  {
    org: 'Furtwangen University',
    title: 'B.Sc. International Business Information Systems',
    period: 'Mar 2025 — now',
    place: 'Furtwangen, DE',
    track: 'both',
    summary: 'Current grade 1.55.',
    points: [
      'Self-study: MIT OCW Mathematics with Applications in Finance; WorldQuant University Applied Data Science Lab.',
    ],
  },
];

export interface Rank {
  event: string;
  detail: string;
  rank?: number;
  of?: number;
  result?: string;
  track: Track;
}

export const ranks: Rank[] = [
  { event: 'IMC Prosperity 4', detail: 'Algorithmic trading · 12th in Germany', rank: 230, of: 18803, track: 'quant' },
  { event: 'Kaggle — CIBMTR', detail: 'Silver medal · survival modelling', rank: 120, of: 3325, track: 'ai' },
  { event: 'Kaggle — MITSUI', detail: 'Bronze medal · commodity prediction', rank: 165, of: 1711, track: 'both' },
  { event: 'WorldQuant BRAIN', detail: 'WorldQuant Challenge', result: 'Gold level', track: 'quant' },
  { event: 'Kaggle', detail: 'Competitions Expert', result: 'Top 1%', track: 'ai' },
  { event: 'AlgoTrade Hackathon', detail: 'Zagreb · options market-making', result: 'Competed', track: 'quant' },
];

export const skills: { group: string; track: Track; items: string[] }[] = [
  { group: 'LLM systems', track: 'ai', items: ['Claude / OpenAI APIs', 'RAG', 'Embeddings & vector DBs', 'Agents & tool use', 'LLM evaluation', 'Benchmark design'] },
  { group: 'Machine learning', track: 'ai', items: ['PyTorch', 'Hugging Face', 'Fine-tuning', 'Computer vision', 'scikit-learn', 'Gradient boosting'] },
  { group: 'Quant', track: 'quant', items: ['Options & Greeks', 'Volatility models', 'Monte Carlo', 'VaR / CVaR', 'Backtesting', 'Walk-forward OOS'] },
  { group: 'Engineering', track: 'both', items: ['Python', 'TypeScript', 'SQL', 'Next.js / Astro', 'FastAPI', 'PostgreSQL', 'Docker'] },
];

export const certs = [
  'NISM Series-VIII · Equity Derivatives (SEBI)',
  'NISM Series-XV · Research Analyst (SEBI)',
  'Applied Data Science Lab · WorldQuant University',
  'English — fluent · German — A2',
];

export const archive = [
  { title: 'Financial Analyst Agent', note: 'Hand-written tool-use loop over VaR / vol / Sharpe tools', href: 'https://github.com/MeetBabariya/financial-analyst-agent', tags: ['Claude', 'Agents'], track: 'both' as Track },
  { title: 'Black-Scholes vs Heston', note: 'Fourier-priced Heston against Black-Scholes; skew from vol-of-vol', href: 'https://github.com/MeetBabariya/Black-Scholes-vs.-Heston-Model', tags: ['SciPy', 'Streamlit'], track: 'quant' as Track },
  { title: 'Delta-Hedging Simulator', note: 'Short call, delta-hedged: gamma vs theta under realized ≠ implied', href: 'https://github.com/MeetBabariya/hedging-simulator', tags: ['Greeks', 'Plotly'], track: 'quant' as Track },
  { title: 'GARCH Intraday Strategy', note: 'Signals from GARCH volatility forecasts', href: 'https://github.com/MeetBabariya/Intraday_Strategy_Using_Garch_Model', tags: ['GARCH'], track: 'quant' as Track },
  { title: 'Portfolio VaR Analyzer', note: 'Historical, parametric and Monte Carlo VaR', href: 'https://github.com/MeetBabariya/Portfolio-VaR-Analyzer', tags: ['Risk'], track: 'quant' as Track },
  { title: 'Credit Risk Modelling', note: 'PD and expected-loss estimation with ML', href: 'https://github.com/MeetBabariya/credit-risk-modelling', tags: ['scikit-learn'], track: 'both' as Track },
  { title: 'Excel VBA Risk Toolkit', note: 'OOP VBA: covariance VaR report with auto chart', href: 'https://github.com/MeetBabariya/excel-vba-portfolio-toolkit', tags: ['VBA'], track: 'quant' as Track },
  { title: 'Volatility Curve Prediction', note: 'Iterative imputation with gradient-boosted estimators', href: 'https://github.com/MeetBabariya/Volatility-Curve-Prediction', tags: ['XGBoost'], track: 'both' as Track },
];
