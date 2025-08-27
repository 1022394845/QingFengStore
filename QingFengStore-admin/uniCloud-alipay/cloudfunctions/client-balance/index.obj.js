// 余额
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
	 * 获取用户当前余额
	 * @param {string} user_id 用户id
	 * @returns {number} balance 当前余额
	 */
	async get(user_id) {
		if (!user_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '用户id不可为空' })

		try {
			const { errCode, errMsg, data } = await dbJQL
				.collection('QingFengStore-balance')
				.where(`user_id == "${user_id}"`)
				.field('balance')
				.orderBy('create_date desc')
				.get({ getOne: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })

			const balance = data?.balance || 0
			return result({
				errCode: 0,
				errMsg: 'success',
				data: { balance },
				type: '获取'
			})
		} catch {
			return defaultError
		}
	},

	/**
	 * 修改用户当前余额
	 * @param {object} data 信息对象
	 * @param {string} data.user_id 用户id
	 * @param {number} data.change 本次变化的余额
	 * @param {number} data.type 类型 1-收入 2-支出
	 * @param {number} data.balance 变化后的余额
	 * @param {string} [data.comment] 备注
	 * @returns {number} updated 成功修改个数(无变化为0)
	 */
	async update(data) {
		const { user_id, change, type, balance } = data
		if (!user_id || !change || !type || typeof balance !== 'number')
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '必要参数不可为空' })

		try {
			const { errCode, errMsg, updated } = await dbJQL.collection('QingFengStore-balance').add(data)

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '修改', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { updated }, type: '修改' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 分页获取余额明细
	 * @param {object} pageInfo 分页信息
	 * @param {number} pageInfo.page 当前页码
	 * @param {number} pageInfo.pageSize 页容量
	 * @param {string} user_id 用户id
	 * @returns {object[]} 明细列表
	 */
	async list({ page = 1, pageSize = 5 } = {}, user_id) {
		if (!user_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '用户id不可为空' })
		if (page < 1) return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '页码异常' })

		try {
			pageSize = Math.min(10, pageSize) // 保证pageSize合理

			const currentSize = (page - 1) * pageSize // 忽略条数

			const { errCode, errMsg, data, count } = await dbJQL
				.collection('QingFengStore-balance')
				.where(`user_id == "${user_id}"`)
				.field('_id, change, type, comment, create_date')
				.orderBy('create_date desc')
				.skip(currentSize)
				.limit(pageSize)
				.get({ getCount: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, total: count, type: '获取' })
		} catch {
			return defaultError
		}
	}
}
