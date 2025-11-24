/* eslint-disable @typescript-eslint/ban-types */
export interface EvaluationsCriteriaDTO {
  id: string;
  createdDate: Date;
  status: number | null;
  idEvaluations: string | null;
  idCategoryCriteria: string | null;
}

export interface CustomResponseEvaluationsCriteriaDTO {
  idEvaluation: string | null;
  nameEvaluations: string | null;
  numberOfSupervisors: number | 0;
  listCriterias: CustomListCriteriasDTO[];
  listSupervisors: CustomListSupervisorEvaluationDTO[];
}

export interface CustomListCriteriasDTO {
  idEvaluationsDetailsPersonal: string;
  idEvaluationsCriteria: string;
  idCategoryCriteria: string;
  nameCriteria: string | null;
  idParent: string | null;
  startValue: number | null;
  endValue: number | null;
  assessmentValue: number | null;
  assessmentValueSupervisor: number | null;
  children: CustomListCriteriasDTO[];
  supervisorEvaluations: SupervisorEvaluationsDTO[];
  isDistinct: boolean | null;
}

export interface CustomListSupervisorEvaluationDTO {
  idUser: string;
}

export interface SupervisorEvaluationsDTO {
  idEvaluationsSupervisor: string;
  assessmentValueSupervisor: number | null;
}

export interface CriteriaInEvaluationsOfUserDTO {
  idEvaluationsCriteria: string;
  idCategoryCriteria: string;
  assessmentValue: number | null;
}

export interface ListCriteriaInEvaluationsOfUserDTO {
  idEvaluations: string;
  status: number | null;
  listCriteriaInEvaluationsOfUser?: CriteriaInEvaluationsOfUserDTO[];
  listEvaluationsAAE?: {};
}

export interface CriteriaInEvaluationsOfSupervisorDTO {
  idEvaluationsDetailsPersonal: string;
  assessmentValueSupervisor: number | null;
}

export interface ListCriteriaInEvaluationsOfSupervisorDTO {
  idEvaluations: string;
  idUser: string;
  status: number | null;
  listCriteriaInEvaluationsOfSupervisor?: CriteriaInEvaluationsOfSupervisorDTO[];
  listEvaluationsAAE?: {};
}

export interface CustomUpdateSortEvaluationsCriteriaDTO {
  idEvaluations: string;
  listCategoryCriteria: ListCategoryCriteriaDTO[];
}

export interface ListCategoryCriteriaDTO {
  idCategoryCriteria: string;
  sort: number;
}
