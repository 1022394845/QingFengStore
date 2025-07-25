import {
	computed,
	unref
} from "vue"

// 获取系统信息
const SYSTEM_WINDOW_INFO = uni.getWindowInfo()
// 胶囊按钮
const MENU_BUTTON_INFO = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : {}

// 状态栏高度 px
export const statusBarHeight = (SYSTEM_WINDOW_INFO.statusBarHeight || 0)

// 标题栏高度 px
export const titleBarHeight =
	(!MENU_BUTTON_INFO.height || !MENU_BUTTON_INFO.top) ?
	40 :
	MENU_BUTTON_INFO.height + (MENU_BUTTON_INFO.top - statusBarHeight) * 2;

// 导航栏高度 px
export const navBarHeight = statusBarHeight + titleBarHeight