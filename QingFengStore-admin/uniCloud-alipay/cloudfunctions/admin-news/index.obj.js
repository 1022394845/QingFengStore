// 资讯
let dbJQL = uniCloud.databaseForJQL()
const { result } = require('utils')
const defaultError = result({ errCode: 500, errMsg: 'error', type: '服务器' })

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
	 * @returns {string} id 新增资讯id
	 */
	async add(data = {}) {
		try {
			const { errCode, errMsg, id } = await dbJQL
				.collection('QingFengStore-news-articles')
				.add(data)

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '新增', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { id }, type: '新增' })
		} catch (err) {
			return defaultError
		}
	},

	/**
	 * 获取资讯列表
	 * @param {object} pageInfo 分页信息
	 * @param {number} pageInfo.page 当前页码
	 * @param {number} pageInfo.pageSize 页容量
	 * @param {string} [keyword] 搜索关键词
	 * @returns {object[]} 资讯列表
	 */
	async list({ page = 1, pageSize = 10 } = {}, keyword = '') {
		try {
			if (page < 1) throw new Error('页码异常')
			pageSize = Math.min(20, pageSize) // 保证pageSize合理

			const currentSize = (page - 1) * pageSize // 忽略条数

			const query = keyword ? `${new RegExp(keyword, 'i')}.test(title)` : null // 搜索关键词

			const listTemp = dbJQL
				.collection('QingFengStore-news-articles')
				.where(query)
				// .orderBy('publish_date desc')
				.orderBy('publish_date')
				.skip(currentSize)
				.limit(pageSize)
				.getTemp()
			// 需要获取资讯对应的发布者信息
			const userTemp = dbJQL.collection('uni-id-users').field('_id, nickname').getTemp()
			// 文章id 标题 封面 发布者 阅读数 推荐 发布时间
			const { errCode, errMsg, data, count } = await dbJQL
				.collection(listTemp, userTemp)
				.field(
					'_id, arrayElemAt(user_id, 0) as user, title,avatar, view_count, is_sticky, publish_date'
				)
				.get({ getCount: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, total: count, type: '获取' })
		} catch (err) {
			return defaultError
		}
	},

	/**
	 * 删除资讯
	 * @param {string[]|string} ids 删除id数组/单个id
	 * @returns {number} deleted 成功删除个数
	 */
	async remove(ids = []) {
		if (typeof ids === 'string') {
			// 参数为单个id
			if (!ids)
				return result({ errCode: 400, errMsg: 'fail', type: '请求', custom: '参数不可为空' })
			ids = [ids]
		}
		if (!Array.isArray(ids))
			return result({ errCode: 400, errMsg: 'fail', type: '请求', custom: '参数类型错误' })
		// 数组不可为空
		if (!ids.length)
			return result({ errCode: 400, errMsg: 'fail', type: '请求', custom: '参数不可为空' })

		try {
			const { errCode, errMsg, deleted } = await dbJQL
				.collection('QingFengStore-news-articles')
				.where(`_id in ${JSON.stringify(ids)}`)
				.remove()

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '删除', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { deleted }, type: '删除' })
		} catch {
			return defaultError
		}
	}
}
