import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { ExplaintEvaluationDTO } from "@models/ExplaintEvaluationDTO";
import { globalVariable } from "~/globalVariable";
import axios from "axios";
import { getCookie } from "~/units";

export const ExplaintEvaluationApisService = createApi({
  reducerPath: "ExplaintEvaluationApisService",
  tagTypes: ["ExplaintEvaluationApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListExplaintEvaluation: builder.query<ListResponse<ExplaintEvaluationDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/ExplaintEvaluation/getListExplaintEvaluation`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "ExplaintEvaluationApisService" as const, id })),
            {
              type: "ExplaintEvaluationApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "ExplaintEvaluationApisService", id: "LIST" }];
      }
    }),
    UpdateExplaintEvaluation: builder.mutation<payloadResult, { ExplaintEvaluation: Partial<ExplaintEvaluationDTO> }>({
      query: ({ ExplaintEvaluation }) => ({
        url: `/ExplaintEvaluation/updateExplaintEvaluation`,
        method: "PUT",
        data: ExplaintEvaluation
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "ExplaintEvaluationApisService", id: arg.ExplaintEvaluation.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.ExplaintEvaluation && arg.ExplaintEvaluation.id) {
          return [{ type: "ExplaintEvaluationApisService", id: arg.ExplaintEvaluation.id }];
        }
        return [];
      }
    }),
    GetExplaintEvaluationById: builder.query<ListResponse<ExplaintEvaluationDTO>, { idExplaintEvaluation: string }>({
      query: ({ idExplaintEvaluation }): any => ({
        url: `/ExplaintEvaluation/getExplaintEvaluationById`,
        params: { idExplaintEvaluation }
      }),
      providesTags: (result, error, arg) => [{ type: "ExplaintEvaluationApisService", id: arg.idExplaintEvaluation }]
    }),
    InsertExplaintEvaluation: builder.mutation<payloadResult, { ExplaintEvaluation: Partial<ExplaintEvaluationDTO> }>({
      query: ({ ExplaintEvaluation }) => ({
        url: `/ExplaintEvaluation/insertExplaintEvaluation`,
        method: "POST",
        data: ExplaintEvaluation
      }),
      invalidatesTags: (result) => (result ? [{ type: "ExplaintEvaluationApisService", id: "LIST" }] : [])
    }),
    DeleteExplaintEvaluation: builder.mutation<payloadResult, { idExplaintEvaluation: string[] }>({
      query: ({ idExplaintEvaluation }) => ({
        url: `/ExplaintEvaluation/DeleteExplaintEvaluation`,
        method: "DELETE",
        data: idExplaintEvaluation
      }),
      invalidatesTags: (result) => (result ? [{ type: "ExplaintEvaluationApisService", id: "LIST" }] : [])
    }),
    InsertExplaintEvaluationWithFile: builder.mutation<payloadResult, { formData: FormData }>({
      query: ({ formData }) => ({
        url: `/ExplaintEvaluation/insertExplaintEvaluationWithFile`,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }),
      invalidatesTags: (result) => (result ? [{ type: "ExplaintEvaluationApisService", id: "LIST" }] : [])
    }),
    getExplaintEvaluationByIdEvaluation: builder.query<
      ListResponse<ExplaintEvaluationDTO>,
      { idEvaluation: string; pagination: pagination }
    >({
      query: ({ idEvaluation, pagination }): any => ({
        url: `/ExplaintEvaluation/getExplaintEvaluationByIdEvaluation`,
        method: "GET",
        params: { idEvaluation, pagination }
      }),
      providesTags: () => [{ type: "ExplaintEvaluationApisService", id: "L" }]
    }),
    getFileExplaintEvaluation: builder.query<Blob, { FileAttachments: string }>({
      query: ({ FileAttachments }) => ({
        url: `/ExplaintEvaluation/getFileExplaintEvaluation?FileAttachments=${FileAttachments}`,
        responseType: "blob",
        method: "GET"
      })
    }),
    exportWordOfUser: builder.query<Blob, { idEvaluations: string | null | undefined; numberTemplate: number }>({
      query: ({ idEvaluations, numberTemplate }) => ({
        url: `/ExplaintEvaluation/exportWordOfUser`,
        method: "GET",
        params: { idEvaluations, numberTemplate },
        responseType: "blob"
      })
    })
  })
});

export const downloadWordOrPDFStatisticOfUser = async ({
  idEvaluations,
  numberTemplate,
  type
}: {
  idEvaluations: string | null | undefined;
  numberTemplate: number;
  type: number;
}) => {
  const url = `${globalVariable.urlServerApi}/api/v1/ExplaintEvaluation/exportWordOfUser?idEvaluations=${idEvaluations}&numberTemplate=${numberTemplate}&type=${type}`;
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

export const getFileExplaintEvaluation2ndway = (FileAttachments: string) => {
  return `${globalVariable.urlServerApi}/api/v1/ExplaintEvaluation/getFileExplaintEvaluation?FileAttachments=${FileAttachments}`;
};
export const {
  useGetListExplaintEvaluationQuery,
  useUpdateExplaintEvaluationMutation,
  useGetExplaintEvaluationByIdQuery,
  useInsertExplaintEvaluationMutation,
  useDeleteExplaintEvaluationMutation,
  useInsertExplaintEvaluationWithFileMutation,
  useGetExplaintEvaluationByIdEvaluationQuery,
  useGetFileExplaintEvaluationQuery,
  useLazyExportWordOfUserQuery
} = ExplaintEvaluationApisService;
