export interface CategoryGradingDTO {
  id: string;
  createdDate: Date | null;
  status: number | null;
  fromValue: number | null;
  toValue: number | null;
  nameGrading: string;
  isActive: boolean | null;
}
