import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult, CoreResponse, corePayloadResult } from "~/models/common";
import { ResignationDTO } from "@models/C&B/ResignationDTO";
import { InternRequestDTO } from "@models/internRequestDTO";
import { globalVariable } from "~/globalVariable";

export const ResignationApplicationService = createApi({
  reducerPath: "ResignationApplicationService",
  tagTypes: ["ResignationApplicationService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    // New
    GetList: builder.query<CoreResponse<ResignationDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/internRequest/getListInternRequest`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.data) {
          const { items } = result.data;
          return [
            ...items.map(({ id }) => ({ type: "ResignationApplicationService" as const, id })),
            {
              type: "ResignationApplicationService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "ResignationApplicationService", id: "LIST" }];
      }
    }),
    Get: builder.query<CoreResponse<ResignationDTO>, { id: string }>({
      query: ({ id }): any => ({
        url: `/resignation-application/${id}`
        // params: { id }
      }),
      providesTags: (result, error, arg) => [{ type: "ResignationApplicationService", id: arg.id }]
    }),
    Create: builder.mutation<corePayloadResult, { payload: Partial<ResignationDTO> }>({
      query: ({ payload }) => ({
        url: `/resignation-application`,
        method: "POST",
        data: payload
      }),
      invalidatesTags: (result) => (result ? [{ type: "ResignationApplicationService", id: "LIST" }] : [])
    }),
    Update: builder.mutation<corePayloadResult, { payload: Partial<ResignationDTO> }>({
      query: ({ payload }) => ({
        url: `/resignation-application`,
        method: "PUT",
        data: payload
      }),
      invalidatesTags: (result, error, arg) =>
        result ? [{ type: "ResignationApplicationService", id: arg.internRequest.id }] : []
    }),
    Delete: builder.mutation<corePayloadResult, { ids: number }>({
      query: ({ ids }) => ({
        url: `/resignation-application`,
        method: "DELETE",
        data: ids
      }),
      invalidatesTags: (result) => (result ? [{ type: "ResignationApplicationService", id: "LIST" }] : [])
    }),
    DeleteMultiple: builder.mutation<corePayloadResult, { ids: string[] }>({
      query: ({ ids }) => ({
        url: `/resignation-application`,
        method: "DELETE",
        data: ids
      }),
      invalidatesTags: (result) => (result ? [{ type: "ResignationApplicationService", id: "LIST" }] : [])
    }),
    // End
    GetListInternRequest: builder.query<ListResponse<InternRequestDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/internRequest/getListInternRequest`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "InternRequestApisService" as const, id })),
            {
              type: "InternRequestApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "InternRequestApisService", id: "LIST" }];
      }
    }),
    GetInternRequestById: builder.query<ListResponse<InternRequestDTO>, { idInternRequest: string }>({
      query: ({ idInternRequest }): any => ({
        url: `/internRequest/getInternRequestById`,
        params: { idInternRequest }
      }),
      providesTags: (result, error, arg) => [{ type: "InternRequestApisService", id: arg.idInternRequest }]
    }),
    InsertInternRequest: builder.mutation<payloadResult, { internRequest: Partial<InternRequestDTO> }>({
      query: ({ internRequest }) => ({
        url: `/internRequest/insertInternRequest`,
        method: "POST",
        data: internRequest
      }),
      invalidatesTags: (result) => (result ? [{ type: "InternRequestApisService", id: "LIST" }] : [])
    }),
    UpdateInternRequest: builder.mutation<payloadResult, { internRequest: Partial<InternRequestDTO> }>({
      query: ({ internRequest }) => ({
        url: `/internRequest/updateInternRequest`,
        method: "PUT",
        data: internRequest
      }),
      invalidatesTags: (result, error, arg) =>
        result ? [{ type: "InternRequestApisService", id: arg.internRequest.id }] : []
    }),
    DeleteInternRequest: builder.mutation<payloadResult, { listId: string[] }>({
      query: ({ listId }) => ({
        url: `/internRequest/deleteInternRequest`,
        method: "DELETE",
        data: listId
      }),
      invalidatesTags: (result) => (result ? [{ type: "InternRequestApisService", id: "LIST" }] : [])
    }),
    GetListInternRequestByRole: builder.query<ListResponse<InternRequestDTO>, pagination>({
      query: (pagination): any => ({
        url: `/internRequest/getListInternRequestByRole`,
        method: "GET",
        params: pagination
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "InternRequestApisService" as const, id })),
            {
              type: "InternRequestApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "InternRequestApisService", id: "LIST" }];
      }
    }),
    GetListInternRequestByHistory: builder.query<ListResponse<InternRequestDTO>, pagination>({
      query: (pagination): any => ({
        url: `/internRequest/getListInternRequestByHistory`,
        method: "GET",
        params: pagination
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "InternRequestApisService" as const, id })),
            {
              type: "InternRequestApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "InternRequestApisService", id: "LIST" }];
      }
    }),
    filterListInternRequest: builder.query<
      ListResponse<InternRequestDTO>,
      {
        idEmployee: string;
        idUnit: string;
        idPosition: string;
        pageNumber: number;
        pageSize: number;
      }
    >({
      query: (filter): any => ({
        url: `/internRequest/filterListInternRequest`,
        data: filter,
        method: "POST"
      })
    })
  })
});

export const getFileInternRequest = (fileNameId: string) => {
  return `${globalVariable.urlServerApi}/api/v1/internRequest/getFileInternRequest?fileNameId=${fileNameId}`;
};
export const {
  useGetListQuery,
  useGetQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useDeleteMultipleMutation,
  useGetListInternRequestQuery,
  useGetInternRequestByIdQuery,
  useInsertInternRequestMutation,
  useUpdateInternRequestMutation,
  useDeleteInternRequestMutation,
  useGetListInternRequestByRoleQuery,
  useGetListInternRequestByHistoryQuery,
  useLazyFilterListInternRequestQuery
} = ResignationApplicationService;
