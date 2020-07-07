import StoreUserInfo from "../store/UserInfo";

export default class ModuleAppOption extends StoreUserInfo {
    /** `APP`操作信息 */
    appOption = {
        /** `小程序`导航栏高度 */
        navBarHeight: 0,
        /** `小程序`胶囊距右方间距（方保持左、右间距一致） */
        menuRight: 0, 
        /** `小程序`胶囊距底部间距（保持底部间距一致） */
        menuBottom: 0, 
        /** `小程序`胶囊高度（自定义内容可与胶囊高度保证一致） */
        menuHeight: 0,
        /** `小程序`胶囊宽度 */
        menuWidth: 0,
        /** 状态栏高度 */
        statusBarHeight: 0,
        /** 是否为`iPhoneX`系列（做底部`UI`判断） */
        isIPhoneX: false
    }

    /** 
     * 初始化`APP`操作信息 
     * @learn 条件编译 https://uniapp.dcloud.io/platform
    */
    initAppOption() {
        const systemInfo = uni.getSystemInfoSync();
        
        // 网页中`model`只有`iPhone`字段，所以不能这样判断
        // this.appOption.isIPhoneX = systemInfo.model.search('iPhone X') == 0 ? true : false;

        const isIos = systemInfo.system.toLocaleLowerCase().includes("ios");
        const vaule = (systemInfo.screenWidth / systemInfo.screenHeight) < 0.5;

        this.appOption.isIPhoneX = (isIos && vaule);
        this.appOption.statusBarHeight = systemInfo.statusBarHeight;

        // #ifdef MP
        const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
        // 导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
        this.appOption.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
        this.appOption.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
        this.appOption.menuBottom = menuButtonInfo.top - systemInfo.statusBarHeight;
        this.appOption.menuHeight = menuButtonInfo.height;
        this.appOption.menuWidth = menuButtonInfo.width;
        // #endif
    }   
}