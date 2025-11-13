import { CustomListCriteriasDTO } from "@models/evaluationsCriteriaDTO";
import { calculateTotalAssessmentValueDynamic } from "@units/calculateTotalAssessmentValueDynamic";

export const getTotalAssessmentValueSupervisorDynamic = (data: CustomListCriteriasDTO[], index: number) => {
  let total = 0;
  data.forEach((item) => {
    if (item.children && item.children.length > 0) {
      total += calculateTotalAssessmentValueDynamic(item.children, index);
    } else {
      total += item.supervisorEvaluations[index].assessmentValueSupervisor || item.startValue!;
    }
  });
  return total;
};
