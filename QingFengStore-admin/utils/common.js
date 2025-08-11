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
 * 判断字符串是否为网络url地址
 * @param {string} url 字符串
 * @returns {boolean} 是-true
 */
export function isHttpUrl(url) {
	return url.startsWith('https://') || url.startsWith('http://')
}

/**
 * 获取文件名后缀
 * @param {string|{type:string}} fileData 文件类型/文件数据 通常为file.raw
 * @returns {string} 文件后缀 如jpg
 */
export function getFileSuffix(fileData) {
	// fileData.type: image/png
	let type = ''
	if (typeof fileData === 'string') {
		// 若type为文件网络url
		if (isHttpUrl(fileData)) {
			const lastDotIndex = fileData.lastIndexOf('.')
			if (lastDotIndex === -1) return ''
			return fileData.substring(lastDotIndex)
		} else type = fileData
	} else type = fileData.type
	if (!type) return ''
	const gapIndex = type.lastIndexOf('/')
	if (gapIndex === -1) return ''
	return type.substring(gapIndex + 1)
}

/**
 * 将图片URL转换为Blob对象
 * @param {string} url 图片的URL地址
 * @returns {Promise<Blob>} 包含Blob对象的Promise
 */
export function urlToBlob(url) {
	return new Promise((resolve, reject) => {
		// 使用fetch API获取资源
		fetch(url, {
			mode: 'cors', // 处理跨域
			cache: 'no-store' // 不缓存
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`请求失败，状态码: ${response.status}`)
				}
				// 将响应转换为Blob对象
				return response.blob()
			})
			.then((blob) => {
				resolve(blob)
			})
			.catch((error) => {
				reject(new Error(`转换失败: ${error.message}`))
			})
	})
}
