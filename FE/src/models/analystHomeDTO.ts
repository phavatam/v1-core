export interface AnalystHomeDTO {
  totalEvaluations: number;
  totalUser: number;
  totalUnit: number;
  totalEvaluationsPendingOfUser: number;
  listAnalystEvaluationsPending: AnalystEvaluationsPendingDTO[];
  listAnalystEvaluationsCompleted: AnalystEvaluationsCompletedDTO[];
}

interface AnalystEvaluationsPendingDTO {
  idEvaluations: string;
  nameEvaluations: string;
  unitName: string;
  totalEvaluationsPending: number;
}

interface AnalystEvaluationsCompletedDTO {
  idEvaluations: string;
  nameEvaluations: string;
  unitName: string;
  totalEvaluationsCompleted: number;
}
