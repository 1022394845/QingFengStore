import { ElMessage } from 'element-plus'
/**
 * 操作提示
 * @param {string } message 提示内容
 * @param {string} [type] 提示类型 info success warning error
 * @param {number} [duration] 持续时间
 */
export function showMsg(message, type = 'info', duration = 3000) {
	if (!message) return
	return ElMessage({ message, type, duration })
}
