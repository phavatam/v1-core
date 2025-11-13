import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@API/http/axiosBaseQuery";
import { ListResponse, CoreResponse, pagination, payloadResult, corePayloadResult } from "~/models/common";
import { UserTypeDTO } from "@models/userTypeDto";

export const UserTypeApisService = createApi({
  reducerPath: "UserTypeApisService",
  tagTypes: ["UserTypeApisService"],
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    // New API From Core
    GetList: builder.query<CoreResponse<UserTypeDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/user-type?page_number=${pageNumber}&page_size=${pageSize}`
      }),
      providesTags(result) {
        if (result && result.data) {
          const { items } = result.data;
          return [
            ...items.map(({ id }) => ({ type: "UserTypeApisService" as const, id })),
            {
              type: "UserTypeApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "UserTypeApisService", id: "LIST" }];
      }
    }),
    GetById: builder.query<CoreResponse<UserTypeDTO>, { id: string }>({
      query: ({ id }): any => ({
        url: `/user-type/${id}`
      }),
      providesTags: (result, error, arg) => [{ type: "UserTypeApisService", id: arg.id }]
    }),
    Create: builder.mutation<CorePayloadResult, { userType: Partial<UserTypeDTO> }>({
      query: ({ userType }) => ({
        url: `/user-Type`,
        method: "POST",
        data: userType
      }),
      invalidatesTags: (result) => (result ? [{ type: "UserTypeApisService", id: "LIST" }] : [])
    }),
    Update: builder.mutation<corePayloadResult, { userType: Partial<UserTypeDTO> }>({
      query: ({ userType }) => ({
        url: `/user-type`,
        method: "PUT",
        data: userType
      }),
      invalidatesTags: (result, error, arg) => (result ? [{ type: "UserTypeApisService", id: arg.userType.id }] : [])
    }),
    //
    GetListUserType: builder.query<ListResponse<UserTypeDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/userType/getListUserType?pageNumber=${pageNumber}&pageSize=${pageSize}`
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "UserTypeApisService" as const, id })),
            {
              type: "UserTypeApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "UserTypeApisService", id: "LIST" }];
      }
    }),
    GetUserTypeById: builder.query<ListResponse<UserTypeDTO>, { id: string }>({
      query: ({ id }): any => ({
        url: `/userType/getUserTypeById?idUserType=${id}`
      }),
      providesTags: (result, error, arg) => [{ type: "UserTypeApisService", id: arg.id }]
    }),
    InsertUserType: builder.mutation<payloadResult, { userType: Partial<UserTypeDTO> }>({
      query: ({ userType }) => ({
        url: `/userType/insertUserType`,
        method: "POST",
        data: userType
      }),
      invalidatesTags: (result) => (result ? [{ type: "UserTypeApisService", id: "LIST" }] : [])
    }),
    UpdateUserType: builder.mutation<payloadResult, { userType: Partial<UserTypeDTO> }>({
      query: ({ userType }) => ({
        url: `/userType/updateUserType`,
        method: "PUT",
        data: userType
      }),
      invalidatesTags: (result, error, arg) => (result ? [{ type: "UserTypeApisService", id: arg.userType.id }] : [])
    }),
    DeleteUserType: builder.mutation<payloadResult, { idUserType: string[] }>({
      query: ({ idUserType }) => ({
        url: `/userType/deleteUserType`,
        method: "DELETE",
        data: [...idUserType]
      }),
      invalidatesTags: (result) => (result ? [{ type: "UserTypeApisService", id: "LIST" }] : [])
    })
  })
});
export const {
  useGetListQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useGetListUserTypeQuery,
  useGetUserTypeByIdQuery,
  useInsertUserTypeMutation,
  useUpdateUserTypeMutation,
  useDeleteUserTypeMutation
} = UserTypeApisService;
