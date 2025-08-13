// 分类
let dbJQL = uniCloud.databaseForJQL()
const { result } = require('utils')
const defaultError = result({ errCode: 500, errMsg: 'error', type: '服务器' })

module.exports = {
	_before: function () {
		// 获取客户端信息
		const clientInfo = this.getClientInfo()
		dbJQL = uniCloud.databaseForJQL({ clientInfo })
	},

	/**
	 * 获取分类列表
	 * @returns {object[]} 资讯列表
	 */
	async list() {
		try {
			const { errCode, data, count } = await dbJQL
				.collection('QingFengStore-mall-categories')
				.orderBy('sort, create_date desc')
				.get({ getCount: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, total: count, type: '获取' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 新增分类
	 * @param {string} name 分类名称
	 * @param {number} [sort] 分类排序
	 * @param {boolean} [status] 分类状态
	 * @returns {string} id 新增分类id
	 */
	async add(name, sort = 0, status = true) {
		if (!name) result({ errCode: 400, errMsg: 'error', type: '请求', custom: '分类名称不可为空' })

		try {
			const { errCode, id } = await dbJQL
				.collection('QingFengStore-mall-categories')
				.add({ name, sort, status })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '新增', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { id }, type: '新增' })
		} catch (err) {
			return defaultError
		}
	}
}
