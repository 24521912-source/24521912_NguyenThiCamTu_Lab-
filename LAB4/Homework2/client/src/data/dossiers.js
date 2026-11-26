export const dossiers = [
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
      'An illustrative dossier for evaluating the behavior of a reusable appeal portal with a different set of fictional review scores.',
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

export function getDossierByPlayerID(playerID) {
  return dossiers.find(
    (dossier) => dossier.playerID === playerID
  ) ?? null
}