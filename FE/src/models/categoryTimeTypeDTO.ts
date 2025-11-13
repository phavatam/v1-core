export interface CategoryTimeTypeDTO {
  id: string;
  idUnit: string;
  createdDate: Date;
  status: number | null;
  timeTypeName: string | null;
  isHide: boolean | null;
  isRepeat: boolean | null;
  fromDate: Date;
  toDate: Date;
  period: number | null;
}
