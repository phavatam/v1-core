export interface EvaluationsOfUserDTO {
  id: string;
  nameEvaluations: string | null;
  idCategoryTimeType: string | null;
  fromDate: Date;
  toDate: Date;
  status: number | null;
  messageStatus: string | null;
  advantages: string | null;
  disAdvantages: string | null;
  idUnit: string | null;
  addReviews: string | null;
}

export interface EvaluationsDTO extends EvaluationsOfUserDTO {
  createdDate: Date;
  idCategoryTimeType: string | null;
}

export interface EvaluationsListDTO {
  id: string | null;
  createdDate: Date;
  status: number | null;
  nameEvaluations: string | null;
  listIdsUnit: [] | null;
  idUser: string | null;
  isPrincipal: boolean | null;
}

export interface EvaluationsOfSupervisorDTO {
  id: string;
  idCategoryTimeType: string;
  idUnit: string;
  idEvaluationsDetailsPersonal: string;
  idUser: string;
  nameEvaluations: string | null;
  timeTypeName: string | null;
  unitName: string | null;
  fullName: string | null;
  userCode: string | null;
  period: number | null;
  fromDate: Date;
  toDate: Date;
  isRepeat: boolean | null;
  status: number | null;
}

export interface CategoryTimeTypeToEvaluations {
  listIdEvaluations: string[] | null;
  idCategoryTimeType: string | null;
}
