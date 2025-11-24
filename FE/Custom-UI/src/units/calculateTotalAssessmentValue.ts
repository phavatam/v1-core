import { CustomListCriteriasDTO } from "@models/evaluationsCriteriaDTO";

export const calculateTotalAssessmentValue = (children: CustomListCriteriasDTO[]) => {
  let total = 0;
  children.forEach((child) => {
    if (child.children && child.children.length > 0) {
      total += calculateTotalAssessmentValue(child.children);
    } else {
      total += child.assessmentValue || child.startValue!;
    }
  });
  return total;
};
