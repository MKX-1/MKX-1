import {request} from "@/utils/request"
export function getArticles(params) {
    return request({
        url: '/posts/posts/showAllPosts',
        method: 'get',
        params
    })
}