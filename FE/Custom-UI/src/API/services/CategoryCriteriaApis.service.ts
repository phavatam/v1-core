import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { CategoryCriteriaDTO } from "@models/categoryCriteriaDTO";

export const CategoryCriteriaApisService = createApi({
  reducerPath: "CategoryCriteriaApisService",
  tagTypes: ["CategoryCriteriaApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListCategoryCriteria: builder.query<ListResponse<CategoryCriteriaDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/categoryCriteria/getListCategoryCriteria`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "CategoryCriteriaApisService" as const, id })),
            {
              type: "CategoryCriteriaApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "CategoryCriteriaApisService", id: "LIST" }];
      }
    }),
    GetListCategoryCriteriaAvailable: builder.query<ListResponse<CategoryCriteriaDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/categoryCriteria/getListCategoryCriteriaAvailable`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "CategoryCriteriaApisService" as const, id })),
            {
              type: "CategoryCriteriaApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "CategoryCriteriaApisService", id: "LIST" }];
      }
    }),
    UpdateCategoryCriteria: builder.mutation<payloadResult, { CategoryCriteria: Partial<CategoryCriteriaDTO> }>({
      query: ({ CategoryCriteria }) => ({
        url: `/categoryCriteria/updateCategoryCriteria`,
        method: "PUT",
        data: CategoryCriteria
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "CategoryCriteriaApisService", id: arg.CategoryCriteria.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.CategoryCriteria && arg.CategoryCriteria.id) {
          return [{ type: "CategoryCriteriaApisService", id: arg.CategoryCriteria.id }];
        }
        return [];
      }
    }),
    GetCategoryCriteriaById: builder.query<ListResponse<CategoryCriteriaDTO>, { idCategoryCriteria: string }>({
      query: ({ idCategoryCriteria }): any => ({
        url: `/categoryCriteria/getCategoryCriteriaById`,
        params: { idCategoryCriteria }
      }),
      providesTags: (result, error, arg) => [{ type: "CategoryCriteriaApisService", id: arg.idCategoryCriteria }]
    }),
    InsertCategoryCriteria: builder.mutation<payloadResult, { CategoryCriteria: Partial<CategoryCriteriaDTO> }>({
      query: ({ CategoryCriteria }) => ({
        url: `/categoryCriteria/insertCategoryCriteria`,
        method: "POST",
        data: CategoryCriteria
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryCriteriaApisService", id: "LIST" }] : [])
    }),
    DeleteCategoryCriteria: builder.mutation<payloadResult, { idCategoryCriteria: string[] }>({
      query: ({ idCategoryCriteria }) => ({
        url: `/categoryCriteria/deleteCategoryCriteria`,
        method: "DELETE",
        data: idCategoryCriteria
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryCriteriaApisService", id: "LIST" }] : [])
    })
  })
});
export const {
  useGetListCategoryCriteriaQuery,
  useUpdateCategoryCriteriaMutation,
  useGetCategoryCriteriaByIdQuery,
  useInsertCategoryCriteriaMutation,
  useDeleteCategoryCriteriaMutation,
  useGetListCategoryCriteriaAvailableQuery
} = CategoryCriteriaApisService;
