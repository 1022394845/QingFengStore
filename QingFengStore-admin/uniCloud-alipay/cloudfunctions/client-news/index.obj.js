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
	 * 获取资讯列表
	 * @param {object} pageInfo 分页信息
	 * @param {number} pageInfo.page 当前页码
	 * @param {number} pageInfo.pageSize 页容量
	 * @param {string} [keyword] 搜索关键词
	 * @returns {object[]} 资讯列表
	 */
	async list({ page = 1, pageSize = 10 } = {}, keyword = '') {
		if (page < 1) return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '页码异常' })

		try {
			pageSize = Math.min(20, pageSize) // 保证pageSize合理

			const currentSize = (page - 1) * pageSize // 忽略条数

			let query = keyword ? `${new RegExp(keyword, 'i')}.test(title)` : '' // 搜索关键词
			if (query) query += ` && `
			query += `article_status == 1` // 文章可见

			const listTemp = dbJQL
				.collection('QingFengStore-news-articles')
				.where(query)
				.orderBy('publish_date desc')
				.skip(currentSize)
				.limit(pageSize)
				.getTemp()
			// 需要获取资讯对应的发布者信息
			const userTemp = dbJQL.collection('uni-id-users').field('_id, nickname').getTemp()
			// 文章id 标题 封面 发布者 阅读数 文章状态 推荐状态 发布时间
			const { errCode, errMsg, data, count } = await dbJQL
				.collection(listTemp, userTemp)
				.field('_id, arrayElemAt(user_id, 0) as user, title, avatar, publish_date')
				.get({ getCount: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, total: count, type: '获取' })
		} catch (err) {
			return defaultError
		}
	},

	/**
	 * 获取资讯详情
	 * @param {string} id 资讯id
	 * @returns {object} 资讯信息
	 */
	async detail(id) {
		if (!id) return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '参数不可为空' })

		try {
			const dataTemp = dbJQL
				.collection('QingFengStore-news-articles')
				.where(`_id == "${id}" && article_status == 1`)
				.getTemp()
			const userTemp = dbJQL.collection('uni-id-users').field('_id, nickname').getTemp()
			const { errCode, errMsg, data, count } = await dbJQL
				.collection(dataTemp, userTemp)
				.field(
					'_id, arrayElemAt(user_id, 0) as user, title, avatar, content, view_count, publish_date'
				)
				.get({ getOne: true })

			if (errCode !== 0 || !data)
				return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, type: '获取' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 获取首页推荐公告
	 * @param {number} size 获取条数
	 * @returns {object[]} 首页推荐公告列表
	 */
	async sticky(size = 5) {
		if (size < 1) return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '参数异常' })

		try {
			size = Math.min(10, size) // 保证size合理

			// 文章id 标题
			const { errCode, errMsg, data, count } = await dbJQL
				.collection('QingFengStore-news-articles')
				.where(`article_status == 1 && is_sticky == true`)
				.field('_id, title')
				.limit(size)
				.get()

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, total: count, type: '获取' })
		} catch (err) {
			return defaultError
		}
	}
}
