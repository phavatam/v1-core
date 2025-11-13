import { globalVariable } from "~/globalVariable";

export const getStatisticByIdUser = (IdUser: string) => {
  return `${globalVariable.urlServerApi}/api/v1/ExplaintEvaluation/getStatisticByIdUser?IdUser=${IdUser}`;
};

export const exportWordOfUser = (idEvaluations: string, numberTemplate: number) => {
  return `${globalVariable.urlServerApi}/api/v1/ExplaintEvaluation/exportWordOfUser?idEvaluations=${idEvaluations}&numberTemplate=${numberTemplate}`;
};
