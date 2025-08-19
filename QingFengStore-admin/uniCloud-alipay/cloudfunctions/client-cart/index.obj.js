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
		} catch (err) {
			return defaultError
		}
	},

	/**
	 * 更新用户购物车列表
	 * @param {string} user_id 用户id
	 * @param {object[]} cartList 购物车列表
	 * @returns {number} updated 成功修改个数(无变化为0)
	 */
	async update(user_id, cartData) {
		if (!user_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '用户id不可为空' })

		try {
			const { errCode, errMsg, updated } = await dbJQL
				.collection('QingFengStore-mall-cart')
				.where(`user_id == "${user_id}"`)
				.update({ data: cartData, update_date: Date.now() })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '修改', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { updated }, type: '修改' })
		} catch (err) {
			return defaultError
		}
	}
}
