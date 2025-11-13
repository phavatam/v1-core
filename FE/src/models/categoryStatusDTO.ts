export interface CategoryStatusDTO {
  id: string;
  createdDate: Date;
  status: number | null;
  statusName: string | null;
  isHide: boolean | null;
}
