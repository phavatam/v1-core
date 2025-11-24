import { AnyAction, isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { notification } from "antd";
import { CoreResponse } from "@models/common";

// function isPayloadErrorMessage(payload: unknown): payload is {
//   data: {
//     message: string;
//     success: boolean;
//   };
//   status: number;
// } {
//   return (
//     typeof payload === "object" &&
//     payload !== null &&
//     typeof (payload as any).data?.message === "string" &&
//     typeof (payload as any).data?.isSuccess === "boolean" &&
//     typeof (payload as any).statusCode === "number"
//   );
// }

function isCorePayloadErrorMessage(payload: unknown): payload is {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  traceId: string;
} {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as any).message === "string" &&
    typeof (payload as any).isSuccess === "boolean" &&
    typeof (payload as any).statusCode === "number" &&
    typeof (payload as any).traceId === "number"
  );
}

// function isPayloadErrorMessage2(payload: unknown): payload is {
//   fail?: boolean;
//   message: string;
//   success: boolean;
//   totalElement?: number;
// } {
//   const obj = payload as {
//     fail?: boolean;
//     message: string;
//     success: boolean;
//     totalElement?: number;
//   };
//   return (
//     typeof obj === "object" &&
//     obj !== null &&
//     true &&
//     typeof obj.success === "boolean" &&
//     (typeof obj.fail === "undefined" || typeof obj.fail === "boolean") &&
//     (typeof obj.totalElement === "undefined" || typeof obj.totalElement === "number")
//   );
// }
// function isApiResponse(data: any): data is ListResponse<any> {
//   return (
//     typeof data === "object" &&
//     data !== null &&
//     "message" in data &&
//     "success" in data &&
//     "pageNumber" in data &&
//     "pageSize" in data &&
//     "totalElement" in data &&
//     "totalPages" in data
//   );
// }

function isApiCoreResponse(data: any): data is CoreResponse<any> {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    "isSuccess" in data &&
    "statusCode" in data &&
    "traceId" in data
  );
}

export const rtkQueryErrorLogger: Middleware = () => (next) => (action: AnyAction) => {
  const { payload } = action;
  if (isRejectedWithValue(action) && isCorePayloadErrorMessage(payload)) {
    notification.warning({
      message: "Cảnh báo",
      description: payload.message,
      placement: "top"
    });
  }
  const isTypePayload = isApiCoreResponse(payload);
  if (isTypePayload) {
    if (payload?.data) return next(action);
    !payload.isSuccess
      ? notification.warning({
          message: "Cảnh báo",
          description: payload.message,
          placement: "top"
        })
      : notification.success({
          message: "Thành công",
          description: payload.message,
          placement: "topRight"
        });
  }
  return next(action);
};
