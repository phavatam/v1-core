import { UserRoleDTO } from "@models/userRoleDto";

export interface UserLoginRequest {
  loginName?: string;
  password?: string;
}

export interface UserLoginResponse {
  id: string;
  isAdmin: boolean;
  data: any;
  isSuccess: boolean;
  accessToken: string;
  message: string;
  statusCode: number;
  traceId: string;
  roleList: UserRoleDTO[];
}