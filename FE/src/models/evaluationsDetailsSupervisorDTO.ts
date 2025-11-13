export interface EvaluationsDetailsSupervisorDTO {
  id: string;
  createdDate: Date;
  status: number | null;
  idEvaluations: string | null;
  idEvaluationsDetailsPersonal: string | null;
  idUserSupervisor: string | null;
  assessmentValueSupervisor: number | null;
  tokenSign: string | null;
  avatarSign: string | null;
}
