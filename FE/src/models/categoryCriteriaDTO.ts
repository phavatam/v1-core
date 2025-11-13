export interface CategoryCriteriaDTO {
  id: string;
  createdDate: Date;
  status: number | null;
  nameCriteria: string;
  idParent: string | null;
  idUnit: string | null;
  isHide: boolean | null;
  idTypeAssessment: string | null;
  sort: number | null;
  children: CategoryCriteriaDTO[];
  isDistinct: boolean | null;
}
