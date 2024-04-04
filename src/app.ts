teimport { ResponseResult } from "@/@types";
import { initialTheme } from './lib/misc';
import InitialStateModel from './@types/InitialStateModel';
import { toast } from 'react-hot-toast';
import { getOidc } from './lib/utils';


export const request: RequestConfig = {
    timeout: 10000,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    // other axios options you want
    errorConfig: {
        // 错误抛出
        errorThrower: (res: ResponseResult) => {
            const { success, data, errorCode, errorMessage } = res;
            if (!success) {
                const error: any = new Error(errorMessage);
                error.name = 'BizError';
                error.info = { errorCode, errorMessage, data };
                throw error; // 抛出自制的错误
            }
        },
        // 错误接收及处理
        errorHandler: (error: any, opts: any) => {
            if (opts?.skipErrorHandler) throw error;
            // 我们的 errorThrower 抛出的错误。
            if (error.name === 'BizError') {
                const errorInfo: ResponseResult | undefined = error.info;
                if (errorInfo) {
                    const { errorCode, errorMessage } = errorInfo;
                    if (errorCode === 401) {
                        toast.error('登录状态已失效，正在跳转到登录...')
                        getOidc().loginAsync()
                        return;
                    }
                    toast.error(errorMessage);
                }
            } else if (error.response) {
                // Axios 的错误
                // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
                let message = `Response status:${error.response.status}`
                if (error.response.status === 404) {
                    message = "请求接口不存在"
                }
                toast.error(message);
            } else if (error.request) {
                // 请求已经成功发起，但没有收到响应
                // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
                // 而在node.js中是 http.ClientRequest 的实例
                toast.error('None response! Please retry.');
            } else {
                // 发送请求时出了点问题
                toast.error('Request error, please retry.');
            }
        },
    },
    requestInterceptors: [
        async (config: RequestOptions) => {
            const oidc = getOidc()
            let headers = config.headers || {}
            if (oidc && oidc?.tokens) {
                headers['Authorization'] = `Bearer ${oidc.tokens.accessToken}`
            }

            let baseURL: string | null = ADMIN_API_BASE_URL
            // if (process.env.NODE_ENV === 'development') {
            //     baseURL = null
            // }
            const newConfig = {
                ...config,
                baseURL,
                headers
            }

            return newConfig
        }
    ],
    responseInterceptors: [
        (response: AxiosResponse) => {
            const { code: errorCode, message: errorMessage, data } = response.data;
            response.data = {
                errorCode,
                errorMessage,
                data,
                success: errorCode === 200,
            };
            return response;
        },
    ]
};

export async function getInitialState() {
    const theme = initialTheme() ?? ''

    return ({
        theme
    } as InitialStateModel)
}