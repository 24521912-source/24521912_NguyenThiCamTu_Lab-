export const SLA_DURATION_MS = 24 * 60 * 60 * 1000

export const dossierTemplates = [
  {
    playerID: 'himass',
    playerName: 'Himass',
    caseID: 'FP-001',
    status: 'Demonstration',
    summary:
      'An illustrative dossier for exploring procedural review, documentation, and proportionality in an academic appeal workflow.',
    criteria: [
      {
        criterion: 'procedure',
        label: 'Procedural Review',
        referenceScore: 80,
        observedScore: 70,
      },
      {
        criterion: 'documentation',
        label: 'Documentation Quality',
        referenceScore: 75,
        observedScore: 85,
      },
      {
        criterion: 'consistency',
        label: 'Evaluation Consistency',
        referenceScore: 90,
        observedScore: 80,
      },
    ],
  },
  {
    playerID: 'tanvuu',
    playerName: 'TanVuu',
    caseID: 'FP-002',
    status: 'Demonstration',
    summary:
      'An illustrative dossier for evaluating a reusable appeal portal with fictional review scores.',
    criteria: [
      {
        criterion: 'procedure',
        label: 'Procedural Review',
        referenceScore: 85,
        observedScore: 70,
      },
      {
        criterion: 'documentation',
        label: 'Documentation Quality',
        referenceScore: 80,
        observedScore: 80,
      },
      {
        criterion: 'consistency',
        label: 'Evaluation Consistency',
        referenceScore: 90,
        observedScore: 75,
      },
    ],
  },
]

export function createInitialStore(nowMs) {
  return {
    version: 1,
    dossiers: dossierTemplates.map((dossier) => ({
      ...dossier,
      openedAtMs: nowMs,
      deadlineMs: nowMs + SLA_DURATION_MS,
    })),
    appeals: [],
  }
}