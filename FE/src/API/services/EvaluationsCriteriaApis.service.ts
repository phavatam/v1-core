import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import {
  CustomResponseEvaluationsCriteriaDTO,
  CustomUpdateSortEvaluationsCriteriaDTO,
  EvaluationsCriteriaDTO,
  ListCriteriaInEvaluationsOfSupervisorDTO,
  ListCriteriaInEvaluationsOfUserDTO
} from "@models/evaluationsCriteriaDTO";
import {
  CustomInsertEvaluationsCriteriaDTO,
  CustomInsertEvaluationsCriteriaMultiDTO
} from "@models/customInsertEvaluationsCriteriaDto";
import { globalVariable } from "~/globalVariable";
import axios from "axios";
import { getCookie } from "~/units";
import { CategoryCriteriaDTO } from "@models/categoryCriteriaDTO";

export const EvaluationsCriteriaApisService = createApi({
  reducerPath: "EvaluationsCriteriaApisService",
  tagTypes: ["EvaluationsCriteriaApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListEvaluationsCriteria: builder.query<ListResponse<EvaluationsCriteriaDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/evaluationsCriteria/getListEvaluationsCriteria`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "EvaluationsCriteriaApisService" as const, id })),
            {
              type: "EvaluationsCriteriaApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "EvaluationsCriteriaApisService", id: "LIST" }];
      }
    }),
    GetListEvaluationsCriteriaByIdEvaluations: builder.query<
      ListResponse<EvaluationsCriteriaDTO>,
      { idEvaluations: string; pageSize: number; pageNumber: number }
    >({
      query: ({ idEvaluations, pageSize, pageNumber }): any => ({
        url: `/evaluationsCriteria/getListEvaluationsCriteriaByIdEvaluations`,
        params: { idEvaluations, pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "EvaluationsCriteriaApisService" as const, id })),
            {
              type: "EvaluationsCriteriaApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "EvaluationsCriteriaApisService", id: "LIST" }];
      }
    }),
    GetListCriteriaInEvaluationsOfUser: builder.query<
      ListResponse<CustomResponseEvaluationsCriteriaDTO>,
      { idEvaluations: string }
    >({
      query: ({ idEvaluations }): any => ({
        url: `/evaluationsCriteria/getListCriteriaInEvaluationsOfUser`,
        params: { idEvaluations }
      }),
      providesTags: (result, error, arg) => [{ type: "EvaluationsCriteriaApisService", id: arg.idEvaluations }]
    }),
    GetListCriteriaInEvaluationsOfSupervisor: builder.query<
      ListResponse<CustomResponseEvaluationsCriteriaDTO>,
      { idEvaluations: string; idUser: string }
    >({
      query: ({ idEvaluations, idUser }): any => ({
        url: `/evaluationsCriteria/getListCriteriaInEvaluationsOfSupervisor`,
        params: { idEvaluations, idUser }
      }),
      providesTags: (result, error, arg) => [{ type: "EvaluationsCriteriaApisService", id: arg.idEvaluations }]
    }),
    UpdateEvaluationsCriteria: builder.mutation<
      payloadResult,
      { EvaluationsCriteria: Partial<EvaluationsCriteriaDTO> }
    >({
      query: ({ EvaluationsCriteria }) => ({
        url: `/evaluationsCriteria/updateEvaluationsCriteria`,
        method: "PUT",
        data: EvaluationsCriteria
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "EvaluationsCriteriaApisService", id: arg.EvaluationsCriteria.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.EvaluationsCriteria && arg.EvaluationsCriteria.id) {
          return [{ type: "EvaluationsCriteriaApisService", id: arg.EvaluationsCriteria.id }];
        }
        return [];
      }
    }),
    UpdateSort: builder.mutation<
      payloadResult,
      { listCategoryCriteria: Partial<CustomUpdateSortEvaluationsCriteriaDTO> }
    >({
      query: ({ listCategoryCriteria }) => ({
        url: `/evaluationsCriteria/updateSort`,
        method: "PUT",
        data: listCategoryCriteria
      }),
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.listCategoryCriteria.idEvaluations && arg.listCategoryCriteria.idEvaluations) {
          return [{ type: "EvaluationsCriteriaApisService", id: arg.listCategoryCriteria.idEvaluations }];
        }
        return [];
      }
    }),
    GetEvaluationsCriteriaById: builder.query<ListResponse<EvaluationsCriteriaDTO>, { idEvaluationsCriteria: string }>({
      query: ({ idEvaluationsCriteria }): any => ({
        url: `/evaluationsCriteria/getEvaluationsCriteriaById`,
        params: { idEvaluationsCriteria }
      }),
      providesTags: (result, error, arg) => [{ type: "EvaluationsCriteriaApisService", id: arg.idEvaluationsCriteria }]
    }),
    GetListCriteriaOfEvaluationsCriteriaByIdEvaluations: builder.query<
      ListResponse<CategoryCriteriaDTO>,
      { idEvaluations: string }
    >({
      query: ({ idEvaluations }): any => ({
        url: `/evaluationsCriteria/getListCriteriaOfEvaluationsCriteriaByIdEvaluations`,
        params: { idEvaluations },
        caching: false
      }),
      providesTags: (result, error, arg) => [{ type: "EvaluationsCriteriaApisService", id: arg.idEvaluations }]
    }),
    InsertEvaluationsCriteria: builder.mutation<
      payloadResult,
      { EvaluationsCriteria: Partial<EvaluationsCriteriaDTO> }
    >({
      query: ({ EvaluationsCriteria }) => ({
        url: `/evaluationsCriteria/insertEvaluationsCriteria`,
        method: "POST",
        data: EvaluationsCriteria
      }),
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsCriteriaApisService", id: "LIST" }] : [])
    }),
    InsertAndUpdateListEvaluationsCriteria: builder.mutation<
      payloadResult,
      { EvaluationsCriteria: Partial<CustomInsertEvaluationsCriteriaDTO> }
    >({
      query: ({ EvaluationsCriteria }) => ({
        url: `/evaluationsCriteria/insertAndUpdateListEvaluationsCriteria`,
        method: "POST",
        data: EvaluationsCriteria
      }),
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsCriteriaApisService", id: "LIST" }] : [])
    }),
    InsertAndUpdateListEvaluationsCriteriaMulti: builder.mutation<
      payloadResult,
      { EvaluationsCriteria: Partial<CustomInsertEvaluationsCriteriaMultiDTO> }
    >({
      query: ({ EvaluationsCriteria }) => ({
        url: `/evaluationsCriteria/insertAndUpdateListEvaluationsCriteriaMulti`,
        method: "POST",
        data: EvaluationsCriteria
      }),
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsCriteriaApisService", id: "LIST" }] : [])
    }),
    InsertAndUpdateListCriteriaInEvaluationsOfUser: builder.mutation<
      payloadResult,
      {
        listCriteriaInEvaluationsOfUser: Partial<ListCriteriaInEvaluationsOfUserDTO>;
        file?: File;
      }
    >({
      query: ({ listCriteriaInEvaluationsOfUser, file }) => {
        const formData = new FormData();
        formData.append("listCriteriaInEvaluationsOfUser", JSON.stringify(listCriteriaInEvaluationsOfUser));
        if (file) {
          formData.append("file", file);
        }
        return {
          url: `/evaluationsCriteria/insertAndUpdateListCriteriaInEvaluationsOfUser`,
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
      },
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsCriteriaApisService", id: "LIST" }] : [])
    }),
    InsertAndUpdateListCriteriaInEvaluationsOfSupervisor: builder.mutation<
      payloadResult,
      {
        listCriteriaInEvaluationsOfSupervisor: Partial<ListCriteriaInEvaluationsOfSupervisorDTO>;
        file?: File;
      }
    >({
      query: ({ listCriteriaInEvaluationsOfSupervisor, file }) => {
        const formData = new FormData();
        formData.append("listCriteriaInEvaluationsOfSupervisor", JSON.stringify(listCriteriaInEvaluationsOfSupervisor));
        if (file) {
          formData.append("file", file);
        }
        return {
          url: `/evaluationsCriteria/insertAndUpdateListCriteriaInEvaluationsOfSupervisor`,
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
      },
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsCriteriaApisService", id: "LIST" }] : [])
    }),
    DeleteEvaluationsCriteria: builder.mutation<payloadResult, { idEvaluationsCriteria: string[] }>({
      query: ({ idEvaluationsCriteria }) => ({
        url: `/evaluationsCriteria/deleteEvaluationsCriteria`,
        method: "DELETE",
        data: idEvaluationsCriteria
      }),
      invalidatesTags: (result) => (result ? [{ type: "EvaluationsCriteriaApisService", id: "LIST" }] : [])
    })
  })
});

