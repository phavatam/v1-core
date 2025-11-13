import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { CategoryReviewDTO } from "@models/categoryReviewDTO";

export const CategoryReviewApisService = createApi({
  reducerPath: "CategoryReviewApisService",
  tagTypes: ["CategoryReviewApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListCategoryReview: builder.query<ListResponse<CategoryReviewDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/categoryReview/getListCategoryReview`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "CategoryReviewApisService" as const, id })),
            {
              type: "CategoryReviewApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "CategoryReviewApisService", id: "LIST" }];
      }
    }),
    FindCategoryReview: builder.query<
      ListResponse<CategoryReviewDTO>,
      { pageSize: number; pageNumber: number; keyword: string }
    >({
      query: ({ pageSize, pageNumber, keyword }: { pageSize: number; pageNumber: number; keyword: string }) => ({
        url: `/categoryReview/findCategoryReview`,
        method: "GET",
        params: { pageSize, pageNumber, keyword }
      })
    }),
    UpdateCategoryReview: builder.mutation<payloadResult, { CategoryReview: Partial<CategoryReviewDTO> }>({
      query: ({ CategoryReview }) => ({
        url: `/categoryReview/updateCategoryReview`,
        method: "PUT",
        data: CategoryReview
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "CategoryAssessmentTypeApisService", id: arg.CategoryAssessmentType.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.CategoryReview && arg.CategoryReview.id) {
          return [{ type: "CategoryReviewApisService", id: arg.CategoryReview.id }];
        }
        return [];
      }
    }),
    GetCategoryReviewById: builder.query<ListResponse<CategoryReviewDTO>, { idCategoryReview: string }>({
      query: ({ idCategoryReview }): any => ({
        url: `/categoryReview/getCategoryReviewById`,
        params: { idCategoryReview }
      }),
      providesTags: (result, error, arg) => [{ type: "CategoryReviewApisService", id: arg.idCategoryReview }]
    }),
    InsertCategoryReview: builder.mutation<payloadResult, { CategoryReview: Partial<CategoryReviewDTO> }>({
      query: ({ CategoryReview }) => ({
        url: `/categoryReview/insertCategoryReview`,
        method: "POST",
        data: CategoryReview
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryReviewApisService", id: "LIST" }] : [])
    }),
    DeleteCategoryReview: builder.mutation<payloadResult, { idCategoryReview: string[] }>({
      query: ({ idCategoryReview }) => ({
        url: `/categoryReview/deleteCategoryReview`,
        method: "DELETE",
        data: idCategoryReview
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryReviewApisService", id: "LIST" }] : [])
    })
  })
});
export const {
  useGetListCategoryReviewQuery,
  useUpdateCategoryReviewMutation,
  useGetCategoryReviewByIdQuery,
  useInsertCategoryReviewMutation,
  useDeleteCategoryReviewMutation,
  useLazyFindCategoryReviewQuery
} = CategoryReviewApisService;
