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
	};

	return wrapper
}