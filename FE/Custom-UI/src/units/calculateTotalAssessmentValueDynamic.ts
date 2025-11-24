import { CustomListCriteriasDTO } from "@models/evaluationsCriteriaDTO";

export const calculateTotalAssessmentValueDynamic = (children: CustomListCriteriasDTO[], index: number) => {
  let total = 0;
  children.forEach((child) => {
    if (child.children && child.children.length > 0) {
      total += calculateTotalAssessmentValueDynamic(child.children, index);
    } else {
      total += child.supervisorEvaluations[index].assessmentValueSupervisor || 0;
    }
  });
  return total;
};
