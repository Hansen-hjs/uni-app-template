import config from "../modules/Config";
import store from "../store";
import { ApiResult, RequestParams } from "./interfaces";

function getResultInfo(result: { statusCode: number, data: any }) {
    const info: ApiResult = { state: -1, msg: "", data: null }
    switch (result.statusCode) {
        case 999:
            info.msg = "网络出错了";
            break;
        case 200:
            info.state = 1;
            info.msg = "ok";
            info.data = result.data;
            break;
        case 400:
            info.msg = "接口传参不正确";
        case 403:
            info.msg = "登录已过期";
            store.updateUserInfo({ token: "" });
            break;
        case 404:
            info.msg = "接口不存在";
            break;
        default:
            break;
    }
    if (result.statusCode >= 500) {
        info.msg = "服务器闹脾气了";
    }
    return info;
}

/**
 * 基础请求
 * @description 可使用回调方式使用和`Promise`方式
 */
export default function request(
    method: RequestParams["method"],
    path: RequestParams["path"], 
    data?: RequestParams["data"], 
    success?: RequestParams["success"], 
    fail?: RequestParams["fail"]
): Promise<ApiResult> {
    return new Promise(function(resolve, reject) {
        uni.request({
            method: method,
            header: {
                "Authorization": store.userInfo.token
            },
            url: config.apiUrl + path,
            data: data,
            timeout: config.requestOvertime,
            success(res) {
                // console.log("request.success", res);
                const info = getResultInfo(res);
                if (info.state === 1) {
                    success && success(info);
                    resolve(info);
                } else {
                    uni.showToast({
                        title: info.msg,
                        position: "bottom",
                        duration: 2400
                    });
                    fail && fail(info);
                    resolve(info);
                }
            },
            fail(err) {
                const info = getResultInfo({ statusCode: 999, data: null });
                info.msg = err.errMsg;
                fail && fail(info);
                resolve(info);
            }
        })
    })
}
