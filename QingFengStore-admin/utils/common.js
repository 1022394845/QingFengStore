import { ElMessage } from 'element-plus'
/**
 * 操作提示
 * @param {string} message 提示内容
 * @param {string} [type] 提示类型 info success warning error
 * @param {number} [duration] 持续时间
 */
export function showMsg(message, type = 'info', duration = 3000) {
	if (!message) return
	return ElMessage({ message, type, duration })
}

/**
 * 获取文件名后缀
 * @param {string|{type:string}} fileData 文件类型/文件数据 通常为file.raw
 * @returns {string} 文件后缀 如jpg
 */
export function getFileSuffix(fileData) {
	// fileData.type: image/png
	let type = ''
	if (typeof fileData === 'string') type = fileData
	else type = fileData.type
	if (!type) return ''
	const gapIndex = type.lastIndexOf('/')
	if (gapIndex === -1) return ''
	return type.substring(gapIndex + 1)
}
