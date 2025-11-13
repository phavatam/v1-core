import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../http/axiosBaseQuery";
import { ListResponse, payloadResult, CoreResponse } from "~/models/common";
import { UserLoginRequest, UserLoginResponse } from "@models/userAuth";

export const AuthApisService = createApi({
  reducerPath: "AuthApisService",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    Login: builder.mutation<CoreResponse<UserLoginResponse>, { user: Partial<UserLoginRequest> }>({
      query: ({ user }) => ({
        url: `/auth/Login`,
        method: "POST",
        data: user
      })
    }),
    Register: builder.mutation<payloadResult, { user: Partial<UserLoginRequest> }>({
      query: ({ user }) => ({
        url: `/auth/Register`,
        method: "POST",
        data: user
      })
    })
  })
});
export const { useLoginMutation, useRegisterMutation } = AuthApisService;
