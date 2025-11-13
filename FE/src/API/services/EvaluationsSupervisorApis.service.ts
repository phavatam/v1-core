import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { EvaluationsSupervisorDTO } from "@models/evaluationsSupervisorDTO";

export const EvaluationsSupervisorApisService = createApi({
  reducerPath: "EvaluationsSupervisorApisService",
  tagTypes: ["EvaluationsSupervisorApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListEvaluationsSupervisor: builder.query<ListResponse<EvaluationsSupervisorDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/EvaluationsSupervisor/getListEvaluationsSupervisor`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "EvaluationsSupervisorApisService" as const, id })),
            {
              type: "EvaluationsSupervisorApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "EvaluationsSupervisorApisService", id: "LIST" }];
      }
    }),
    UpdateEvaluationsSupervisor: builder.mutation<
      payloadResult,
      { EvaluationsSupervisor: Partial<EvaluationsSupervisorDTO> }
    >({
      query: ({ EvaluationsSupervisor }) => ({
        url: `/EvaluationsSupervisor/updateEvaluationsSupervisor`,
        method: "PUT",
        data: EvaluationsSupervisor
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "EvaluationsSupervisorApisService", id: arg.EvaluationsSupervisor.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.EvaluationsSupervisor && arg.EvaluationsSupervisor.id) {
          return [{ type: "EvaluationsSupervisorApisService", id: arg.EvaluationsSupervisor.id }];
        }
        return [];
      }
    }),
    GetEvaluationsSupervisorById: builder.query<
      ListResponse<EvaluationsSupervisorDTO>,
      { idEvaluationsSupervisor: string }
    >({
      query: ({ idEvaluationsSupervisor }): any => ({
        url: `/EvaluationsSupervisor/getEvaluationsSupervisorById`,
        params: { idEvaluationsSupervisor }
      }),
      providesTags: (result, error, arg) => [
        { type: "EvaluationsSupervisorApisService", id: arg.idEvaluationsSupervisor }
      ]
    }),
    GetEvaluationsSupervisorByIdEvaluations: builder.query<
      ListResponse<EvaluationsSupervisorDTO>,
      { idEvaluations: string; pageSize: number; pageNumber: number }
    >({
      query: ({ idEvaluations, pageSize, pageNumber }): any => ({
        url: `/EvaluationsSupervisor/getListEvaluationsSupervisorByIdEvaluations`,
        params: { idEvaluations, pageSize, pageNumber }
      }),
      providesTags: (result, error, arg) => [{ type: "EvaluationsSupervisorApisService", id: arg.idEvaluations }]
    }),
    InsertEvaluationsSupervisor: builder.mutation<
      payloadResult,
      { EvaluationsSupervisor: Partial<EvaluationsSupervisorDTO> }
    >({
      query: ({ EvaluationsSupervisor }) => ({
        url: `/EvaluationsSupervisor/insertEvaluationsSupervisor`,
        method: "POST",
        data: EvaluationsSupervisor
      }),
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsSupervisorApisService", id: "LIST" }] : [])
    }),
    DeleteEvaluationsSupervisor: builder.mutation<payloadResult, { idEvaluationsSupervisor: string[] }>({
      query: ({ idEvaluationsSupervisor }) => ({
        url: `/EvaluationsSupervisor/DeleteEvaluationsSupervisor`,
        method: "DELETE",
        data: idEvaluationsSupervisor
      }),
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsSupervisorApisService", id: "LIST" }] : [])
    })
  })
});
export const {
  useGetListEvaluationsSupervisorQuery,
  useUpdateEvaluationsSupervisorMutation,
  useGetEvaluationsSupervisorByIdQuery,
  useInsertEvaluationsSupervisorMutation,
  useDeleteEvaluationsSupervisorMutation,
  useGetEvaluationsSupervisorByIdEvaluationsQuery,
  useLazyGetEvaluationsSupervisorByIdQuery
} = EvaluationsSupervisorApisService;
