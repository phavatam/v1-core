// interface cover responses data
export interface ListResponse<T> {
  payload: T;
  listPayload?: T[];
  message: string;
  success: boolean;
  fail: boolean;
  pageNumber: number;
  pageSize: number;
  totalElement: number;
  totalPages: number;
  loading: boolean;
}
export interface CoreResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data: any;
  message: string;
  tradeId: string;
}

export interface CoreResponseDataList<T> {
  pageNumber: number;
  pageSize: number;
  totalRecord: number;
  Items: T[];
}

export interface ListResponseFormData {
  data: {
    message: string;
    success: boolean;
  };
}

export type MergeTypes<A, B> = {
  [key in keyof A]: key extends keyof B ? B[key] : A[key];
} & B;

export interface ResponseStatus {
  message: string;
  success: boolean;
  fail: boolean;
}

export interface ResponseStatusWithToken extends ResponseStatus {
  token: string;
}

export interface payloadResult {
  message: string;
  success: boolean;
  content: string;
}

export interface corePayloadResult {
  message: string;
  isSuccess: boolean;
  data: string;
}

export interface pagination {
  pageSize: number;
  pageNumber: number;
}

export interface paginationwithkeyword {
  pageSize: number;
  pageNumber: number;
  keyword: string;
}

export interface Suggestion {
  value: string;
  label: string;
}

export interface SignByUsbTokenParams {
  File: string;
  UsbType: number;
  EvaluationId: string | null | undefined;
}
