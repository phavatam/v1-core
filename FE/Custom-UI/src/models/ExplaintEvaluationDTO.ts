export interface ExplaintEvaluationDTO {
  id: string;
  note: string;
  fileAttachments: string;
  idEvaluations?: string;
  idUser?: string;
  status?: number;
  createdDate?: Date;
}
