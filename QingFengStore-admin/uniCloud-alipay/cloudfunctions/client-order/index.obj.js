// 订单
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
	 * 获取订单详情
	 * @param {string} id 订单id
	 * @returns {object} 订单详情
	 */
	async detail(id) {
		if (!id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '订单id不可为空' })

		try {
			const { errCode, errMsg, data } = await dbJQL
				.collection('QingFengStore-mall-order')
				.doc(id)
				.get({ getOne: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, type: '获取' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 创建订单
	 * @param {object} data 订单信息
	 * @param {string} data.user_id 用户id
	 * @param {number} data.total_fee 订单总金额
	 * @param {string} data.pay_type 支付渠道
	 * @param {object[]} data.info 商品信息
	 * @returns {string} id 新增订单id
	 */
	async create(data = {}) {
		const { user_id, total_fee, pay_type, info } = data
		if (!user_id || !total_fee || !pay_type || !info)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '必要参数缺失' })

		try {
			const now = Date.now()
			const { errCode, errMsg, id } = await dbJQL.collection('QingFengStore-mall-order').add({
				...data,
				create_time: now,
				update_time: now
			})

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '创建', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { id }, type: '创建' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 统计用户所有订单按状态分组数量
	 * @param {string} user_id 用户id
	 * @returns {object} 订单数量信息
	 */
	async list(user_id) {
		if (!user_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '用户id不可为空' })

		try {
			const { errCode, errMsg, data } = await dbJQL
				.collection('QingFengStore-mall-order')
				.where(`user_id == "${user_id}"`)
				.groupBy('status')
				.groupField('count(*) as total')
				.get()

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, type: '获取' })
		} catch {
			return defaultError
		}
	}
}
