import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { CategoryTimeTypeDTO } from "@models/categoryTimeTypeDTO";

export const CategoryTimeTypeApisService = createApi({
  reducerPath: "CategoryTimeTypeApisService",
  tagTypes: ["CategoryTimeTypeApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListCategoryTimeType: builder.query<ListResponse<CategoryTimeTypeDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/categoryTimeType/getListCategoryTimeType`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "CategoryTimeTypeApisService" as const, id })),
            {
              type: "CategoryTimeTypeApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "CategoryTimeTypeApisService", id: "LIST" }];
      }
    }),
    GetListCategoryTimeTypeAvailable: builder.query<ListResponse<CategoryTimeTypeDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/categoryTimeType/getListCategoryTimeTypeAvailable`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "CategoryTimeTypeApisService" as const, id })),
            {
              type: "CategoryTimeTypeApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "CategoryTimeTypeApisService", id: "LIST" }];
      }
    }),
    UpdateCategoryTimeType: builder.mutation<payloadResult, { CategoryTimeType: Partial<CategoryTimeTypeDTO> }>({
      query: ({ CategoryTimeType }) => ({
        url: `/categoryTimeType/updateCategoryTimeType`,
        method: "PUT",
        data: CategoryTimeType
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "CategoryTimeTypeApisService", id: arg.categoryTimeType.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.CategoryTimeType && arg.CategoryTimeType.id) {
          return [{ type: "CategoryTimeTypeApisService", id: arg.CategoryTimeType.id }];
        }
        return [];
      }
    }),
    GetCategoryTimeTypeById: builder.query<ListResponse<CategoryTimeTypeDTO>, { idCategoryTimeType: string }>({
      query: ({ idCategoryTimeType }): any => ({
        url: `/categoryTimeType/getCategoryTimeTypeById`,
        params: { idCategoryTimeType }
      }),
      providesTags: (result, error, arg) => [{ type: "CategoryTimeTypeApisService", id: arg.idCategoryTimeType }]
    }),
    InsertCategoryTimeType: builder.mutation<payloadResult, { CategoryTimeType: Partial<CategoryTimeTypeDTO> }>({
      query: ({ CategoryTimeType }) => ({
        url: `/categoryTimeType/insertCategoryTimeType`,
        method: "POST",
        data: CategoryTimeType
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryTimeTypeApisService", id: "LIST" }] : [])
    }),
    DeleteCategoryTimeType: builder.mutation<payloadResult, { idCategoryTimeType: string[] }>({
      query: ({ idCategoryTimeType }) => ({
        url: `/categoryTimeType/deleteCategoryTimeType`,
        method: "DELETE",
        data: idCategoryTimeType
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryTimeTypeApisService", id: "LIST" }] : [])
    }),
    FindCategoryTimeType: builder.query<
      ListResponse<CategoryTimeTypeDTO>,
      { pageSize: number; pageNumber: number; keyword: string }
    >({
      query: ({ pageSize, pageNumber, keyword }: { pageSize: number; pageNumber: number; keyword: string }) => ({
        url: `/CategoryTimeType/findCategoryTimeType`,
        method: "GET",
        params: { pageSize, pageNumber, keyword }
      })
    })
  })
});
export const {
  useGetListCategoryTimeTypeQuery,
  useUpdateCategoryTimeTypeMutation,
  useGetCategoryTimeTypeByIdQuery,
  useInsertCategoryTimeTypeMutation,
  useDeleteCategoryTimeTypeMutation,
  useGetListCategoryTimeTypeAvailableQuery,
  useLazyFindCategoryTimeTypeQuery
} = CategoryTimeTypeApisService;
