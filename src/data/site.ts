export const ASSET_BASE = import.meta.env.DEV ? 'https://mcfadden-s.github.io/assets/pdf/' : '/assets/pdf/';
export const asset = (file: string) => (/^https?:/.test(file) ? file : ASSET_BASE + file);

export const profile = {
  name: 'Shae McFadden',
  subtitle: 'PhD Student',
  moreInfo: ['Dept. of Informatics', "King's College London"],
  email: 'shae.mcfadden@kcl.ac.uk',
  bio: [
    "Currently a Ph.D. candidate, supervised by Dr. Fabio Pierazzi, at King's College London, investigating the applications of deep reinforcement learning to cybersecurity.",
    "A passion for the cross-section between artificial intelligence and cybersecurity resulted in collaborations with the Systems Security Research Lab (S2Lab) at UCL and the AI for Cyber Defence Research Centre (AICD) at The Alan Turing Institute. Graduated from King’s College London with a first-class B.Sc. (Hons) in Computer Science specialising in Artificial Intelligence. During undergraduate studies, was awarded the Layton Research Award, the Alan Fairbourn Memorial Prize, and the Associateship of King’s College.",
  ],
  social: [
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=7gaDYokAAAAJ' },
    { label: 'GitHub', href: 'https://github.com/McFadden-S' },
    { label: 'ORCID', href: 'https://orcid.org/0009-0008-0180-2888' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shae-mcfadden-27b840234' },
    { label: 'ACM DL', href: 'https://dl.acm.org/profile/99661062934/' },
    { label: 'X', href: 'https://twitter.com/Shae_McFadden' },
  ],
};

export const news: { date: string; text: string; paper?: string }[] = [
  { date: '2026-08-12', text: 'Our paper "SoK: The Pitfalls of Deep Reinforcement Learning for Cybersecurity" has been published at USENIX Security 2026.', paper: 'sok' },
  { date: '2026-05-07', text: 'Building Better Environments for Autonomous Cyber Defence accepted at AI4CNI co-located with AAMAS 2026.', paper: 'acdenv' },
  { date: '2025-11-09', text: 'DRL-based Malware Detection paper accepted at AAAI 2026.', paper: 'drmd' },
  { date: '2025-11-07', text: 'Co-organizing the 4th Machine Learning and Cyber Security Symposium (ML-CSS)' },
  { date: '2024-11-01', text: 'Tesseract has been selected as a finalist in the ACSAC Cybersecurity Artifact Competition.', paper: 'tesseract' },
  { date: '2024-10-25', text: 'Passive recovery paper accepted at the ARTMAN workshop co-located with ACSAC.', paper: 'alpoison' },
  { date: '2024-05-14', text: 'GraphQL DoS paper accepted at the DLSP workshop co-located with IEEE S&P.', paper: 'wendigo' },
];

export const cv = {
  general: [
    { name: 'Full Name', value: 'Shae McFadden' },
    { name: 'Nationality', value: 'Canadian' },
    { name: 'Languages', value: 'English' },
  ],
  education: [
    {
      title: 'PhD Candidate',
      institution: "King's College London, United Kingdom",
      year: '2023 - Present',
      description: ['Currently in Progress', 'Thesis on "Applications of Deep Reinforcement Learning for Cybersecurity".'],
    },
    {
      title: 'BSc (Hons) Computer Science (Artificial Intelligence)',
      institution: "King's College London, United Kingdom",
      year: '2020 - 2023',
      description: ['First Class Honours.', 'Dissertation on "Adversarial Machine Learning Evaluation of The MaMaDroid Feature Space".'],
    },
  ],
  experience: [
    {
      title: 'Visiting Collaborator',
      institution: 'Artificial Intelligence for Cyber Defence (AICD) Research Centre, The Alan Turing Institute',
      year: '2023 - Present',
      description: ['PhD Research under Dr. Chris Hicks and Dr. Vasilios Mavroudis'],
    },
    {
      title: 'Visiting Researcher',
      institution: 'Systems Security Lab (S2Lab), University College London',
      year: '2024 - Present',
      description: ['PhD Research under Dr. Fabio Pierazzi'],
    },
    {
      title: "King's Undergraduate Research Fellow",
      institution: "King's College London",
      year: '2022 - 2022',
      description: ['Evaluation of the impact of poisoning on machine learning classifiers for malware detection.'],
    },
  ],
  openSource: [
    { title: 'DRMD', href: 'https://github.com/s2labres/DRMD', year: '2025 - Now', description: 'DRL-based malware detection under concept drift.' },
    { title: 'mumoRAG-Attacks', href: 'https://github.com/alan-turing-institute/mumoRAG-attacks', year: '2025 - Now', description: 'Evaluating the vulnerability of multi-modal RAG pipelines.' },
    { title: 'RPAL', href: 'https://github.com/s2labres/RPAL', year: '2024 - Now', description: 'Evaluating the passive recovery of malware classifiers from data poisoning.' },
    { title: 'Wendigo', href: 'https://github.com/isneslab/wendigo', year: '2024 - Now', description: 'A deep reinforcement learning approach for DoS query discovery in GraphQL.' },
    { title: 'tesseract-ml', href: 'https://github.com/s2labres/tesseract-ml-release', year: '2024 - Now', description: 'Eliminating experimental bias in malware classification across space and time.' },
  ],
  honors: [
    { year: '2025', items: ['AISec Top Reviewer'] },
    { year: '2024', items: ['AISec Top Reviewer'] },
    { year: '2023', items: ['Layton Research Award', 'Alan Fairbourn Memorial Prize', "Associateship of King's College"] },
    { year: '2022', items: ["King's Experience Research Award"] },
    { year: '2020', items: ['Governor General Academic Medal'] },
  ],
  interests: [
    { title: 'Artificial Intelligence.', items: ['Deep reinforcement learning applications for Cybersecurity.', 'Supervised learning for malware classification.'] },
    { title: 'Cybersecurity.', items: ['Malware classification', 'Vulnerability discovery.', 'Adversarial machine learning.', 'Autonomous cyber defence.'] },
  ],
  fencing: [
    { year: '2022-2024', items: ["Captain of the Men's First Fencing Team, King's College London"] },
    { year: '2017-2020', items: ['Canadian National Fencing Team'] },
    { year: '2020', items: ['Fencing Grand Prix Montreal'] },
    { year: '2019', items: ['U18 Fencing Team Canada', 'U18 Fencing World Championships', 'U18 Fencing Pan American Championships'] },
    { year: '2018', items: ['Commonwealth Fencing Championships'] },
  ],
};
