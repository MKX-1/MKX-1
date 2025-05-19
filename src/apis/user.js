import { request } from "@/utils/request";
export function loginAPI(Data) {
    return request({
        method: "post",
        url: "/user/login",
        data: Data
    })
}