import { RequestParams, ApiListData, ListParams } from "../utils/interfaces";
import request from "../utils/request";
import utils from "../utils";

class ModuleApi {
    /**
     * 用户登录 （回调用法）
     * @param form 
     * @param success 成功回调
     * @param fail 失败回调
     */
    login(form: {account: string | number, password: string | number}, success?: RequestParams["success"], fail?: RequestParams["fail"]) {
        request("POST", "/login", form, success, fail);
    }

    /**
     * 查询用户类型 （Promise用法）
     * @param value 用户标识
     */
    searchUserType(value: "admin"|"vip"|"normal") {
        return request("POST", "/Logout", { type: value });
    }

    /** 
     * 模拟请求数据 
     * @param params
    */
    getTestList(params: ListParams): Promise<ApiListData> {
        const delay = utils.ranInt(200, 1000);
        const images = [
            "https://muse-ui.org/img/img1.35d144b4.png",
            "https://muse-ui.org/img/img2.9bd96df4.png",
            "https://muse-ui.org/img/img3.6e264e66.png",
            "https://muse-ui.org/img/sun.a646a52d.jpg",
            "https://muse-ui.org/img/breakfast.f1098290.jpg"
        ]
        const result: ApiListData = {
            code: 1,
            data: {
                pageIndex: params.pageIndex,
                pageSize: params.pageSize,
                list: []
            },
            msg: ""
        }
        return new Promise(function(resolve, reject) {
            setTimeout(function () {
                if (delay > 900 && params.pageIndex !== 0) {
                    result.msg = "接口查询超时"
                    result.code = 0;
                    reject(result);
                } else {
                    let total = params.pageSize;
                    if (params.pageIndex >= 5) {
                        total = utils.ranInt(2, params.pageSize - 2);
                    }
                    result.msg = "success"
                    result.code = 1;
                    result.data.list = new Array(total).fill(0).map(function(_, index) {
                        return {
                            id: params.pageIndex * params.pageSize + index + 1,
                            value: utils.randomText(6, 30),
                            img: images[utils.ranInt(0, images.length - 1)]
                        }
                    })
                    resolve(result);
                }
            }, delay)
        })
    }
}

/** 接口模块 */
const api = new ModuleApi();

export default api;