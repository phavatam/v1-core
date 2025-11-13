import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../http/axiosBaseQuery";
import { CoreResponse, ListResponse, pagination, payloadResult, ResponseStatus } from "~/models/common";
import { ListRole } from "~/models/userRoleDto";
import { UserDTO, UserResponse } from "@models/userDto";
import { globalVariable } from "~/globalVariable";
import axios from "axios";
import { getCookie } from "~/units";
export const UserApisService = createApi({
  reducerPath: "UserApisService",
  tagTypes: ["UserApisService"],
  baseQuery: axiosBaseQuery(),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    ChangePassword: builder.mutation<payloadResult, { email: string; oldPassword: string; newPassword: string }>({
      query: ({ email, oldPassword, newPassword }) => ({
        url: `/User/ChangePassword?email=${email}&oldPassword=${oldPassword}&newPassword=${newPassword}`,
        method: "PUT"
      })
    }),
    CreateUser: builder.mutation<payloadResult, { user: Partial<UserDTO> }>({
      query: ({ user }) => ({
        url: `/User/InsertUser`,
        method: "POST",
        data: user,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }),
      invalidatesTags: (result) => (result ? [{ type: "UserApisService" }] : [])
    }),
    ForgotPassword: builder.mutation<ListResponse<UserDTO>, { email: string; newPassword: string }>({
      query: ({ email, newPassword }) => ({
        url: `/User/ForgotPassword?email=${email}&newPassword=${newPassword}`,
        method: "PUT"
      })
    }),
    GetListUser: builder.query<CoreResponse<UserDTO>, pagination>({
      query: ({ pageSize, pageNumber }): any => ({
        url: "/user/get-list-users",
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize
        }
      }),
      providesTags(result) {
        if (result && result.data) {
          const { data } = result.data;
          console.log(result.data);
          return [
            ...data.map(({ id }) => ({ type: "UserApisService" as const, id })),
            {
              type: "UserApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "UserApisService", id: "LIST" }];
      }
    }),
    GetUser: builder.query<ListResponse<UserResponse>, { fetch: boolean }>({
      query: (fetch: { fetch: boolean }): any => ({
        url: `/User/Get-User`,
        method: "GET",
        caching: fetch
      }),
      keepUnusedDataFor: 60 * 5
    }),
    GetUserById: builder.query<ListResponse<UserDTO>, { id: string | undefined }>({
      query: ({ id }): any => ({
        url: `/User/GetUserById?IdUser=${id}`
      }),
      providesTags: (result, error, arg) => [{ type: "UserApisService", id: arg.id }]
    }),
    LockUserAccountByList: builder.mutation<ListResponse<UserDTO>, { listId: string[]; isLock: boolean }>({
      query: ({ listId, isLock }) => ({
        url: `/User/LockUserAccountByList?isLock=${isLock}`,
        method: "PUT",
        data: listId
      }),
      invalidatesTags: (result) => (result ? [{ type: "UserApisService", id: "LIST" }] : [])
    }),
    RemoveUserByList: builder.mutation<ListResponse<UserDTO>, { listId: string[] }>({
      query: ({ listId }) => ({
        url: `/User/RemoveUserByList`,
        method: "DELETE",
        data: listId
      }),
      invalidatesTags: (result) => (result ? [{ type: "UserApisService", id: "LIST" }] : [])
    }),
    SendCodeWithAccountActive: builder.mutation<ListResponse<UserDTO>, { email: string }>({
      query: ({ email }) => ({
        url: `/User/SendCodeWithAccountActive?email=${email}`,
        method: "POST"
      })
    }),
    UpdateUser: builder.mutation<payloadResult, { user: Partial<UserDTO> }>({
      query: ({ user }) => ({
        url: `/User/UpdateUser`,
        method: "PUT",
        data: user,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }),
      invalidatesTags: (result, error, arg) => (result ? [{ type: "UserApisService", id: arg.user.id }] : [])
    }),
    VerifyCode: builder.mutation<ListResponse<UserDTO>, { email: string; code: string }>({
      query: ({ email, code }) => ({
        url: `/User/VerifyCode?email=${email}&code=${code}`,
        method: "POST"
      })
    }),
    GetAllRole: builder.query<ListResponse<ListRole>, { pageSize: number; pageNumber: number }>({
      query: ({ pageSize, pageNumber }): any => ({
        url: "/User/GetAllRole",
        params: {
          pageSize,
          pageNumber
        }
      }),
      keepUnusedDataFor: 60 * 5
    }),
    GetAllRoleByIdUserCurrent: builder.query<
      ListResponse<ListRole>,
      { IdUser: string; pageSize: number; pageNumber: number }
    >({
      query: ({ IdUser, pageSize, pageNumber }): any => ({
        url: `/User/GetAllRoleByIdUserCurrent?IdUser=${IdUser}`,
        params: {
          pageNumber,
          pageSize,
          IdUser
        }
      }),
      providesTags: (result, error, arg) => [{ type: "UserApisService", id: arg.IdUser }]
    }),
    GetListUserByIdUnit: builder.query<ListResponse<UserDTO>, { idUnit: string; pageSize: number; pageNumber: number }>(
      {
        query: ({ idUnit, pageSize, pageNumber }): any => ({
          url: `/User/getListUserByIdUnit`,
          params: {
            pageNumber,
            pageSize,
            idUnit
          }
        }),
        providesTags(result) {
          if (result && result.listPayload) {
            const { listPayload } = result;
            return [
              ...listPayload.map(({ id }) => ({ type: "UserApisService" as const, id })),
              {
                type: "UserApisService" as const,
                id: "LIST"
              }
            ];
          }
          return [{ type: "UserApisService", id: "LIST" }];
        }
      }
    ),
    GetListUserParentAndChildren: builder.query<ListResponse<UserDTO>, { pageSize: number; pageNumber: number }>({
      query: ({ pageSize, pageNumber }): any => ({
        url: `/User/getListUserParentAndChildren`,
        params: {
          pageNumber,
          pageSize
        }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "UserApisService" as const, id })),
            {
              type: "UserApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "UserApisService", id: "LIST" }];
      }
    }),
    GetListUserParentAndChildrenOfEvaluations: builder.query<
      ListResponse<UserDTO>,
      { idEvaluations: string; pageSize: number; pageNumber: number }
    >({
      query: ({ idEvaluations, pageSize, pageNumber }): any => ({
        url: `/User/getListUserParentAndChildrenOfEvaluations`,
        params: {
          idEvaluations,
          pageNumber,
          pageSize
        }
      }),
      providesTags(result) {
        if (result && result.listPayload) {
          const { listPayload } = result;
          return [
            ...listPayload.map(({ id }) => ({ type: "UserApisService" as const, id })),
            {
              type: "UserApisService" as const,
              id: "LIST"
            }
          ];
        }
        return [{ type: "UserApisService", id: "LIST" }];
      }
    }),
    AddListRoleUser: builder.mutation<ResponseStatus, { IdUser: string; listRole: string[] }>({
      query: ({ IdUser, listRole }) => ({
        url: `/User/AddListRoleUser`,
        method: "POST",
        data: listRole,
        params: { IdUser }
      }),
      invalidatesTags: (result, error, arg) => (result ? [{ type: "UserApisService", id: arg.IdUser }] : [])
    }),
    getUserAndRole: builder.query<ListResponse<UserDTO>, { id: string }>({
      query: ({ id }): any => ({
        url: `/User/GetUserAndRole?IdUser=${id}`,
        method: "GET"
      }),
      providesTags: (result, error, arg) => [{ type: "UserApisService", id: arg.id }]
    }),
    insertListRoleUser: builder.mutation<ResponseStatus, { idUser: string; idsRole: string[] }>({
      query: ({ idUser, idsRole }) => ({
        url: `/User/addListRoleUser`,
        method: "POST",
        data: { idsRole, idUser }
      }),
      invalidatesTags: (result, error, arg) => (result ? [{ type: "UserApisService", id: arg.idUser }] : [])
    }),
    ImportUserWithExcel: builder.mutation<payloadResult, { file?: File }>({
      query: ({ file }) => {
        const formData = new FormData();
        if (file) {
          formData.append("file", file);
        }
        return {
          url: `/User/importUserWithExcel`,
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
      },
      invalidatesTags: (result) => (result ? [{ type: "UserApisService" }] : [])
    }),
    RenewPasswordUserByList: builder.mutation<ListResponse<UserDTO>, { userIds: string[]; newPassword: string }>({
      query: ({ userIds, newPassword }) => ({
        url: `/User/RenewPasswordUserByList`,
        method: "POST",
        data: { userIds, newPassword }
      }),
      invalidatesTags: (result) => (result ? [{ type: "UserApisService", id: "LIST" }] : [])
    })
  })
});

export const getExampleExcel = async () => {
  const url = `${globalVariable.urlServerApi}/api/v1/User/getExampleExcelImport`;

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
  useGetListUserQuery,
  useGetUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useRemoveUserByListMutation,
  useRenewPasswordUserByListMutation,
  useLockUserAccountByListMutation,
  useSendCodeWithAccountActiveMutation,
  useVerifyCodeMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useGetAllRoleQuery,
  useGetAllRoleByIdUserCurrentQuery,
  useAddListRoleUserMutation,
  useGetUserAndRoleQuery,
  useInsertListRoleUserMutation,
  useGetListUserByIdUnitQuery,
  useGetListUserParentAndChildrenQuery,
  useImportUserWithExcelMutation,
  useGetListUserParentAndChildrenOfEvaluationsQuery
} = UserApisService;
