// 客户端直传
import { dayjs } from 'element-plus'
import { getFileSuffix, showMsg } from './common'

const cloudFileIdSuffix = '.normal.cloudstatic.cn'

/**
 * 将支付宝云fileId转化为https链接
 * @param {string} cloudUrl 图片云fileId
 * @returns {string} 图片https地址
 */
function cloudToHttps(cloudUrl) {
	// 将cloud://替换为https://
	let httpsUrl = cloudUrl.replace('cloud://', 'https://')

	// 分割URL获取各个部分
	const parts = httpsUrl.split('/')

	// 添加cloudFileIdSuffix后缀
	if (parts.length >= 3) parts[2] += cloudFileIdSuffix

	// 重新组合为完整的https链接
	return parts.join('/')
}

console.log(
	httpsToCloud('https://env-00jxtt1yph9m.normal.cloudstatic.cn/admin/20250810/1754794796603.jpeg')
)

/**
 * 将https链接转化为支付宝云fileId 注意：仅支持将fileId转化成url的逆向转化
 * @param {string} httpsUrl 图片https地址
 * @returns {string} 图片云端fileId
 */
export function httpsToCloud(httpsUrl) {
	// 将https://替换回cloud://
	let cloudUrl = httpsUrl.replace('https://', 'cloud://')

	// 分割URL获取各个部分
	const parts = cloudUrl.split('/')

	// 移除域名中的cloudFileIdSuffix后缀
	if (parts.length >= 3) parts[2] = parts[2].replace('.normal.cloudstatic.cn', '')

	// 重新组合成cloud链接
	return parts.join('/')
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

/**
 * 批量删除图片
 * @param {string[]} fileIds 图片云端fileId数组
 */
export async function removeImage(fileIds) {
	if (!Array.isArray(fileIds)) {
		if (typeof fileIds === 'string') fileIds = [fileIds]
		else return Promise.reject()
	}

	// 数组为空取消操作
	if (fileIds.length === 0) return Promise.resolve()

	// 客户端无法直接操作，采用云对象移除
	const uploadCloudObj = uniCloud.importObject('admin-upload')
	return await uploadCloudObj.remove(fileIds)
}
