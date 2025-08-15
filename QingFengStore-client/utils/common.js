/**
 * 操作提示信息
 * @param {string} title 提示内容
 * @param {string} [icon] 图标 默认'null'
 * @param {number} [duration] 持续时间ms 默认1500
 */
export function showMsg(title, icon = 'null', duration = 1500) {
	if (!title) return
	return uni.showToast({
		title,
		icon,
		duration
	})
}
