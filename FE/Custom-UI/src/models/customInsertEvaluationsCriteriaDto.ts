export interface CustomInsertEvaluationsCriteriaDTO {
  id: string;
  createdDate: Date;
  status: number | null;
  idEvaluations: string | null;
  listIdCategoryCriteria: string[];
}

export interface CustomInsertEvaluationsCriteriaMultiDTO {
  id: string;
  createdDate: Date;
  status: number | null;
  listIdEvaluations: string[];
  listIdCategoryCriteria: string[];
}
