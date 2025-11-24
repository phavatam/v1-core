import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import {
  CategoryTimeTypeToEvaluations,
  EvaluationsDTO,
  EvaluationsListDTO,
  EvaluationsOfSupervisorDTO,
  EvaluationsOfUserDTO
} from "@models/evaluationsDTO";
import { AnalystHomeDTO } from "@models/analystHomeDTO";
import { globalVariable } from "~/globalVariable";
import axios from "axios";
import { getCookie } from "~/units";

export const EvaluationsApisService = createApi({
  reducerPath: "EvaluationsApisService",
  tagTypes: ["EvaluationsApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListEvaluations: builder.query<ListResponse<EvaluationsDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/evaluations/getListEvaluations`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "EvaluationsApisService" as const, id })),
            {
              type: "EvaluationsApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "EvaluationsApisService", id: "LIST" }];
      }
    }),
    GetListEvaluationsConsolidationAndTransfer: builder.query<ListResponse<EvaluationsDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/evaluations/getListEvaluationsConsolidationAndTransfer`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "EvaluationsApisService" as const, id })),
            {
              type: "EvaluationsApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "EvaluationsApisService", id: "LIST" }];
      }
    }),
    GetListEvaluationsOfUser: builder.query<ListResponse<EvaluationsOfUserDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/evaluations/getListEvaluationsOfUser`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "EvaluationsApisService" as const, id })),
            {
              type: "EvaluationsApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "EvaluationsApisService", id: "LIST" }];
      }
    }),
    GetAnalystHome: builder.query<ListResponse<AnalystHomeDTO>, { idEvaluations: string }>({
      query: ({ idEvaluations }): any => ({
        url: `/evaluations/getAnalystHome`,
        params: { idEvaluations }
      }),
      providesTags: (result, error, arg) => [{ type: "EvaluationsApisService", id: arg.idEvaluations }]
    }),
    GetListEvaluationsOfSupervisor: builder.query<ListResponse<EvaluationsOfSupervisorDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/evaluations/getListEvaluationsOfSupervisor`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "EvaluationsApisService" as const, id })),
            {
              type: "EvaluationsApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "EvaluationsApisService", id: "LIST" }];
      }
    }),
    UpdateEvaluations: builder.mutation<payloadResult, { Evaluations: Partial<EvaluationsDTO> }>({
      query: ({ Evaluations }) => ({
        url: `/evaluations/updateEvaluations`,
        method: "PUT",
        data: Evaluations
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "EvaluationsApisService", id: arg.Evaluations.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.Evaluations && arg.Evaluations.id) {
          return [{ type: "EvaluationsApisService", id: arg.Evaluations.id }];
        }
        return [];
      }
    }),
    GetEvaluationsById: builder.query<ListResponse<EvaluationsDTO>, { idEvaluations: string }>({
      query: ({ idEvaluations }): any => ({
        url: `/evaluations/getEvaluationsById`,
        params: { idEvaluations }
      }),
      providesTags: (result, error, arg) => [{ type: "EvaluationsApisService", id: arg.idEvaluations }]
    }),
    InsertEvaluations: builder.mutation<payloadResult, { Evaluations: Partial<EvaluationsDTO> }>({
      query: ({ Evaluations }) => ({
        url: `/Evaluations/insertEvaluations`,
        method: "POST",
        data: Evaluations
      }),
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsApisService", id: "LIST" }] : [])
    }),
    InsertListEvaluations: builder.mutation<payloadResult, { EvaluationsList: Partial<EvaluationsListDTO> }>({
      query: ({ EvaluationsList }) => ({
        url: `/Evaluations/insertListEvaluations`,
        method: "POST",
        data: EvaluationsList
      }),
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsApisService", id: "LIST" }] : [])
    }),
    UpdateCategoryTimeTypeEvaluations: builder.mutation<
      payloadResult,
      { EvaluationsList: Partial<CategoryTimeTypeToEvaluations> }
    >({
      query: ({ EvaluationsList }) => ({
        url: `/Evaluations/updateCategoryTimeTypeEvaluations`,
        method: "PUT",
        data: EvaluationsList
      }),
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsApisService", id: "LIST" }] : [])
    }),
    DeleteEvaluations: builder.mutation<payloadResult, { idEvaluations: string[] }>({
      query: ({ idEvaluations }) => ({
        url: `/evaluations/deleteEvaluations`,
        method: "DELETE",
        data: idEvaluations
      }),
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsApisService", id: "LIST" }] : [])
    }),
    ConfirmConsolidationAndTransferEvaluations: builder.mutation<
      payloadResult,
      {
        idEvaluations: string;
        fileWord?: File;
        fileES?: File;
      }
    >({
      query: ({ idEvaluations, fileWord, fileES }) => {
        const formData = new FormData();
        formData.append("idEvaluations", idEvaluations);
        if (fileWord) {
          formData.append("files", fileWord);
        }
        if (fileES) {
          formData.append("files", fileES);
        }
        return {
          url: `/evaluations/confirmConsolidationAndTransferEvaluations`,
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
      },
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsApisService", id: "LIST" }] : [])
    }),
    FindEvaluations: builder.query<
      ListResponse<EvaluationsDTO>,
      { pageSize: number; pageNumber: number; keyword: string }
    >({
      query: ({ pageSize, pageNumber, keyword }: { pageSize: number; pageNumber: number; keyword: string }) => ({
        url: `/Evaluations/findEvaluations`,
        method: "GET",
        params: { pageSize, pageNumber, keyword }
      })
    })
  })
});

export const ExportWordSample = async ({ idEvaluations }: { idEvaluations: string }) => {
  const url = `${globalVariable.urlServerApi}/api/v1/evaluations/exportWordAnalystSample`;

  try {
    return await axios.get(url, {
      params: { idEvaluations },
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${getCookie("jwt")}`
      }
    });
  } catch (error) {
    console.error("Error fetching Excel file:", error);
    throw error;
  }
};

export const downloadAnalystExportFileAPI = async ({
  idEvaluations,
  numberTemplate
}: {
  idEvaluations: string | null | undefined;
  numberTemplate: number;
}) => {
  const url = `${globalVariable.urlServerApi}/api/v1/evaluations/exportAnalystConsolidationAndTransfer?idEvaluations=${idEvaluations}&numberTemplate=${numberTemplate}`;
  try {
    return await axios.get(url, {
      params: { idEvaluations },
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${getCookie("jwt")}`
      }
    });
  } catch (error) {
    console.error("Error fetching Excel file:", error);
    throw error;
  }
};

export const {
  useGetListEvaluationsQuery,
  useGetListEvaluationsConsolidationAndTransferQuery,
  useUpdateEvaluationsMutation,
  useGetEvaluationsByIdQuery,
  useInsertEvaluationsMutation,
  useDeleteEvaluationsMutation,
  useGetListEvaluationsOfUserQuery,
  useGetListEvaluationsOfSupervisorQuery,
  useGetAnalystHomeQuery,
  useLazyGetEvaluationsByIdQuery,
  useLazyFindEvaluationsQuery,
  useInsertListEvaluationsMutation,
  useUpdateCategoryTimeTypeEvaluationsMutation,
  useConfirmConsolidationAndTransferEvaluationsMutation
} = EvaluationsApisService;
