export interface TypeAssessmentDTO {
  id: string;
  createdDate: Date;
  status: number | null;
  nameTypeAssessment: string;
  startValue: string | null;
  endValue: string | null;
  idUnit: string | null;
}
