export interface CategoryJobStatusDTO {
  id: string;
  createdDate: Date;
  status: number | null;
  jobStatusName: string | null;
  isHide: boolean | null;
}
