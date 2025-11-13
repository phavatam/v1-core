export interface EvaluationsDetailsPersonalDTO {
  id: string;
  createdDate: Date;
  status: number | null;
  idEvaluations: string | null;
  idUser: string | null;
  idEvaluationsCriteria: string | null;
  assessmentValue: number | null;
}
