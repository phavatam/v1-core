import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { CategoryStatusDTO } from "@models/categoryStatusDTO";

export const CategoryStatusApisService = createApi({
  reducerPath: "CategoryStatusApisService",
  tagTypes: ["CategoryStatusApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListCategoryStatus: builder.query<ListResponse<CategoryStatusDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/categoryStatus/getListCategoryStatus`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "CategoryStatusApisService" as const, id })),
            {
              type: "CategoryStatusApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "CategoryStatusApisService", id: "LIST" }];
      }
    }),
    UpdateCategoryStatus: builder.mutation<payloadResult, { CategoryStatus: Partial<CategoryStatusDTO> }>({
      query: ({ CategoryStatus }) => ({
        url: `/categoryStatus/updateCategoryStatus`,
        method: "PUT",
        data: CategoryStatus
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "CategoryStatusApisService", id: arg.CategoryStatus.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.CategoryStatus && arg.CategoryStatus.id) {
          return [{ type: "CategoryStatusApisService", id: arg.CategoryStatus.id }];
        }
        return [];
      }
    }),
    GetCategoryStatusById: builder.query<ListResponse<CategoryStatusDTO>, { idCategoryStatus: string }>({
      query: ({ idCategoryStatus }): any => ({
        url: `/categoryStatus/getCategoryStatusById`,
        params: { idCategoryStatus }
      }),
      providesTags: (result, error, arg) => [{ type: "CategoryStatusApisService", id: arg.idCategoryStatus }]
    }),
    InsertCategoryStatus: builder.mutation<payloadResult, { CategoryStatus: Partial<CategoryStatusDTO> }>({
      query: ({ CategoryStatus }) => ({
        url: `/categoryStatus/insertCategoryStatus`,
        method: "POST",
        data: CategoryStatus
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryStatusApisService", id: "LIST" }] : [])
    }),
    DeleteCategoryStatus: builder.mutation<payloadResult, { idCategoryStatus: string[] }>({
      query: ({ idCategoryStatus }) => ({
        url: `/categoryStatus/deleteCategoryStatus`,
        method: "DELETE",
        data: idCategoryStatus
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryStatusApisService", id: "LIST" }] : [])
    })
  })
});
export const {
  useGetListCategoryStatusQuery,
  useUpdateCategoryStatusMutation,
  useGetCategoryStatusByIdQuery,
  useInsertCategoryStatusMutation,
  useDeleteCategoryStatusMutation
} = CategoryStatusApisService;
