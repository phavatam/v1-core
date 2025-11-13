import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { CategorySourcePlanningDTO } from "@models/categorySourcePlanningDTO";

export const CategorySourcePlanningApisService = createApi({
  reducerPath: "CategorySourcePlanningApisService",
  tagTypes: ["CategorySourcePlanningApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListCategorySourcePlanning: builder.query<ListResponse<CategorySourcePlanningDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/categorySourcePlanning/getListCategorySourcePlanning`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "CategorySourcePlanningApisService" as const, id })),
            {
              type: "CategorySourcePlanningApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "CategorySourcePlanningApisService", id: "LIST" }];
      }
    }),
    UpdateCategorySourcePlanning: builder.mutation<
      payloadResult,
      { CategorySourcePlanning: Partial<CategorySourcePlanningDTO> }
    >({
      query: ({ CategorySourcePlanning }) => ({
        url: `/categorySourcePlanning/updateCategorySourcePlanning`,
        method: "PUT",
        data: CategorySourcePlanning
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "CategorySourcePlanningApisService", id: arg.CategorySourcePlanning.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.CategorySourcePlanning && arg.CategorySourcePlanning.id) {
          return [{ type: "CategorySourcePlanningApisService", id: arg.CategorySourcePlanning.id }];
        }
        return [];
      }
    }),
    GetCategorySourcePlanningById: builder.query<
      ListResponse<CategorySourcePlanningDTO>,
      { idCategorySourcePlanning: string }
    >({
      query: ({ idCategorySourcePlanning }): any => ({
        url: `/categorySourcePlanning/getCategorySourcePlanningById`,
        params: { idCategorySourcePlanning }
      }),
      providesTags: (result, error, arg) => [
        { type: "CategorySourcePlanningApisService", id: arg.idCategorySourcePlanning }
      ]
    }),
    InsertCategorySourcePlanning: builder.mutation<
      payloadResult,
      { CategorySourcePlanning: Partial<CategorySourcePlanningDTO> }
    >({
      query: ({ CategorySourcePlanning }) => ({
        url: `/categorySourcePlanning/insertCategorySourcePlanning`,
        method: "POST",
        data: CategorySourcePlanning
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategorySourcePlanningApisService", id: "LIST" }] : [])
    }),
    DeleteCategorySourcePlanning: builder.mutation<payloadResult, { idCategorySourcePlanning: string[] }>({
      query: ({ idCategorySourcePlanning }) => ({
        url: `/categorySourcePlanning/deleteCategorySourcePlanning`,
        method: "DELETE",
        data: idCategorySourcePlanning
      }),
      invalidatesTags: (result) => (result ? [{ type: "CategorySourcePlanningApisService", id: "LIST" }] : [])
    })
  })
});
export const {
  useGetListCategorySourcePlanningQuery,
  useUpdateCategorySourcePlanningMutation,
  useGetCategorySourcePlanningByIdQuery,
  useInsertCategorySourcePlanningMutation,
  useDeleteCategorySourcePlanningMutation
} = CategorySourcePlanningApisService;
