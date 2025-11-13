import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, pagination, payloadResult } from "~/models/common";
import { UnitDTO } from "@models/unitDto";
import { globalVariable } from "~/globalVariable";
import axios from "axios";
import { getCookie } from "~/units";

export const UnitApisService = createApi({
  reducerPath: "UnitApisService",
  tagTypes: ["UnitApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    GetListUnit: builder.query<ListResponse<UnitDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/Unit/getListChildrenUnitByIdUnitOfUser?pageNumber=${pageNumber}&pageSize=${pageSize}`
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "UnitApisService" as const, id })),
            {
              type: "UnitApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "UnitApisService", id: "LIST" }];
      }
    }),
    GetUnitById: builder.query<ListResponse<UnitDTO>, { id: string }>({
      query: ({ id }): any => ({
        url: `/Unit/getUnitById?idUnit=${id}`
      }),
      providesTags: (result, error, arg) => [{ type: "UnitApisService", id: arg.id }]
    }),
    GetListUnitAvailable: builder.query<ListResponse<UnitDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/Unit/getListUnitAvailable?pageNumber=${pageNumber}&pageSize=${pageSize}`
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "UnitApisService" as const, id })),
            {
              type: "UnitApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "UnitApisService", id: "LIST" }];
      }
    }),
    InsertUnit: builder.mutation<payloadResult, { unit: Partial<UnitDTO> }>({
      query: ({ unit }) => ({
        url: `/Unit/insertUnit`,
        method: "POST",
        data: unit
      }),
      invalidatesTags: (result) => (result ? [{ type: "UnitApisService", id: "LIST" }] : [])
    }),
    InsertListUnit: builder.mutation<payloadResult, { unit: Partial<UnitDTO> }>({
      query: ({ unit }) => ({
        url: `/Unit/insertListUnit`,
        method: "POST",
        data: unit
      }),
      invalidatesTags: (result) => (result ? [{ type: "UnitApisService", id: "LIST" }] : [])
    }),
    ImportUnitWithExcel: builder.mutation<payloadResult, { file?: File }>({
      query: ({ file }) => {
        const formData = new FormData();
        if (file) {
          formData.append("file", file);
        }
        return {
          url: `/Unit/importUnitWithExcel`,
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
      },
      invalidatesTags: (result) => (result ? [{ type: "UnitApisService" }] : [])
    }),
    UpdateUnit: builder.mutation<payloadResult, { unit: Partial<UnitDTO> }>({
      query: ({ unit }) => ({
        url: `/Unit/updateUnit`,
        method: "PUT",
        data: unit
      }),
      invalidatesTags: (result, error, arg) =>
        result
          ? [
              {
                type: "UnitApisService",
                id: arg.unit.id
              },
              { type: "UnitApisService", id: "L" }
            ]
          : []
    }),
    DeleteUnit: builder.mutation<payloadResult, { idUnit: string[] }>({
      query: ({ idUnit }) => ({
        url: `/Unit/deleteUnit`,
        method: "DELETE",
        data: [...idUnit]
      }),
      invalidatesTags: (result) => (result ? [{ type: "UnitApisService", id: "LIST" }] : [])
    }),
    HideUnit: builder.mutation<payloadResult, { idUnit: string[]; isHide: boolean }>({
      query: ({ idUnit, isHide }) => ({
        url: `/Unit/hideUnit?isHide=${isHide}`,
        method: "PUT",
        data: [...idUnit]
      }),
      invalidatesTags: (result) => (result ? [{ type: "UnitApisService", id: "LIST" }] : [])
    }),
    getListUnitByIdParent: builder.query<ListResponse<UnitDTO>, { idParent: string }>({
      query: ({ idParent }): any => ({
        url: `/Unit/getListUnitByIdParent`,
        method: "GET",
        params: { idParent }
      }),
      providesTags: () => [{ type: "UnitApisService", id: "L" }]
    })
  })
});

export const getExampleImportUnitExcel = async () => {
  const url = `${globalVariable.urlServerApi}/api/v1/Unit/getExampleExcelImport`;

  try {
    return await axios.get(url, {
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
  useGetListUnitQuery,
  useGetUnitByIdQuery,
  useGetListUnitAvailableQuery,
  useInsertUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useHideUnitMutation,
  useGetListUnitByIdParentQuery,
  useInsertListUnitMutation,
  useImportUnitWithExcelMutation
} = UnitApisService;
