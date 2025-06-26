import request from '../utils/request'

// 发送验证码
export const getCode = (data: any) => {
    return request.post('/get/code',data)
}