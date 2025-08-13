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
	 * @param {object} data 分类信息
	 * @param {string} data.name 分类名称
	 * @param {number} [data.sort] 分类排序
	 * @param {boolean} [data.status] 分类状态
	 * @returns {string} id 新增分类id
	 */
	async add(data = {}) {
		try {
			const { errCode, id } = await dbJQL.collection('QingFengStore-mall-categories').add(data)

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '新增', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { id }, type: '新增' })
		} catch (err) {
			return defaultError
		}
	},

	/**
	 * 修改分类
	 * @param {object} data 分类信息
	 * @param {string} data._id 资讯id
	 * @param {string} [data.name] 分类名称
	 * @param {number} [data.sort] 分类排序
	 * @param {boolean} [data.status] 分类状态
	 * @returns {number} updated 成功修改个数(无变化为0)
	 */
	async update(data = {}) {
		if (!data._id) result({ errCode: 400, errMsg: 'error', type: '请求', custom: '分类id不可为空' })

		try {
			const { errCode, errMsg, updated } = await dbJQL
				.collection('QingFengStore-mall-categories')
				.doc(data._id)
				.update(data)

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '修改', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { updated }, type: '修改' })
		} catch (err) {
			return defaultError
		}
	},

	/**
	 * 删除分类
	 * @param {string[]|string} ids 删除id数组/单个id
	 * @returns {number} deleted 成功删除个数
	 */
	async remove(ids = []) {
		if (typeof ids === 'string') {
			// 参数为单个id
			if (!ids)
				return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '参数不可为空' })
			ids = [ids]
		}
		if (!Array.isArray(ids))
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '参数类型错误' })
		// 数组不可为空
		if (!ids.length)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '参数不可为空' })

		try {
			const { errCode, errMsg, deleted } = await dbJQL
				.collection('QingFengStore-mall-categories')
				.where(`_id in ${JSON.stringify(ids)}`)
				.remove()

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '删除', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { deleted }, type: '删除' })
		} catch {
			return defaultError
		}
	}
}
