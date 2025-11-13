import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { CategoryAssessmentTypeDTO } from "@models/categoryAssessmentTypeDTO";

export const CategoryAssessmentTypeApisService = createApi({
  reducerPath: "CategoryAssessmentTypeApisService",
  tagTypes: ["CategoryAssessmentTypeApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListCategoryAssessmentType: builder.query<ListResponse<CategoryAssessmentTypeDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/categoryAssessmentType/getListCategoryAssessmentType`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "CategoryAssessmentTypeApisService" as const, id })),
            {
              type: "CategoryAssessmentTypeApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "CategoryAssessmentTypeApisService", id: "LIST" }];
      }
    }),
    FindCategoryAssessmentType: builder.query<
      ListResponse<CategoryAssessmentTypeDTO>,
      { pageSize: number; pageNumber: number; keyword: string }
    >({
      query: ({ pageSize, pageNumber, keyword }: { pageSize: number; pageNumber: number; keyword: string }) => ({
        url: `/categoryAssessmentType/findCategoryAssessmentType`,
        method: "GET",
        params: { pageSize, pageNumber, keyword }
      })
    }),
    UpdateCategoryAssessmentType: builder.mutation<
      payloadResult,
      { CategoryAssessmentType: Partial<CategoryAssessmentTypeDTO> }
    >({
      query: ({ CategoryAssessmentType }) => ({
        url: `/categoryAssessmentType/updateCategoryAssessmentType`,
        method: "PUT",
        data: CategoryAssessmentType
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "CategoryAssessmentTypeApisService", id: arg.CategoryAssessmentType.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.CategoryAssessmentType && arg.CategoryAssessmentType.id) {
          return [{ type: "CategoryAssessmentTypeApisService", id: arg.CategoryAssessmentType.id }];
        }
        return [];
      }
    }),
    GetCategoryAssessmentTypeById: builder.query<
      ListResponse<CategoryAssessmentTypeDTO>,
      { idCategoryAssessmentType: string }
    >({
      query: ({ idCategoryAssessmentType }): any => ({
        url: `/categoryAssessmentType/getCategoryAssessmentTypeById`,
        params: { idCategoryAssessmentType }
      }),
      providesTags: (result, error, arg) => [
        { type: "CategoryAssessmentTypeApisService", id: arg.idCategoryAssessmentType }
      ]
    }),
    InsertCategoryAssessmentType: builder.mutation<
      payloadResult,
      { CategoryAssessmentType: Partial<CategoryAssessmentTypeDTO> }
    >({
      query: ({ CategoryAssessmentType }) => ({
        url: `/categoryAssessmentType/insertCategoryAssessmentType`,
        method: "POST",
        data: CategoryAssessmentType
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryAssessmentTypeApisService", id: "LIST" }] : [])
    }),
    DeleteCategoryAssessmentType: builder.mutation<payloadResult, { idCategoryAssessmentType: string[] }>({
      query: ({ idCategoryAssessmentType }) => ({
        url: `/categoryAssessmentType/deleteCategoryAssessmentType`,
        method: "DELETE",
        data: idCategoryAssessmentType
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryAssessmentTypeApisService", id: "LIST" }] : [])
    })
  })
});
export const {
  useGetListCategoryAssessmentTypeQuery,
  useUpdateCategoryAssessmentTypeMutation,
  useGetCategoryAssessmentTypeByIdQuery,
  useInsertCategoryAssessmentTypeMutation,
  useDeleteCategoryAssessmentTypeMutation,
  useLazyFindCategoryAssessmentTypeQuery
} = CategoryAssessmentTypeApisService;
