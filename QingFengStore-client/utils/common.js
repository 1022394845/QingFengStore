/**
 * 操作提示信息
 * @param {string} title 提示内容
 * @param {string} [icon] 图标 默认'none'
 * @param {number} [duration] 持续时间ms 默认1500
 */
export function showMsg(title, icon = 'none', duration = 1500) {
	if (!title) return
	return uni.showToast({
		title,
		icon,
		duration
	})
}

/**
 * 监听元素进入视口并执行回调函数
 * @param {string} target 目标元素选择器
 * @param {function} callback 元素可见时执行的回调函数
 * @param {boolean} [once] 是否仅执行一次回调后卸载 默认为false
 * @event disconnect 手动卸载监听
 */
export function createObserver(target, callback, once = false) {
	if (!target || typeof callback !== 'function') return null

	// 创建IntersectionObserver实例
	const observer = uni.createIntersectionObserver()
	observer.relativeToViewport().observe(target, (res) => {
		if (res.intersectionRatio > 0) {
			callback()
			// 如果仅执行一次
			if (once) {
				observer.disconnect()
			}
		}
	})

	return observer
}

/**
 * 判断用户是否登录
 * @returns {string|null} uid 当前用户uid
 */
export function isLogin() {
	const { uid } = uniCloud.getCurrentUserInfo()
	return uid
}

/**
 * 节流
 * @param {function} func - 执行函数
 * @param {number} delay - 间隔时间(ms)
 */
export function throttle(func, delay = 100) {
	let isThrottled = false
	let lastArgs = null
	let lastThis = null
	let allowLastCall = true // 允许执行最后一次回调

	// 创建节流包装函数
	function wrapper(...args) {
		if (!allowLastCall) {
			// 不允许执行最后一次回调，清空缓存
			lastArgs = lastThis = null
			return
		}

		if (isThrottled) {
			// 记录最新的参数，以便在节流结束后使用
			lastArgs = args
			lastThis = this
			return
		}

		// 执行原始函数
		func.apply(this, args)
		isThrottled = true

		// 在指定延迟后重置节流状态
		setTimeout(() => {
			isThrottled = false
			// 如果在节流期间有新的调用，执行最后一次
			if (lastArgs && allowLastCall) {
				wrapper.apply(lastThis, lastArgs)
				lastArgs = lastThis = null
			}
		}, delay)
	}

	// 禁用调用最后一次回调控制
	wrapper.disableLastCall = () => {
		allowLastCall = false
		lastArgs = lastThis = null
	}

	wrapper.enableLastCall = () => {
		allowLastCall = true
	}

	// 清除节流状态
	wrapper.cancel = () => {
		clearTimeout(timeout)
		isThrottled = false
		lastArgs = lastThis = null
	}

	return wrapper
}

/**
 * 防抖
 * @param {function} func - 执行函数
 * @param {number} wait - 等待时间(ms)
 */
export function debounce(func, wait = 100) {
	let timeout = null // 用于存储定时器ID
	let lastArgs = null // 存储最后一次调用的参数
	let lastThis = null // 存储最后一次调用的this指向
	let isEnabled = true // 控制防抖是否启用

	// 创建防抖包装函数
	function wrapper(...args) {
		if (!isEnabled) {
			// 若防抖未启用，直接执行原始函数
			func.apply(this, args)
			return
		}

		// 记录最新的参数和this，用于延迟后执行
		lastArgs = args
		lastThis = this

		// 清除之前的定时器，重新计时
		clearTimeout(timeout)

		// 设定新的定时器，延迟执行
		timeout = setTimeout(() => {
			if (lastArgs && isEnabled) {
				func.apply(lastThis, lastArgs)
				lastArgs = lastThis = null // 执行后清空缓存
			}
		}, wait)
	}

	// 禁用防抖（直接执行后续调用）
	wrapper.disable = () => {
		isEnabled = false
		clearTimeout(timeout) // 清除未执行的定时器
		timeout = lastArgs = lastThis = null
	}

	// 启用防抖
	wrapper.enable = () => {
		isEnabled = true
	}

	// 立即执行当前缓存的调用（并清除定时器）
	wrapper.flush = () => {
		if (timeout) {
			clearTimeout(timeout)
			timeout = null
			if (lastArgs && isEnabled) {
				func.apply(lastThis, lastArgs)
				lastArgs = lastThis = null
			}
		}
	}

	// 取消当前防抖（不执行缓存的调用）
	wrapper.cancel = () => {
		clearTimeout(timeout)
		timeout = lastArgs = lastThis = null
	}

	return wrapper
}
