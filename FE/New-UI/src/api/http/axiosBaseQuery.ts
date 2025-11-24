import type { AxiosRequestConfig, AxiosError } from "axios";
import axios from "axios";
import { globalVariable } from "../../../globalVariable";
import { getCookie } from "../../utils";

export async function axiosRequest({
  url,
  method,
  data,
  params,
  baseUrl = `${globalVariable.urlServerApi}/api/v1`
}: {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  baseUrl?: string;
}) {
  try {
    const result = await axios({
      url: baseUrl + url,
      method,
      data,
      params,
      headers: {
        Authorization: `Bearer ${getCookie("jwt")}`
      }
    });
    return { data: result.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    let serializedError = {};
    if (axiosError.config) {
      serializedError = {
        message: axiosError?.message,
        url: axiosError?.config?.url,
        method: axiosError?.config?.method,
        Authorization: axiosError?.config?.headers?.Authorization,
        data: axiosError?.config?.data
      };
    }
    console.warn("axiosError", axiosError);
    return {
      error: {
        data: axiosError.response?.data || axiosError.message,
        error: serializedError,
        status: axiosError.response?.status
      }
    };
  }
}