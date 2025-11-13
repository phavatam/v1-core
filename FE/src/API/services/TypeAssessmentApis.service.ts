import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { TypeAssessmentDTO } from "@models/typeAssessmentDTO";

export const TypeAssessmentApisService = createApi({
  reducerPath: "TypeAssessmentApisService",
  tagTypes: ["TypeAssessmentApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListTypeAssessment: builder.query<ListResponse<TypeAssessmentDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/typeAssessment/getListTypeAssessment`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "TypeAssessmentApisService" as const, id })),
            {
              type: "TypeAssessmentApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "TypeAssessmentApisService", id: "LIST" }];
      }
    }),
    UpdateTypeAssessment: builder.mutation<payloadResult, { TypeAssessment: Partial<TypeAssessmentDTO> }>({
      query: ({ TypeAssessment }) => ({
        url: `/typeAssessment/updateTypeAssessment`,
        method: "PUT",
        data: TypeAssessment
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "TypeAssessmentApisService", id: arg.TypeAssessment.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.TypeAssessment && arg.TypeAssessment.id) {
          return [{ type: "TypeAssessmentApisService", id: arg.TypeAssessment.id }];
        }
        return [];
      }
    }),
    GetTypeAssessmentById: builder.query<ListResponse<TypeAssessmentDTO>, { idTypeAssessment: string }>({
      query: ({ idTypeAssessment }): any => ({
        url: `/typeAssessment/getTypeAssessmentById`,
        params: { idTypeAssessment }
      }),
      providesTags: (result, error, arg) => [{ type: "TypeAssessmentApisService", id: arg.idTypeAssessment }]
    }),
    InsertTypeAssessment: builder.mutation<payloadResult, { TypeAssessment: Partial<TypeAssessmentDTO> }>({
      query: ({ TypeAssessment }) => ({
        url: `/typeAssessment/insertTypeAssessment`,
        method: "POST",
        data: TypeAssessment
      }),
      invalidatesTags: (result) => (result ? [{ type: "TypeAssessmentApisService", id: "LIST" }] : [])
    }),
    DeleteTypeAssessment: builder.mutation<payloadResult, { idTypeAssessment: string[] }>({
      query: ({ idTypeAssessment }) => ({
        url: `/typeAssessment/deleteTypeAssessment`,
        method: "DELETE",
        data: idTypeAssessment
      }),
      invalidatesTags: (result) => (result ? [{ type: "TypeAssessmentApisService", id: "LIST" }] : [])
    }),
    FindTypeAssessment: builder.query<
      ListResponse<TypeAssessmentDTO>,
      { pageSize: number; pageNumber: number; keyword: string }
    >({
      query: ({ pageSize, pageNumber, keyword }: { pageSize: number; pageNumber: number; keyword: string }) => ({
        url: `/TypeAssessment/findTypeAssessment`,
        method: "GET",
        params: { pageSize, pageNumber, keyword }
      })
    })
  })
});
export const {
  useGetListTypeAssessmentQuery,
  useUpdateTypeAssessmentMutation,
  useGetTypeAssessmentByIdQuery,
  useInsertTypeAssessmentMutation,
  useDeleteTypeAssessmentMutation,
  useLazyFindTypeAssessmentQuery
} = TypeAssessmentApisService;
