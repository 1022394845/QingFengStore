// 资讯
let dbJQL = uniCloud.databaseForJQL()
let db = uniCloud.database()
let dbCmd = db.command
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
	 * 获取购物车列表
	 * @param {string} user_id 用户id
	 * @returns {object[]} 资讯列表
	 */
	async list(user_id) {
		if (!user_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '用户id不可为空' })

		try {
			const {
				errCode,
				errMsg,
				data = null
			} = await dbJQL
				.collection('QingFengStore-mall-cart')
				.where(`user_id == "${user_id}"`)
				.get({ getOne: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, type: '获取' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 更新用户购物车列表
	 * @param {string} user_id 用户id
	 * @param {object[]} cartList 购物车列表
	 * @param {} [localUpdateDate] 本地修改时间
	 * @returns {number} updated 成功修改个数(无变化为0)
	 */
	async update(user_id, cartData, localUpdateDate) {
		if (!user_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '用户id不可为空' })
		if (!localUpdateDate)
			return result({
				errCode: 400,
				errMsg: 'error',
				type: '请求',
				custom: '本地修改时间不可为空'
			})

		try {
			const existTest = await dbJQL
				.collection('QingFengStore-mall-cart')
				.where(`user_id == "${user_id}"`)
				.count()
			if (existTest.errCode !== 0) throw new Error()

			if (existTest.total > 0) {
				// 用户购物车数据已存在
				const { errCode, errMsg, updated } = await dbJQL
					.collection('QingFengStore-mall-cart')
					.where(`user_id == "${user_id}"`)
					.update({ data: cartData, update_date: localUpdateDate })

				if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '修改', custom: errMsg })
				return result({ errCode: 0, errMsg: 'success', data: { updated }, type: '修改' })
			} else {
				// 新建用户购物车数据
				const { errCode, errMsg, id } = await dbJQL
					.collection('QingFengStore-mall-cart')
					.add({ data: cartData, create_date: Date.now(), update_date: localUpdateDate })

				if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '新增', custom: errMsg })
				return result({ errCode: 0, errMsg: 'success', data: { id }, type: '新增' })
			}
		} catch {
			return defaultError
		}
	}
}
