import { ModuleModifyObject } from "./ModifyObject";
// import apiUser from "../api/User";
import utils from "../utils";
// import store from "../store";
import { ApiResult } from "../utils/interfaces";

type LocationResult = WechatMiniprogram.GetLocationSuccessCallbackResult;

interface scopeType {
    /** 是否授权用户信息 */
    userInfo: boolean
    /** 是否授权地理位置 */
    userLocation: boolean
    /** 是否授权通讯地址 */
    address: boolean
    /** 是否授权微信运动步数 */
    werun: boolean
    /** 是否授权录音功能 */
    record: boolean
    /** 是否授权保存到相册 */
    writePhotosAlbum: boolean
    /** 授权手机号 */
    phone: boolean
}

class ModuleWeChat extends ModuleModifyObject {
    constructor() {
        super();
    }
    /** 
     * 用户授权设置信息 
     * learn: https://developers.weixin.qq.com/miniprogram/dev/api/AuthSetting.html
     */
    readonly scope: scopeType = {
        userInfo: false,
        userLocation: false,
        address: false,
        werun: false,
        record: false,
        writePhotosAlbum: false,
        phone: false
    }

    /** 用户授权信息 */
    readonly userInfo: WechatMiniprogram.UserInfo = {
        avatarUrl: "",
        nickName: "",
        city: "",
        country: "",
        gender: 0,
        language: "zh_CN",
        province: ""
    }

    /** 是否在执行`checkInfo` */
    private isCheckInfo = false;

    /** 跳转授权登录页 */
    openLogin() {
        if (this.isCheckInfo) return
        wx.navigateTo({
            url: "/pages/login"
        })
    }

    /** `checkInfo`登录回调列表 */
    private checkInfoLoginCallbacks: Array<(res: ApiResult) => void> = [];

    /**
     * 检测更新用户信息
     * @param loginCallback 登录成功回调
    */
    async checkInfo(loginCallback?: (res: ApiResult) => void) {
        this.isCheckInfo = true;
        const THAT = this;
        const codeInfo = await this.getLoginCode();
        if (!codeInfo.code) return utils.showAlert("微信登录失败，请重新登录");
        wx.getSetting({
            success(res) {
                // console.log(res);
                const info: any = res.authSetting;
                for (const key in info) {
                    const keyName = key.split(".")[1] as keyof scopeType  
                    THAT.scope[keyName] = info[key];
                }
                // console.log("THAT.scope >>", THAT.scope);
                if (THAT.scope.userInfo) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success(info) {
                            THAT.modifyData(THAT.userInfo, info.userInfo);
                            // console.log(THAT.userInfo);
                            // apiUser.login({
                            //     code: codeInfo.code,
                            //     avatar: info.userInfo.avatarUrl,
                            //     nickname: info.userInfo.nickName,
                            //     gender: info.userInfo.gender,
                            //     city: info.userInfo.city,
                            //     province: info.userInfo.province,
                            //     country: info.userInfo.country,
                            //     pid: store.shareParams.pid
                            // }).then(res => {
                            //     THAT.isCheckInfo = false;
                            //     // console.log("登录信息 >>", res);
                            //     if (res.state === 1) {
                            //         store.updateUserInfo(res.data);
                            //         loginCallback && loginCallback(res);
                            //         for (let i = 0; i < THAT.checkInfoLoginCallbacks.length; i++) {
                            //             const callback = THAT.checkInfoLoginCallbacks[i];
                            //             callback(res);
                            //         }
                            //         // 执行完所有回调后清空，所有回调不会重复执行
                            //         THAT.checkInfoLoginCallbacks = [];
                            //         // 上报手机加密数据
                            //         if (apiUser.phoneInfo.encrypted_data) {
                            //             apiUser.phoneInfo.encrypted_data = "";
                            //             apiUser.postPhoneData(apiUser.phoneInfo)
                            //         }
                            //         apiUser.phoneInfo.encrypted_data
                            //     } else {
                            //         utils.showAlert(res.msg);
                            //     }
                            // })
                        }
                    });
                } else {
                    THAT.isCheckInfo = false;
                    THAT.openLogin();
                }
            },
            fail(err) {
                THAT.isCheckInfo = false;
                utils.showAlert(err.errMsg, undefined, "获取微信设置失败");
            }
        });
    }

    /**
     * 获取`wx.login`返回的code
     */
    private getLoginCode(): Promise<{ msg: string, code: string }> {
        const result = {
            msg: "",
            code: ""
        }
        return new Promise(function(resolve) {
            wx.login({
                success(res) {
                    result.msg = res.errMsg;
                    result.code = res.code;
                    resolve(result);
                },
                fail(err) {
                    result.msg = err.errMsg;
                    resolve(result);
                }
            })
        })
    }

    /**
     * 监听授登录之后
     * @param callback 回调函数（只会执行一次）
     */
    onAuthorization(callback: (res?: ApiResult) => void) {
        if (this.isCheckInfo) {
            this.checkInfoLoginCallbacks.push(callback);
            return;
        }
        if (this.scope.userInfo) {
            return callback();
        }
    }

    /** 用户位置每次进入小程序时获取/更新 */
    readonly userLocation = {
        /** 是否不再提示？ */
        nomoreTip: false,
        /** 是否授权 */
        authorize: true,
        /** 维度 */
        latitude: 0,
        /** 经度 */
        longitude: 0
    }

    /**
     * 更新用户位置信息
     * @param success 成功回调
     * @param fail 失败回调
    */
    updateLocation(success?: (res: LocationResult) => void, fail?: () => void) {
        const THAT = this;
        wx.getLocation({
            type: "wgs84",
            success (res) {
                // console.log("getLocation >>", res);
                THAT.userLocation.latitude = res.latitude;
                THAT.userLocation.longitude = res.longitude;
                THAT.userLocation.authorize = true;
                // store.updateLocationInfo(res);
                success && success(res);
            },
            fail(err) {
                // console.log("getLocation fail >>", err);
                THAT.userLocation.authorize = false;
                fail && fail();
            }
        })
    }

    /**
     * 获取位置
     * @param callback 授权成功回调
     */
    getLocation(callback?: (res: LocationResult) => void, fail?: () => void) {
        const THAT = this;
        if (this.userLocation.authorize) {
            return this.updateLocation(callback, fail);
        }
        // 由于只能用户主动点击触发`wx.openSetting`，所以一开始`userLocation.authorize`设为`true`
        wx.openSetting({
            success(res) {
                // console.log(res.authSetting);
                if (res.authSetting["scope.userLocation"]) {
                    THAT.updateLocation(callback);
                } else {
                    fail && fail();
                }
            }
        });
    }
}

/** 微信模块 */
const wechat = new ModuleWeChat();

export default wechat;