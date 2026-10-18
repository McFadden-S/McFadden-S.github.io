import { asset } from './site';

export type PaperType = 'conference' | 'journal' | 'workshop' | 'preprint' | 'other';
export type Topic = 'malware' | 'drl' | 'rag' | 'vuln';

export interface Paper {
  id: string;
  short: string;
  title: string;
  authors: string[];
  abbr: string;
  venue: string;
  year: number;
  type: PaperType;
  topic: Topic;
  selected: boolean;
  links: { label: string; href: string }[];
  page?: false;
  video?: { youtube: string; title: string; channel: string };
  bibtex: string;
}

export const TYPE_LABEL: Record<PaperType, string> = {
  conference: 'Conference',
  journal: 'Journal',
  workshop: 'Workshop',
  preprint: 'Preprint',
  other: 'Poster & competition',
};

export const ME = 'Shae McFadden';

export const papers: Paper[] = [
  {
    id: 'replicant',
    short: 'REPLICANT',
    title: 'REPLICANT: Learning Policies for Evading and Hardening Malware Detectors',
    authors: ['Shae McFadden', 'Ilias Tsingenopoulos', "Mario D'Onghia", 'Alexander Herzog', 'Myles Foley', 'Chris Hicks', 'Lorenzo Cavallaro', 'Fabio Pierazzi'],
    abbr: 'arXiv',
    venue: 'arXiv preprint (cs.LG)',
    year: 2026,
    type: 'preprint',
    topic: 'malware',
    selected: true,
    links: [
      { label: 'arXiv', href: 'https://arxiv.org/abs/2608.28499' },
      { label: 'PDF', href: 'https://arxiv.org/pdf/2608.28499' },
    ],
    bibtex: `@misc{mcfadden2026replicant,
      title={REPLICANT: Learning Policies for Evading and Hardening Malware Detectors},
      author={Shae McFadden and Ilias Tsingenopoulos and Mario D'Onghia and Alexander Herzog and Myles Foley and Chris Hicks and Lorenzo Cavallaro and Fabio Pierazzi},
      year={2026},
      eprint={2608.28499},
      archivePrefix={arXiv},
      primaryClass={cs.LG}
}`,
  },
  {
    id: 'sok',
    short: 'DRL4Sec SoK',
    title: 'SoK: The Pitfalls of Deep Reinforcement Learning for Cybersecurity',
    authors: ['Shae McFadden', 'Myles Foley', 'Elizabeth Bates', 'Ilias Tsingenopoulos', 'Sanyam Vyas', 'Vasilios Mavroudis', 'Chris Hicks', 'Fabio Pierazzi'],
    abbr: 'USENIX Sec',
    venue: '35th USENIX Security Symposium (USENIX Security 26)',
    year: 2026,
    type: 'conference',
    topic: 'drl',
    selected: true,
    links: [
      { label: 'PDF', href: asset('DRL4Sec_Pitfalls_Accepted.pdf') },
      { label: 'Artifact appendix', href: asset('DRL4Sec_Pitfalls_Accepted_Artifact_Appendix.pdf') },
      { label: 'Zenodo', href: 'https://doi.org/10.5281/zenodo.20209122' },
      { label: 'Poster', href: asset('DRL4Sec_USENIX_Sec_Poster.pdf') },
      { label: 'Slides', href: asset('DRL4Sec_USENIX_Sec_Slides.pdf') },
    ],
    bibtex: `@inproceedings{McFadden2026Pitfalls,
      title={SoK: The Pitfalls of Deep Reinforcement Learning for Cybersecurity},
      author={Shae McFadden and Myles Foley and Elizabeth Bates and Ilias Tsingenopoulos and Sanyam Vyas and Vasilios Mavroudis and Chris Hicks and Fabio Pierazzi},
      booktitle={35th USENIX Security Symposium (USENIX Security 26)},
      year={2026}
}`,
  },
  {
    id: 'direction',
    short: 'Direction for Detection',
    title: 'Direction for Detection: A Survey of Automated Vulnerability Detection and all of its Pain Points',
    authors: ['Dan Ristea', 'Shae McFadden', 'Ezzeldin Shereen', 'Madeleine Dwyer', 'Sanyam Vyas', 'Chris Hicks', 'Vasilios Mavroudis'],
    abbr: 'TMLR',
    venue: 'Transactions on Machine Learning Research',
    year: 2026,
    type: 'journal',
    topic: 'vuln',
    selected: true,
    links: [{ label: 'PDF', href: 'https://openreview.net/pdf?id=01TkT5p3xT' }],
    bibtex: `@article{ristea2026direction,
      title={Direction for Detection: A Survey of Automated Vulnerability Detection and all of its Pain Points},
      author={Dan Ristea and Shae McFadden and Ezzeldin Shereen and Madeleine Dwyer and Sanyam Vyas and Chris Hicks and Vasilios Mavroudis},
      journal={Transactions on Machine Learning Research},
      year={2026}
}`,
  },
  {
    id: 'acdenv',
    short: 'ACD Environments',
    title: 'Building Better Environments for Autonomous Cyber Defence',
    authors: ['Chris Hicks', 'Elizabeth Bates', 'Shae McFadden', 'Isaac Symes Thompson', 'Myles Foley', 'Ed Chapman', 'Nickolas Espinosa Dice', 'Ankita Samaddar', 'Joshua Sylvester', 'Himanshu Neema', 'Nicholas Butts', 'Nate Foster', 'Ahmad Ridley', 'Zoe M', 'Paul Jones'],
    abbr: 'AAMAS Workshop',
    venue: 'Workshop on AI for Critical National Infrastructure (AI4CNI) at AAMAS',
    year: 2026,
    type: 'workshop',
    topic: 'drl',
    selected: true,
    links: [
      { label: 'PDF', href: asset('Better_ACD_Envs_AI4CNI_Accepted.pdf') },
      { label: 'Poster', href: asset('Better_ACD_Envs_AI4CNI_Poster.pdf') },
    ],
    bibtex: `@misc{hicks2026building,
      title={Building Better Environments for Autonomous Cyber Defence},
      author={Chris Hicks and Elizabeth Bates and Shae McFadden and Isaac Symes Thompson and Myles Foley and Ed Chapman and Nickolas Espinosa Dice and Ankita Samaddar and Joshua Sylvester and Himanshu Neema and Nicholas Butts and Nate Foster and Ahmad Ridley and Zoe M and Paul Jones},
      booktitle={Workshop on AI for Critical National Infrastructure (AI4CNI) at AAMAS},
      year={2026}
}`,
  },
  {
    id: 'drmd',
    short: 'DRMD',
    title: 'DRMD: Deep Reinforcement Learning for Malware Detection under Concept Drift',
    authors: ['Shae McFadden', 'Myles Foley', "Mario D'Onghia", 'Chris Hicks', 'Vasilios Mavroudis', 'Nicola Paoletti', 'Fabio Pierazzi'],
    abbr: 'AAAI',
    venue: 'Proc. of the AAAI Conference on Artificial Intelligence',
    year: 2026,
    type: 'conference',
    topic: 'malware',
    selected: true,
    links: [
      { label: 'PDF', href: asset('DRMD_AAAI_Accepted.pdf') },
      { label: 'Supp', href: asset('DRMD_AAAI_extended.pdf') },
      { label: 'Code', href: 'https://github.com/s2labres/DRMD' },
      { label: 'Video', href: 'https://www.youtube.com/watch?v=jO5to6AwI7c' },
      { label: 'Poster', href: asset('DRMD-Poster.pdf') },
      { label: 'Slides', href: asset('DRMD_Video_Slides.pdf') },
    ],
    video: { youtube: 'jO5to6AwI7c', title: 'DRMD: Deep Reinforcement Learning for Malware Detection Under Concept Drift', channel: 'The Alan Turing Institute' },
    bibtex: `@inproceedings{McFadden2026DRMD,
      title={DRMD: Deep Reinforcement Learning for Malware Detection under Concept Drift},
      author={Shae McFadden and Myles Foley and Mario D'Onghia and Chris Hicks and Vasilios Mavroudis and Nicola Paoletti and Fabio Pierazzi},
      booktitle={Proc. of the {AAAI} Conference on Artificial Intelligence},
      year={2026}
}`,
  },
  {
    id: 'onepic',
    short: 'One Pic',
    title: 'One Pic is All it Takes: Poisoning Visual Document Retrieval Augmented Generation with a Single Image',
    authors: ['Ezzeldin Shereen', 'Dan Ristea', 'Shae McFadden', 'Burak Hasircioglu', 'Vasilios Mavroudis', 'Chris Hicks'],
    abbr: 'TMLR',
    venue: 'Transactions on Machine Learning Research',
    year: 2026,
    type: 'journal',
    topic: 'rag',
    selected: true,
    links: [
      { label: 'PDF', href: 'https://openreview.net/pdf?id=CLkjUidlYg' },
      { label: 'Code', href: 'https://github.com/alan-turing-institute/mumoRAG-attacks' },
    ],
    bibtex: `@article{shereen2026OnePic,
      title={One Pic is All it Takes: Poisoning Visual Document Retrieval Augmented Generation with a Single Image},
      author={Ezzeldin Shereen and Dan Ristea and Shae McFadden and Burak Hasircioglu and Vasilios Mavroudis and Chris Hicks},
      journal={Transactions on Machine Learning Research},
      year={2026}
}`,
  },
  {
    id: 'onepic-short',
    short: 'One Pic (short)',
    title: 'One Pic is All it Takes: Poisoning Visual Document Retrieval Augmented Generation with a Single Image (Short Paper)',
    authors: ['Ezzeldin Shereen', 'Dan Ristea', 'Burak Hasircioglu', 'Shae McFadden', 'Vasilios Mavroudis', 'Chris Hicks'],
    abbr: 'ACL Workshop',
    venue: '2nd Workshop on Multimodal Augmented Generation via MultimodAl Retrieval',
    year: 2025,
    type: 'workshop',
    topic: 'rag',
    selected: false,
    links: [
      { label: 'PDF', href: asset('One_Pic_MAGMaR_Accepted.pdf') },
      { label: 'Slides', href: asset('One_Pic_MAGMaR_Slides.pdf') },
    ],
    bibtex: `@misc{shereen2025OnePic,
      title={One Pic is All it Takes: Poisoning Visual Document Retrieval Augmented Generation with a Single Image (Short Paper)},
      author={Ezzeldin Shereen and Dan Ristea and Burak Hasircioglu and Shae McFadden and Vasilios Mavroudis and Chris Hicks},
      booktitle={2nd Workshop on Multimodal Augmented Generation via MultimodAl Retrieval},
      year={2025}
}`,
  },
  {
    id: 'alpoison',
    short: 'Passive Recovery',
    title: 'The Impact of Active Learning on Availability Data Poisoning for Android Malware Classifiers',
    authors: ['Shae McFadden', 'Zeliang Kan', 'Lorenzo Cavallaro', 'Fabio Pierazzi'],
    abbr: 'ACSAC Workshop',
    venue: 'Proc. of the Annual Computer Security Applications Conference Workshops (ACSAC Workshops)',
    year: 2024,
    type: 'workshop',
    topic: 'malware',
    selected: true,
    links: [
      { label: 'PDF', href: asset('RPAL_ARTMAN_Published.pdf') },
      { label: 'Slides', href: asset('RPAL_ARTMAN_Slides.pdf') },
      { label: 'Code', href: 'https://github.com/s2labres/RPAL' },
    ],
    bibtex: `@inproceedings{mcfadden2024recovery,
  title={The Impact of Active Learning on Availability Data Poisoning for Android Malware Classifiers},
  author={McFadden, Shae and Kan, Zeliang and Cavallaro, Lorenzo and Pierazzi, Fabio},
  booktitle={Proc. of the Annual Computer Security Applications Conference Workshops ({ACSAC Workshops})},
  year={2024}
}`,
  },
  {
    id: 'tesseract-impact',
    short: 'TESSERACT Impact',
    title: 'Impact of "TESSERACT: Eliminating Experimental Bias in Malware Classification across Space and Time"',
    authors: ['Shae McFadden', 'Zeliang Kan', 'Daniel Arp', 'Feargus Pendlebury', 'Roberto Jordaney', 'Johannes Kinder', 'Fabio Pierazzi', 'Lorenzo Cavallaro'],
    abbr: 'ACSAC Competition',
    venue: 'ACSAC Cybersecurity Artifact Competition',
    year: 2024,
    type: 'other',
    topic: 'malware',
    selected: false,
    page: false,
    links: [
      { label: 'PDF', href: asset('Tesseract_Impact.pdf') },
      { label: 'Slides', href: asset('tesseract-impact-acsac-slides.pdf') },
    ],
    bibtex: `@misc{McFadden2024tesseract,
      title={Impact of "{TESSERACT}: Eliminating Experimental Bias in Malware Classification across Space and Time"},
      author={Shae McFadden and Zeliang Kan and Daniel Arp and Feargus Pendlebury and Roberto Jordaney and Johannes Kinder and Fabio Pierazzi and Lorenzo Cavallaro},
      booktitle={ACSAC Cybersecurity Artifact Competition},
      year={2024}
}`,
  },
  {
    id: 'wendigo',
    short: 'Wendigo',
    title: 'Wendigo: Deep Reinforcement Learning for Denial-of-Service Query Discovery in GraphQL',
    authors: ['Shae McFadden', 'Marcello Maugeri', 'Chris Hicks', 'Vasilis Mavroudis', 'Fabio Pierazzi'],
    abbr: 'S&P Workshop',
    venue: 'Proc. of the IEEE Workshop on Deep Learning Security and Privacy (DLSP)',
    year: 2024,
    type: 'workshop',
    topic: 'drl',
    selected: true,
    links: [
      { label: 'PDF', href: asset('Wendigo_Published.pdf') },
      { label: 'Slides', href: asset('Wendigo-DLSP-Slides.pdf') },
      { label: 'Code', href: 'https://github.com/isneslab/Wendigo' },
    ],
    bibtex: `@inproceedings{mcfadden2024wendigo,
  title={Wendigo: Deep Reinforcement Learning for Denial-of-Service Query Discovery in GraphQL},
  author={McFadden, Shae and  Maugeri, Marcello and Hicks,  Chris and Mavroudis, Vasilis and Pierazzi, Fabio},
  booktitle={Proc. of the {IEEE} Workshop on Deep Learning Security and Privacy ({DLSP})},
  year={2024}
}`,
  },
  {
    id: 'tesseract',
    short: 'TESSERACT',
    title: 'TESSERACT: Eliminating Experimental Bias in Malware Classification across Space and Time (Extended Version)',
    authors: ['Zeliang Kan', 'Shae McFadden', 'Daniel Arp', 'Feargus Pendlebury', 'Roberto Jordaney', 'Johannes Kinder', 'Fabio Pierazzi', 'Lorenzo Cavallaro'],
    abbr: 'arXiv',
    venue: 'arXiv preprint (cs.LG)',
    year: 2024,
    type: 'preprint',
    topic: 'malware',
    selected: true,
    links: [
      { label: 'arXiv', href: 'https://arxiv.org/abs/2402.01359' },
      { label: 'PDF', href: 'https://arxiv.org/pdf/2402.01359' },
    ],
    bibtex: `@misc{kan2024tesseract,
      title={TESSERACT: Eliminating Experimental Bias in Malware Classification across Space and Time (Extended Version)},
      author={Zeliang Kan and Shae McFadden and Daniel Arp and Feargus Pendlebury and Roberto Jordaney and Johannes Kinder and Fabio Pierazzi and Lorenzo Cavallaro},
      year={2024},
      eprint={2402.01359},
      archivePrefix={arXiv},
      primaryClass={cs.LG}
}`,
  },
  {
    id: 'rpal',
    short: 'RPAL',
    title: 'Poster: RPAL-Recovering Malware Classifiers from Data Poisoning using Active Learning',
    authors: ['Shae McFadden', 'Zeliang Kan', 'Lorenzo Cavallaro', 'Fabio Pierazzi'],
    abbr: 'CCS',
    venue: 'Proc. of ACM Conference on Computer and Communications Security (CCS)',
    year: 2023,
    type: 'other',
    topic: 'malware',
    selected: true,
    links: [
      { label: 'PDF', href: asset('RPAL_Poster_23_Published.pdf') },
      { label: 'Poster', href: asset('RPAL_Poster.pdf') },
    ],
    bibtex: `@inproceedings{mcfadden2023rpal,
  title={Poster: RPAL-Recovering Malware Classifiers from Data Poisoning using Active Learning},
  author={McFadden, Shae and Kan, Zeliang and Cavallaro, Lorenzo and Pierazzi, Fabio},
  booktitle={Proc. of {ACM} Conference on Computer and Communications Security ({CCS})},
  year={2023}
}`,
  },
];

