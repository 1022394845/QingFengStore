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
 * @param {string} selector  元素选择器（如 '#id' 或 '.class'）
 * @param {function} callback  元素可见时执行的回调函数
 * @param {boolean} [once] 是否仅执行一次回调后卸载 默认为false
 * @param {object} [options] 可选配置项
 * @event disconnect 手动卸载监听
 */
export function observeElement(selector, callback, once = false, options = {}) {
	if (!selector || !callback) return null

	// 创建IntersectionObserver实例
	const observer = uni.createIntersectionObserver(
		options.context || getCurrentPages()[getCurrentPages().length - 1],
		{
			threshold: options.threshold || 0, // 可见比例阈值
			rootMargin: options.rootMargin || '0px' // 根元素外边距
		}
	)

	// 监听目标元素
	observer.observe(selector, (res) => {
		// 当元素可见比例大于阈值时执行回调
		if (res.intersectionRatio > 0) {
			// 执行回调并传入相关信息
			callback(res)
			// 卸载监听
			if (once) observer.disconnect()
		}
	})

	return observer
}
