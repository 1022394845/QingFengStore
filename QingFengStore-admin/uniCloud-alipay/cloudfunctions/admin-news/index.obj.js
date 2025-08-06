// 资讯
let dbJQL = uniCloud.databaseForJQL()
const { result } = require('utils')

module.exports = {
	// 通用预处理器
	_before: function () {
		// 获取客户端信息
		const clientInfo = this.getClientInfo()
		dbJQL = uniCloud.databaseForJQL({ clientInfo })
	},

	/**
	 * 新增资讯
	 * @param {object} data 资讯信息
	 * @param {string} data.title 资讯标题
	 * @param {string} data.content 资讯内容
	 * @param {string} [data.avatar] 资讯缩略图
	 * @returns {object} 返回结果
	 * @returns {string} id 新增资讯id
	 */
	async add(data = {}) {
		try {
			const { errCode, errMsg, id } = await dbJQL
				.collection('QingFengStore-news-articles')
				.add(data)
			if (errCode !== 0) return result({ errCode, errMsg: 'error', type: '新增', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { id }, type: '新增' })
		} catch (err) {
			return result({ errCode: 500, type: '服务器' })
		}
	}
}
