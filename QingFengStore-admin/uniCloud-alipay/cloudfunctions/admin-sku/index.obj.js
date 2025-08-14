// sku
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
	 * 新增sku
	 * @param {object} data sku信息
	 * @param {string} data.goods_id 商品id
	 * @param {string} data.sku_name sku名称
	 * @param {number} data.price sku价格
	 * @param {string} data.[sku_thumb] sku缩略图
	 * @param {number} [data.market_price] sku市场价
	 * @param {number} [data.stock] sku库存 默认为0
	 * @param {boolean} [data.is_on_sale] sku是否上架 默认为不上架false
	 * @returns {string} id 新增sku_id
	 */
	async add(data = {}) {
		if (!data.goods_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '商品id不可为空' })

		try {
			const { errCode, id } = await dbJQL.collection('QingFengStore-mall-sku').add(data)

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '新增', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { id }, type: '新增' })
		} catch (err) {
			console.log(err)
			return defaultError
		}
	},

	/**
	 * 获取sku详情
	 * @param {string} id sku_id
	 * @returns {object} sku信息
	 */
	async detail(id) {
		if (!id) return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '参数不可为空' })

		try {
			// sku_id goods_id sku名称 缩略图 出售价格 市场价格 库存数
			const { errCode, errMsg, data } = await dbJQL
				.collection('QingFengStore-mall-sku')
				.doc(id)
				.field('_id, goods_id, sku_name, sku_thumb, price, market_price, stock, is_on_sale')
				.get({ getOne: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, type: '获取' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 修改sku信息
	 * @param {object} data sku信息
	 * @param {string} data._id sku_id
	 * @param {string} data.goods_id 商品id
	 * @param {string} [data.sku_name] sku名称
	 * @param {number} [data.price] sku价格
	 * @param {string} data.[sku_thumb] sku缩略图
	 * @param {number} [data.market_price] sku市场价
	 * @param {number} [data.stock] sku库存 默认为0
	 * @param {boolean} [data.is_on_sale] sku是否上架 默认为不上架false
	 * @returns {number} updated 成功修改个数(无变化为0)
	 */
	async update(data = {}) {
		if (!data._id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '规格id不可为空' })

		try {
			const { errCode, errMsg, updated } = await dbJQL
				.collection('QingFengStore-mall-sku')
				.doc(data._id)
				.update({ ...data, update_date: Date.now() })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '修改', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { updated }, type: '修改' })
		} catch {
			return defaultError
		}
	}

	// /**
	//  * 删除商品
	//  * @param {string[]|string} ids 删除id数组/单个id
	//  * @returns {number} deleted 成功删除个数
	//  */
	// async remove(ids = []) {
	// 	if (typeof ids === 'string') {
	// 		// 参数为单个id
	// 		if (!ids)
	// 			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '参数不可为空' })
	// 		ids = [ids]
	// 	}
	// 	if (!Array.isArray(ids))
	// 		return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '参数类型错误' })
	// 	// 数组不可为空
	// 	if (!ids.length)
	// 		return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '参数不可为空' })

	// 	try {
	// 		const { errCode, errMsg, deleted } = await dbJQL
	// 			.collection('QingFengStore-mall-goods')
	// 			.where(`_id in ${JSON.stringify(ids)}`)
	// 			.remove()

	// 		if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '删除', custom: errMsg })
	// 		return result({ errCode: 0, errMsg: 'success', data: { deleted }, type: '删除' })
	// 	} catch {
	// 		return defaultError
	// 	}
	// }
}
