// 资讯
let dbJQL = uniCloud.databaseForJQL()

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
	 * @returns {object} 返回值描述
	 */
	async add(data = {}) {
		return await dbJQL.collection('QingFengStore-news-articles').add(data)
	}
}
