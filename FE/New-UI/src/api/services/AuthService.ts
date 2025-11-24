import { axiosRequest } from "../http/axiosBaseQuery";
import type { ResponseDTO } from "../../dto/commonDTO";

export const AuthService = {
    login: async (user: Record<string, any>): Promise<ResponseDTO | null> => {
        const result = await axiosRequest({
            url: "/auth/login",
            method: "POST",
            data: user
        });
        if (!result || result.error || !result.data) {
            return null;
        }
        return result.data;
    }
};