import axios from 'axios'
import { getToken } from './token'
//文件中创建了axios实例，分别封装了请求拦截器和响应拦截器
const request = axios.create({
    baseURL: 'http://10.236.174.189:8087',
    timeout: 5000 
})//创建axios，这里的用处是。。
request.interceptors.request.use((config) => {
    const token = getToken()
    if(token){
        config.headers.Authorization = `Bearer${token}`
    }
    return config   
}, (error) => {
    return Promise.reject(error) 
})
request.interceptors.response.use((response) => {
    return response.data 
},(error)=>{
    return Promise.reject(error)
})

export {request}