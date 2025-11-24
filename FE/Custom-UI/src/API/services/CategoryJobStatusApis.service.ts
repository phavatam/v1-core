import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { CategoryJobStatusDTO } from "@models/categoryJobStatusDTO";

export const CategoryJobStatusApisService = createApi({
  reducerPath: "CategoryJobStatusApisService",
  tagTypes: ["CategoryJobStatusApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListCategoryJobStatus: builder.query<ListResponse<CategoryJobStatusDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/categoryJobStatus/getListCategoryJobStatus`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "CategoryJobStatusApisService" as const, id })),
            {
              type: "CategoryJobStatusApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "CategoryJobStatusApisService", id: "LIST" }];
      }
    }),
    UpdateCategoryJobStatus: builder.mutation<payloadResult, { CategoryJobStatus: Partial<CategoryJobStatusDTO> }>({
      query: ({ CategoryJobStatus }) => ({
        url: `/categoryJobStatus/updateCategoryJobStatus`,
        method: "PUT",
        data: CategoryJobStatus
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "CategoryJobStatusApisService", id: arg.CategoryJobStatus.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.CategoryJobStatus && arg.CategoryJobStatus.id) {
          return [{ type: "CategoryJobStatusApisService", id: arg.CategoryJobStatus.id }];
        }
        return [];
      }
    }),
    GetCategoryJobStatusById: builder.query<ListResponse<CategoryJobStatusDTO>, { idCategoryJobStatus: string }>({
      query: ({ idCategoryJobStatus }): any => ({
        url: `/categoryJobStatus/getCategoryJobStatusById`,
        params: { idCategoryJobStatus }
      }),
      providesTags: (result, error, arg) => [{ type: "CategoryJobStatusApisService", id: arg.idCategoryJobStatus }]
    }),
    InsertCategoryJobStatus: builder.mutation<payloadResult, { CategoryJobStatus: Partial<CategoryJobStatusDTO> }>({
      query: ({ CategoryJobStatus }) => ({
        url: `/categoryJobStatus/insertCategoryJobStatus`,
        method: "POST",
        data: CategoryJobStatus
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryJobStatusApisService", id: "LIST" }] : [])
    }),
    DeleteCategoryJobStatus: builder.mutation<payloadResult, { idCategoryJobStatus: string[] }>({
      query: ({ idCategoryJobStatus }) => ({
        url: `/categoryJobStatus/deleteCategoryJobStatus`,
        method: "DELETE",
        data: idCategoryJobStatus
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryJobStatusApisService", id: "LIST" }] : [])
    })
  })
});
export const {
  useGetListCategoryJobStatusQuery,
  useUpdateCategoryJobStatusMutation,
  useGetCategoryJobStatusByIdQuery,
  useInsertCategoryJobStatusMutation,
  useDeleteCategoryJobStatusMutation
} = CategoryJobStatusApisService;