export const ExportExcelOfSupervisor = async ({ idEvaluations, idUser }: { idEvaluations: string; idUser: string }) => {
  const url = `${globalVariable.urlServerApi}/api/v1/evaluationsCriteria/exportExcelOfSupervisor`;

  try {
    return await axios.get(url, {
      params: { idEvaluations, idUser },
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

export const ExportPdfOfSupervisor = async ({ idEvaluations, idUser }: { idEvaluations: string; idUser: string }) => {
  const url = `${globalVariable.urlServerApi}/api/v1/evaluationsCriteria/exportPdfOfSupervisor`;

  try {
    return await axios.get(url, {
      params: { idEvaluations, idUser },
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

export const ExportExcelOfUser = async ({ idEvaluations }: { idEvaluations: string }) => {
  const url = `${globalVariable.urlServerApi}/api/v1/evaluationsCriteria/exportExcelOfUser`;

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

export const ExportPdfOfUser = async ({ idEvaluations }: { idEvaluations: string }) => {
  const url = `${globalVariable.urlServerApi}/api/v1/evaluationsCriteria/exportPdfOfUser`;

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
  useGetListEvaluationsCriteriaQuery,
  useUpdateEvaluationsCriteriaMutation,
  useGetEvaluationsCriteriaByIdQuery,
  useInsertEvaluationsCriteriaMutation,
  useDeleteEvaluationsCriteriaMutation,
  useGetListEvaluationsCriteriaByIdEvaluationsQuery,
  useInsertAndUpdateListEvaluationsCriteriaMutation,
  useGetListCriteriaInEvaluationsOfUserQuery,
  useInsertAndUpdateListCriteriaInEvaluationsOfUserMutation,
  useInsertAndUpdateListCriteriaInEvaluationsOfSupervisorMutation,
  useInsertAndUpdateListEvaluationsCriteriaMultiMutation,
  useGetListCriteriaInEvaluationsOfSupervisorQuery,
  useGetListCriteriaOfEvaluationsCriteriaByIdEvaluationsQuery,
  useLazyGetListCriteriaOfEvaluationsCriteriaByIdEvaluationsQuery,
  useUpdateSortMutation
} = EvaluationsCriteriaApisService;
