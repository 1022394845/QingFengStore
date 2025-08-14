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
	}

	// /**
	//  * 修改商品
	//  * @param {object} data 商品信息
	//  * @param {string} data._id 商品id
	//  * @param {string} [data.name] 商品名称
	//  * @param {string} [data.category_id] 商品分类id
	//  * @param {string} [data.goods_desc] 商品详情
	//  * @param {array} [data.goods_banner_imgs] 商品展示图
	//  * @param {string} [data.goods_thumb] 商品缩略图 默认为第一张展示图
	//  * @param {boolean} [data.is_on_sale] 商品是否上架 默认为不上架false
	//  * @returns {number} updated 成功修改个数(无变化为0)
	//  */
	// async update(data = {}) {
	// 	if (!data._id)
	// 		return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '商品id不可为空' })

	// 	try {
	// 		const { errCode, errMsg, updated } = await dbJQL
	// 			.collection('QingFengStore-mall-goods')
	// 			.doc(data._id)
	// 			.update({ ...data, last_modify_date: Date.now() })

	// 		if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '修改', custom: errMsg })
	// 		return result({ errCode: 0, errMsg: 'success', data: { updated }, type: '修改' })
	// 	} catch {
	// 		return defaultError
	// 	}
	// },

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
	// },

	// /**
	//  * 获取商品详情
	//  * @param {string} id 商品id
	//  * @returns {object} 资讯信息
	//  */
	// async detail(id) {
	// 	if (!id) return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '参数不可为空' })

	// 	try {
	// 		// 商品id 分类id 商品名称 展示图片 商品详情 上架状态
	// 		const { errCode, errMsg, data, count } = await dbJQL
	// 			.collection('QingFengStore-mall-goods')
	// 			.where(`_id == "${id}"`)
	// 			.field('_id, category_id, name, goods_banner_imgs, goods_desc, is_on_sale')
	// 			.get({ getOne: true })

	// 		if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
	// 		return result({ errCode: 0, errMsg: 'success', data, type: '获取' })
	// 	} catch {
	// 		return defaultError
	// 	}
	// }
}
