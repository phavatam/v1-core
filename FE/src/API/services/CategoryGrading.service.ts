import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { CategoryGradingDTO } from "@models/CategoryGradingDTO";

export const CategoryGradingApisService = createApi({
  reducerPath: "CategoryGradingApisService",
  tagTypes: ["CategoryGradingApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListCategoryGrading: builder.query<ListResponse<CategoryGradingDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/CategoryGrading/getListCategoryGrading`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "CategoryGradingApisService" as const, id })),
            {
              type: "CategoryGradingApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "CategoryGradingApisService", id: "LIST" }];
      }
    }),
    UpdateCategoryGrading: builder.mutation<payloadResult, { CategoryGrading: Partial<CategoryGradingDTO> }>({
      query: ({ CategoryGrading }) => ({
        url: `/CategoryGrading/updateCategoryGrading`,
        method: "PUT",
        data: CategoryGrading
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "CategoryGradingApisService", id: arg.CategoryGrading.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.CategoryGrading && arg.CategoryGrading.id) {
          return [{ type: "CategoryGradingApisService", id: arg.CategoryGrading.id }];
        }
        return [];
      }
    }),
    GetCategoryGradingById: builder.query<ListResponse<CategoryGradingDTO>, { idCategoryGrading: string }>({
      query: ({ idCategoryGrading }): any => ({
        url: `/CategoryGrading/getCategoryGradingById`,
        params: { idCategoryGrading }
      }),
      providesTags: (result, error, arg) => [{ type: "CategoryGradingApisService", id: arg.idCategoryGrading }]
    }),
    InsertCategoryGrading: builder.mutation<payloadResult, { CategoryGrading: Partial<CategoryGradingDTO> }>({
      query: ({ CategoryGrading }) => ({
        url: `/CategoryGrading/insertCategoryGrading`,
        method: "POST",
        data: CategoryGrading
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryGradingApisService", id: "LIST" }] : [])
    }),
    DeleteCategoryGrading: builder.mutation<payloadResult, { idCategoryGrading: string[] }>({
      query: ({ idCategoryGrading }) => ({
        url: `/CategoryGrading/DeleteCategoryGrading`,
        method: "DELETE",
        data: idCategoryGrading
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryGradingApisService", id: "LIST" }] : [])
    }),
    FindCategoryGrading: builder.query<
      ListResponse<CategoryGradingDTO>,
      { pageSize: number; pageNumber: number; keyword: string }
    >({
      query: ({ pageSize, pageNumber, keyword }: { pageSize: number; pageNumber: number; keyword: string }) => ({
        url: `/CategoryGrading/findCategoryGrading`,
        method: "GET",
        params: { pageSize, pageNumber, keyword }
      })
    })
  })
});
export const {
  useGetListCategoryGradingQuery,
  useUpdateCategoryGradingMutation,
  useGetCategoryGradingByIdQuery,
  useInsertCategoryGradingMutation,
  useDeleteCategoryGradingMutation,
  useLazyFindCategoryGradingQuery
} = CategoryGradingApisService;
