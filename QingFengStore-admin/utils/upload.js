// 客户端直传
import { dayjs } from 'element-plus'
import { getFileSuffix, showMsg } from './common'

/**
 * 将支付宝云链接转化为https链接
 * @param {string} url 图片云端地址
 * @returns {string} 图片https地址
 */
const cloudToHttps = (url) => {
	return url
		.replace('cloud://', 'https://')
		.replace(url.split('/')[2], url.split('/')[2] + '.normal.cloudstatic.cn')
}

/**
 * 将File/Blob数据包装成上传文件对象
 * @param {File|Blob} file 图片信息对象
 * @returns {object} 上传文件对象
 */
export function FileToUploadObject(file) {
	const data = {
		percentage: 0,
		status: 'ready'
	}
	if (file instanceof File) {
		// File对象
		data.name = file.name
		data.size = file.size
		data.type = getFileSuffix(file)
		data.url = URL.createObjectURL(file)
	} else if (file instanceof Blob) {
		// Blob对象
		data.url = file
	} else {
		showMsg('文件类型错误', 'error')
		throw new Error('文件类型错误')
	}
	return data
}

/**
 * 上传单张图片
 * @param {object} file 图片信息对象
 * @param {number} offset 区分同一时间上传的图片名偏移
 * @param {string} [rootPath] 图片上传存储根路径 默认admin
 */
export function uploadImage(file, offset = 0, rootPath = 'admin') {
	if (typeof file !== 'object') {
		showMsg('文件类型错误', 'error')
		throw new Error('文件类型错误')
	}
	file.status = 'uploading'
	return uniCloud
		.uploadFile({
			filePath: file.cropUrl || file.url,
			cloudPath:
				rootPath +
				'/' +
				dayjs().format('YYYYMMDD') +
				'/' +
				(Date.now() + offset) +
				'.' +
				(file.cropType || file.type),
			onUploadProgress: ({ loaded, total }) => {
				file.percentage = Math.round((loaded * 100) / total)
			}
		})
		.then(({ fileID }) => {
			file.fileID = fileID
			file.status = 'success'
			file.cloudUrl = cloudToHttps(fileID)
		})
		.catch((error) => {
			file.status = 'exception'
			throw error
		})
}