export const byId = Object.fromEntries(papers.map((p) => [p.id, p])) as Record<string, Paper>;

export const CITATIONS: [string, string][] = [
  ['replicant', 'sok'], ['replicant', 'acdenv'], ['replicant', 'drmd'], ['replicant', 'onepic'], ['replicant', 'alpoison'], ['replicant', 'tesseract'], ['replicant', 'wendigo'], ['replicant', 'rpal'],
  ['sok', 'acdenv'], ['sok', 'drmd'], ['sok', 'onepic'], ['sok', 'alpoison'], ['sok', 'tesseract'], ['sok', 'wendigo'], ['sok', 'rpal'],
  ['direction', 'sok'], ['direction', 'drmd'], ['direction', 'alpoison'], ['direction', 'tesseract'], ['direction', 'rpal'],
  ['acdenv', 'sok'], ['acdenv', 'drmd'], ['acdenv', 'wendigo'],
  ['drmd', 'alpoison'], ['drmd', 'tesseract'], ['drmd', 'wendigo'], ['drmd', 'rpal'],
  ['alpoison', 'tesseract'], ['alpoison', 'rpal'],
  ['tesseract-impact', 'alpoison'], ['tesseract-impact', 'tesseract'], ['tesseract-impact', 'rpal'],
  ['rpal', 'tesseract'],
];
export const VERSIONS: [string, string][] = [
  ['onepic-short', 'onepic'],
  ['alpoison', 'rpal'],
  ['tesseract-impact', 'tesseract'],
];

export const LINKS: [string, string][] = (() => {
  const seen = new Set<string>();
  const out: [string, string][] = [];
  for (const [a, b] of [...CITATIONS, ...VERSIONS]) {
    const key = [a, b].sort().join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push([a, b]);
  }
  return out;
})();

export const withPage = papers.filter((p) => p.page !== false);
const paged = new Set(withPage.map((p) => p.id));
export const PAGE_LINKS = LINKS.filter(([a, b]) => paged.has(a) && paged.has(b));

export function related(id: string) {
  const ids = new Set(PAGE_LINKS.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : [])));
  return withPage.filter((p) => ids.has(p.id));
}

export function neighbours(id: string) {
  const i = withPage.findIndex((p) => p.id === id);
  return { prev: i < withPage.length - 1 ? withPage[i + 1] : undefined, next: i > 0 ? withPage[i - 1] : undefined };
}
