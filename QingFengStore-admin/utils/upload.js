// 客户端直传
import { dayjs } from 'element-plus'
import error from '../store/modules/error'

// 将支付宝云云端连接转为Https
const cloudToHttps = (url) => {
	return url
		.replace('cloud://', 'https://')
		.replace(url.split('/')[2], url.split('/')[2] + '.normal.cloudstatic.cn')
}

/**
 * 上传单张图片
 * @param {object} file 图片信息对象/路径
 * @param {number} offset 区分同一时间上传的图片名偏移
 * @param {string} [rootPath] 图片上传存储根路径 默认admin
 */
export function uploadImage(file, offset = 0, rootPath = 'admin') {
	if (typeof file !== 'object') throw new Error('文件类型错误')
	file.status = 1
	return uniCloud
		.uploadFile({
			filePath: file.path,
			cloudPath:
				rootPath + '/' + dayjs().format('YYYYMMDD') + '/' + (Date.now() + offset) + file.suffix,
			onUploadProgress: ({ loaded, total }) => {
				file.progress = Math.round((loaded * 100) / total)
			}
		})
		.then(({ fileID }) => {
			file.fileID = fileID
			file.status = 2
			file.url = cloudToHttps(fileID)
		})
		.catch((error) => {
			file.status = 3
			throw error
		})
}
