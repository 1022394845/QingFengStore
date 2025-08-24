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
	async count(user_id) {
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
	},

	/**
	 * 分页获取订单列表
	 * @param {object} pageInfo 分页信息
	 * @param {number} pageInfo.page 当前页码
	 * @param {number} pageInfo.pageSize 页容量
	 * @param {string} user_id 用户id
	 * @param {number[]|number} [status] 筛选获取订单的状态
	 * @return {object[]} 订单列表
	 */
	async list({ page = 1, pageSize = 6 } = {}, user_id, status = null) {
		if (!user_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '用户id不可为空' })
		if (page < 1) return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '页码异常' })

		if (typeof status === 'number') status = [status]

		try {
			pageSize = Math.min(20, pageSize) // 保证pageSize合理

			const currentSize = (page - 1) * pageSize // 忽略条数

			let query = `user_id == "${user_id}"`
			if (status && Array.isArray(status)) query += ' && ' + `status in ${JSON.stringify(status)}`

			// id 金额 状态 创建时间 商品信息
			const { errCode, errMsg, data, count } = await dbJQL
				.collection('QingFengStore-mall-order')
				.where(query)
				.field('_id, total_fee, status, info')
				.orderBy('create_time desc')
				.skip(currentSize)
				.limit(pageSize)
				.get({ getCount: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })

			// 简化商品信息（仅保留用于列表展示内容）
			data.forEach((order) => {
				order.info = order.info.map((item) => ({
					goods_id: item.goods_id,
					name: item.name,
					goods_thumb: item.goods_thumb,
					quantity: item.quantity,
					sku: {
						_id: item.sku._id,
						sku_name: item.sku.sku_name,
						price: item.sku.price
					}
				}))
			})

			return result({ errCode: 0, errMsg: 'success', data, total: count, type: '获取' })
		} catch {
			return defaultError
		}
	}
}
