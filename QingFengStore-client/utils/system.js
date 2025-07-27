import {
	computed,
	unref
} from "vue"

// 获取系统信息
const SYSTEM_INFO = uni.getSystemInfoSync()
const SYSTEM_WINDOW_INFO = uni.getWindowInfo()
// 胶囊按钮
const MENU_BUTTON_INFO = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : {}

// 状态栏高度 px
export const statusBarHeight = (SYSTEM_WINDOW_INFO.statusBarHeight || 0)
export const statusBarHeight_px = `${statusBarHeight}px`

// 标题栏高度 px
export const titleBarHeight =
	(!MENU_BUTTON_INFO.height || !MENU_BUTTON_INFO.top) ?
	40 :
	MENU_BUTTON_INFO.height + (MENU_BUTTON_INFO.top - statusBarHeight) * 2;
export const titleBarHeight_px = `${titleBarHeight}px`

// 导航栏高度 px
export const navBarHeight = statusBarHeight + titleBarHeight
export const navBarHeight_px = `${navBarHeight}px`

// 搜索框高度 rpx
export const searchHeight = 90
export const searchHeight_rpx = '90rpx'

// 视口容器高度 px
export const containerHeight = SYSTEM_WINDOW_INFO.windowHeight - navBarHeight
export const containerHeight_px = `${containerHeight}px`

// 标签栏高度 px
export const tabBarHeight = SYSTEM_INFO.uniPlatform === 'web' ? 50 : 0
export const tabBarHeight_px = `${tabBarHeight}px`

// 结算栏高度 rpx
export const settleBarHeight = 100
export const settleBarHeight_rpx = '100rpx'