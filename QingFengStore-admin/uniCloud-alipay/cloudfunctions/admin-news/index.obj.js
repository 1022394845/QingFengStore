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
	},

	/**
	 * 获取资讯列表
	 * @param {object} pageInfo 分页信息
	 * @param {number} pageInfo.page 当前页码
	 * @param {number} pageInfo.pageSize 页容量
	 * @param {string} [keyword] 搜索关键词
	 * @returns {object} 返回结果
	 */
	async list({ page = 1, pageSize = 10 } = {}, keyword = '') {
		try {
			if (page < 1) throw new Error('页码异常')
			pageSize = Math.min(20, pageSize) // 保证pageSize合理

			const currentSize = (page - 1) * pageSize // 忽略条数

			const listTemp = dbJQL
				.collection('QingFengStore-news-articles')
				.orderBy('publish_date desc')
				.skip(currentSize)
				.limit(pageSize)
				.getTemp()
			// 需要获取资讯对应的发布者信息
			const userTemp = dbJQL.collection('uni-id-users').field('_id,nickname').getTemp()
			// 文章id 标题 封面 发布者 阅读数 推荐 发布时间
			const { errCode, errMsg, data, count } = await dbJQL
				.collection(listTemp, userTemp)
				.field(
					'_id, arrayElemAt(user_id, 0) as user, title,avatar, view_count, is_sticky, publish_date'
				)
				.get({ getCount: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'error', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, total: count, type: '获取' })
		} catch (err) {
			return result({ errCode: 500, type: '服务器' })
		}
	}
}
