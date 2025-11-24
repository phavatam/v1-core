import { axiosRequest } from "../http/axiosBaseQuery";
import type { ResponseDTO, ResponseDataListDTO } from "../../dto/commonDTO";

export const userService = {
    getListNavigation: async (
        { pageSize, pageNumber }: { pageSize: number; pageNumber: number }
    ): Promise<ResponseDataListDTO<any> | null> => {
        const result = await axiosRequest({
            url: `/user/GetListUsers?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            method: "GET"
        });
        if (!result || result.error || !result.data) {
            // Có thể log lỗi ở đây nếu cần
            return null;
        }
        return result.data;
    },
    updateUser: async (
        user: Record<string, any>
    ): Promise<ResponseDTO | null> => {
        const result = await axiosRequest({
            url: "/User/UpdateUser",
            method: "PUT",
            data: user,
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!result || result.error || !result.data) {
            return null;
        }
        return result.data;
    }
};