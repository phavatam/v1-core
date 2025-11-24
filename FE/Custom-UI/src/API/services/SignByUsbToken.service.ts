import { globalVariable } from "~/globalVariable";
import axios from "axios";
import { SignByUsbTokenParams } from "~/models/common";

export const signByUsbToken = async (
    params: SignByUsbTokenParams
): Promise<any> => {
    const url = `${globalVariable.urlSignByUsbToken}`;
    try {
        // Gửi request POST với axios
        const response = await axios.post<any>(url, JSON.stringify(params), {
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'blob'
        });

        return response; // Trả về kết quả từ API
    } catch (error) {
        console.error("Error sending data to signByUsbToken API:", error);
        throw error; // Ném lỗi để xử lý tại nơi gọi hàm này
    }
};