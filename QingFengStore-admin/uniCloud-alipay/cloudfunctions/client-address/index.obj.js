// 地址
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
	 * 获取地址列表
	 * @param {string} user_id 用户id
	 * @return {object[]} 资讯列表
	 */
	async list(user_id) {
		if (!user_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '用户id不可为空' })

		try {
			const { errCode, errMsg, data } = await dbJQL
				.collection('QingFengStore-address')
				.where(`user_id == "${user_id}"`)
				.get()

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, type: '获取' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 新增地址
	 * @param {object} data 地址信息
	 * @param {string} data.user_id 用户id
	 * @param {string} data.name 收货人
	 * @param {string} data.phone 手机号码
	 * @param {string} data.province_code 省级编码
	 * @param {string} data.city_code 地级编码
	 * @param {string} data.area_code 区级编码
	 * @param {string} data.detail 详细地址
	 * @param {boolean} [data.default] 是否为默认地址
	 * @return {string} id 新增商品id
	 */
	async add(data = {}) {
		try {
			const { errCode, id } = await dbJQL.collection('QingFengStore-address').add(data)

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '新增', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { id }, type: '新增' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 修改地址
	 * @param {object} data 地址信息
	 * @param {string} data._id 地址id
	 * @param {string} [data.user_id] 用户id
	 * @param {string} [data.name] 收货人
	 * @param {string} [data.phone] 手机号码
	 * @param {string} [data.province_code] 省级编码
	 * @param {string} [data.city_code] 地级编码
	 * @param {string} [data.area_code] 区级编码
	 * @param {string} [data.detail] 详细地址
	 * @param {boolean} [data.default] 是否为默认地址
	 * @return {number} updated 成功修改个数(无变化为0)
	 */
	async update(data = {}) {
		if (!data._id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '地址id不可为空' })

		try {
			const { errCode, errMsg, updated } = await dbJQL
				.collection('QingFengStore-address')
				.doc(data._id)
				.update(data)

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '修改', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { updated }, type: '修改' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 删除地址
	 * @param {string} id 删除地址id
	 * @return {number} deleted 成功删除个数
	 */
	async remove(id) {
		if (!id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '地址id不可为空' })

		try {
			const { errCode, errMsg, deleted } = await dbJQL
				.collection('QingFengStore-address')
				.doc(id)
				.remove()

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '删除', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { deleted }, type: '删除' })
		} catch {
			return defaultError
		}
	}
}
