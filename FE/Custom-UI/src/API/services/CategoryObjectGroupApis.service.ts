import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { CategoryObjectGroupDTO } from "@models/categoryObjectGroupDTO";

export const CategoryObjectGroupApisService = createApi({
  reducerPath: "CategoryObjectGroupApisService",
  tagTypes: ["CategoryObjectGroupApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListCategoryObjectGroup: builder.query<ListResponse<CategoryObjectGroupDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/categoryObjectGroup/getListCategoryObjectGroup`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "CategoryObjectGroupApisService" as const, id })),
            {
              type: "CategoryObjectGroupApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "CategoryObjectGroupApisService", id: "LIST" }];
      }
    }),
    UpdateCategoryObjectGroup: builder.mutation<
      payloadResult,
      { CategoryObjectGroup: Partial<CategoryObjectGroupDTO> }
    >({
      query: ({ CategoryObjectGroup }) => ({
        url: `/categoryObjectGroup/updateCategoryObjectGroup`,
        method: "PUT",
        data: CategoryObjectGroup
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "CategoryObjectGroupApisService", id: arg.CategoryObjectGroup.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.CategoryObjectGroup && arg.CategoryObjectGroup.id) {
          return [{ type: "CategoryObjectGroupApisService", id: arg.CategoryObjectGroup.id }];
        }
        return [];
      }
    }),
    GetCategoryObjectGroupById: builder.query<ListResponse<CategoryObjectGroupDTO>, { idCategoryObjectGroup: string }>({
      query: ({ idCategoryObjectGroup }): any => ({
        url: `/categoryObjectGroup/getCategoryObjectGroupById`,
        params: { idCategoryObjectGroup }
      }),
      providesTags: (result, error, arg) => [{ type: "CategoryObjectGroupApisService", id: arg.idCategoryObjectGroup }]
    }),
    InsertCategoryObjectGroup: builder.mutation<
      payloadResult,
      { CategoryObjectGroup: Partial<CategoryObjectGroupDTO> }
    >({
      query: ({ CategoryObjectGroup }) => ({
        url: `/categoryObjectGroup/insertCategoryObjectGroup`,
        method: "POST",
        data: CategoryObjectGroup
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryObjectGroupApisService", id: "LIST" }] : [])
    }),
    DeleteCategoryObjectGroup: builder.mutation<payloadResult, { idCategoryObjectGroup: string[] }>({
      query: ({ idCategoryObjectGroup }) => ({
        url: `/categoryObjectGroup/deleteCategoryObjectGroup`,
        method: "DELETE",
        data: idCategoryObjectGroup
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategoryObjectGroupApisService", id: "LIST" }] : [])
    })
  })
});
export const {
  useGetListCategoryObjectGroupQuery,
  useUpdateCategoryObjectGroupMutation,
  useGetCategoryObjectGroupByIdQuery,
  useInsertCategoryObjectGroupMutation,
  useDeleteCategoryObjectGroupMutation
} = CategoryObjectGroupApisService;
