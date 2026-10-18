import stats from './repo-stats.json';

export interface Repo {
  slug: string;
  name: string;
  description: string;
  topics: string[];
  paper?: string;
}

export const repos: Repo[] = [
  {
    slug: 's2labres/DRMD',
    name: 'DRMD',
    description: "Code library for the DRMD framework from 'DRMD: Deep Reinforcement Learning for Malware Detection under Concept Drift'.",
    topics: ['aaai2026', 'active-learning', 'classification-with-rejection', 'concept-drift', 'deep-reinforcement-learning', 'drl', 'malware-detection', 'rejection', 'rejection-sampling'],
    paper: 'drmd',
  },
  {
    slug: 'alan-turing-institute/DRL4Sec-Pitfalls',
    name: 'DRL4Sec-Pitfalls',
    description: "Code library for the case studies from 'SoK: The Pitfalls of Deep Reinforcement Learning for Cybersecurity'.",
    topics: ['cybersecurity', 'case-study', 'drl', 'pitfalls'],
    paper: 'sok',
  },
  {
    slug: 'alan-turing-institute/mumoRAG-attacks',
    name: 'mumoRAG-attacks',
    description: 'Adversarial and poisoning attacks against multimodal retrieval-augmented generation (RAG).',
    topics: ['adversarial-ml', 'RAG', 'multimodal', 'LLMs'],
    paper: 'onepic',
  },
  {
    slug: 'isneslab/Wendigo',
    name: 'Wendigo',
    description: "Code library for the Wendigo framework from 'Wendigo: Deep Reinforcement Learning for Denial-of-Service Query Discovery in GraphQL'.",
    topics: ['graphql', 'dos', 'deep-reinforcement-learning', 'blackbox-testing', 'dlsp2024'],
    paper: 'wendigo',
  },
  {
    slug: 's2labres/RPAL',
    name: 'RPAL',
    description: "Code library for the RPAL framework from 'The Impact of Active Learning on Availability Data Poisoning for Android Malware Classifiers'.",
    topics: ['recovery', 'active-learning', 'temporal-data', 'malware-detection', 'poisoning-attack', 'artman2025'],
    paper: 'alpoison',
  },
  {
    slug: 's2labres/tesseract-ml-release',
    name: 'tesseract-ml-release',
    description: "Code library for the Tesseract framework from 'TESSERACT: Eliminating experimental bias in malware classification across space and time'.",
    topics: ['temporal-data', 'malware-detection'],
    paper: 'tesseract',
  },
  {
    slug: 'McFadden-S/MARSim',
    name: 'MARSim',
    description: 'Multi-agent reinforcement learning environment for partially observable drone swarm attack and defence of a UGV resupply mission.',
    topics: ['drone', 'swarm', 'defense', 'drl'],
  },
];

export const repoStats = stats as Record<string, { language: string | null; stars: number; forks: number }>;
