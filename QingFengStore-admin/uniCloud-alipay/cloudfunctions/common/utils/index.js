/**
 * 返回操作结果文字提示信息
 * @param {string} result 操作结果
 * @returns {string} 操作类型+操作结果
 */
function giveOperationMsg(result) {
	if (!result) return '未知错误'
	const msgMap = {
		success: '成功',
		fail: '失败',
		error: '错误',
		warn: '警告',
		require: '缺少必要参数',
		time: '服务器繁忙',
		repair: '功能维修中'
	}

	return msgMap[result]
}

/**
 * 返回通用请求数据结果
 * @param {object} info 请求内容对象
 * @param {number} info.errCode 请求代码 0-成功 400-请求出错 500-服务端错误
 * @param {string} info.errMsg 请求信息
 * @param {object} info.data 请求数据
 * @param {number} info.total 数据项数
 * @param {string} [info.type] 操作类型
 * @param {string} [info.custom] 自定义额外信息
 * @returns {object} 请求结果
 */
function result({ errCode, errMsg, data, total, type = '', custom = '' } = info) {
	const msg = type + giveOperationMsg(errMsg)
	if (custom) msg += ',' + custom
	const response = {
		errCode,
		errMsg: msg
	}
	if (data !== undefined) response.data = data
	if (total !== undefined) response.total = total

	return response
}

module.exports = {
	result
}
