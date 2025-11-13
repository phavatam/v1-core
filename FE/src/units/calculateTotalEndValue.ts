import { CustomListCriteriasDTO } from "@models/evaluationsCriteriaDTO";

export const calculateTotalEndValue = (children: CustomListCriteriasDTO[]): number => {
  let total = 0;

  children.forEach((child) => {
    if (child.children && child.children.length > 0) {
      if (child.isDistinct) {
        // Khi isDistinct = true, tính giá trị endValue lớn nhất trong các phần tử con
        const maxEndValue = child.children.reduce((maxValue, currentItem) => {
          const currentEndValue = currentItem.endValue ?? 0;
          return currentEndValue > maxValue ? currentEndValue : maxValue;
        }, 0);

        // Thêm giá trị endValue lớn nhất vào tổng
        total += maxEndValue;
      } else {
        // Khi isDistinct = false, tính tổng endValue của tất cả các children
        total += calculateTotalEndValue(child.children);
      }
    } else {
      // Nếu không có children, thêm endValue của child vào tổng
      total += child.endValue ?? 0;
    }
  });

  return total;
};
