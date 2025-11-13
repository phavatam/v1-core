import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "@models/common";
import { ElectronicSignatureDTO } from "@models/electronicSignatureDTO";

export const ElectronicSignatureApisService = createApi({
  reducerPath: "ElectronicSignatureApisService",
  tagTypes: ["ElectronicSignatureApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListElectronicSignature: builder.query<ListResponse<ElectronicSignatureDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/electronicSignature/getListElectronicSignature`,
        params: { pageSize, pageNumber }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "ElectronicSignatureApisService" as const, id })),
            {
              type: "ElectronicSignatureApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "ElectronicSignatureApisService", id: "LIST" }];
      }
    }),
    UpdateElectronicSignature: builder.mutation<
      payloadResult,
      { ElectronicSignature: Partial<ElectronicSignatureDTO> }
    >({
      query: ({ ElectronicSignature }) => ({
        url: `/electronicSignature/updateElectronicSignature`,
        method: "PUT",
        data: ElectronicSignature
      }),
      // invalidatesTags: (result, error, arg) => (result ?
      //   [{ type: "ElectronicSignatureApisService", id: arg.ElectronicSignature.id }] : [])
      invalidatesTags: (result, error, arg) => {
        if (result && arg && arg.ElectronicSignature && arg.ElectronicSignature.id) {
          return [{ type: "ElectronicSignatureApisService", id: arg.ElectronicSignature.id }];
        }
        return [];
      }
    }),
    GetElectronicSignatureById: builder.query<ListResponse<ElectronicSignatureDTO>, { idElectronicSignature: string }>({
      query: ({ idElectronicSignature }): any => ({
        url: `/electronicSignature/getElectronicSignatureById`,
        params: { idElectronicSignature }
      }),
      providesTags: (result, error, arg) => [{ type: "ElectronicSignatureApisService", id: arg.idElectronicSignature }]
    }),
    InsertElectronicSignature: builder.mutation<
      payloadResult,
      { ElectronicSignature: Partial<ElectronicSignatureDTO> }
    >({
      query: ({ ElectronicSignature }) => ({
        url: `/electronicSignature/insertElectronicSignature`,
        method: "POST",
        data: ElectronicSignature
      }),
      invalidatesTags: (result) => (result ? [{ type: "ElectronicSignatureApisService", id: "LIST" }] : [])
    }),
    DeleteElectronicSignature: builder.mutation<payloadResult, { idElectronicSignature: string[] }>({
      query: ({ idElectronicSignature }) => ({
        url: `/electronicSignature/deleteElectronicSignature`,
        method: "DELETE",
        data: idElectronicSignature
      }),
      invalidatesTags: (result) => (result ? [{ type: "ElectronicSignatureApisService", id: "LIST" }] : [])
    }),
    DownloadFile: builder.query<Blob, { idElectronicSignature: string }>({
      query: ({ idElectronicSignature }) => ({
        url: `/electronicSignature/downloadPrivateKey?idElectronicSignature=${idElectronicSignature}`,
        responseType: "blob", // Đảm bảo rằng responseType là 'blob'
        method: "GET"
      })
    })
  })
});
export const {
  useGetListElectronicSignatureQuery,
  useUpdateElectronicSignatureMutation,
  useGetElectronicSignatureByIdQuery,
  useInsertElectronicSignatureMutation,
  useDeleteElectronicSignatureMutation,
  useLazyDownloadFileQuery
} = ElectronicSignatureApisService;
