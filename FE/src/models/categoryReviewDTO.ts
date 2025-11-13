export interface CategoryReviewDTO {
  id: string;
  createdDate: Date;
  title: string | null;
  nameReview: string | null;
  isHide: boolean | null;
  idUser: string | null;
  sort: number | null;
}
