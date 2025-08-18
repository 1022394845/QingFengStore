// 商城
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
	 * 获取商城分类列表
	 * @returns {object[]} 分类列表 每个分类含有对应商品的总数
	 */
	async categories() {
		try {
			// 分类id 分类名称
			const categoriesRes = await dbJQL
				.collection('QingFengStore-mall-categories')
				.where(`status == true`)
				.field('_id, name')
				.orderBy('sort, create_date desc')
				.get()

			if (categoriesRes.errCode !== 0)
				return result({ errCode, errMsg: 'fail', type: '获取', custom: categoriesRes.errMsg })

			// 无分类直接返回空数组
			if (categoriesRes.data.length === 0)
				return result({ errCode: 0, errMsg: 'success', data: [], type: '获取' })

			const categories = categoriesRes.data.map((item) => item._id)

			const goodsRes = await dbJQL
				.collection('QingFengStore-mall-goods')
				.where(`category_id in (${JSON.stringify(categories)})`)
				.field('category_id')
				.get()

			if (goodsRes.errCode !== 0)
				return result({ errCode, errMsg: 'fail', type: '获取', custom: goodsRes.errMsg })

			// 处理最终结果
			const countMap = {}
			goodsRes.data.forEach((item) => {
				if (countMap[item.category_id]) countMap[item.category_id]++
				else countMap[item.category_id] = 1
			})

			const data = categoriesRes.data.map((item) => ({
				...item,
				total: countMap[item._id] || 0
			}))

			return result({ errCode: 0, errMsg: 'success', data, type: '获取' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 获取商城分类对应的商品列表
	 * @param {string} category_id 分类id
	 * @returns {object[]} 分类列表 每个分类含有对应商品
	 */
	async goods(category_id) {
		if (!category_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '参数不可为空' })

		try {
			// 商品id 商品名称 缩略图
			const goodsRes = await dbJQL
				.collection('QingFengStore-mall-goods')
				.where(`is_on_sale == true && category_id == "${category_id}"`)
				.orderBy('total_sell_count desc, add_date desc')
				.field('_id, name, goods_thumb')
				.get()

			if (goodsRes.errCode !== 0)
				return result({ errCode, errMsg: 'fail', type: '获取', custom: goodsRes.errMsg })

			// 获取sku集合
			const goodsIds = goodsRes.data.map((item) => item._id) // 商品id集合
			// sku_id goods_id sku名称 缩略图 出售价格 市场价格 库存数
			const skuRes = await dbJQL
				.collection('QingFengStore-mall-sku')
				.where(`is_on_sale == true && goods_id in ${JSON.stringify(goodsIds)}`)
				.orderBy('sell_count desc, create_date')
				.field('_id, goods_id, sku_name, sku_thumb, price, market_price, stock')
				.get()
			if (skuRes.errCode !== 0)
				return result({ errCode, errMsg: 'fail', type: '获取', custom: skuRes.errMsg })

			// 关联sku与商品
			const data = goodsRes.data.map((item) => {
				const skus = skuRes.data
					.filter((sku) => sku.goods_id === item._id)
					.map((sku) => {
						const { goods_id, ...args } = sku
						return args
					})
				// 将商品所有sku中出售价格最低的作为商品展示价格
				let price = null
				let market_price = null
				if (skus.length) {
					price = skus[0].price
					market_price = skus[0].market_price
				}

				return {
					...item,
					skus,
					...(price !== null && { price }),
					...(market_price !== null && { market_price })
				}
			})

			return result({ errCode: 0, errMsg: 'success', data, type: '获取' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 获取首页热销商品 以总销量最为衡量标准
	 * @param {number} size 获取条数
	 * @return {object[]} 推荐商品列表
	 */
	async hot(size = 6) {
		// 商品id 商品名称 缩略图
		const goodsRes = await dbJQL
			.collection('QingFengStore-mall-goods')
			.where(`is_on_sale == true`)
			.orderBy('total_sell_count desc')
			.limit(size)
			.field('_id, name, goods_thumb')
			.get()

		if (goodsRes.errCode !== 0)
			return result({ errCode, errMsg: 'fail', type: '获取', custom: goodsRes.errMsg })

		// 获取sku集合
		const goodsIds = goodsRes.data.map((item) => item._id) // 商品id集合
		// sku_id goods_id sku名称 出售价格 市场价格
		const skuRes = await dbJQL
			.collection('QingFengStore-mall-sku')
			.where(`is_on_sale == true && goods_id in ${JSON.stringify(goodsIds)}`)
			.orderBy('sell_count desc, create_date')
			.field('_id, goods_id, sku_name, price, market_price')
			.get()
		if (skuRes.errCode !== 0)
			return result({ errCode, errMsg: 'fail', type: '获取', custom: skuRes.errMsg })

		// 关联sku与商品
		const data = goodsRes.data.map((item) => {
			const skus = skuRes.data
				.filter((sku) => sku.goods_id === item._id)
				.map((sku) => {
					const { price, market_price } = sku
					return { price, market_price }
				})
			// 将商品所有sku中出售价格最低的作为商品展示价格
			let price = null
			let market_price = null
			if (skus.length) {
				price = skus[0].price
				market_price = skus[0].market_price
			}

			return {
				...item,
				...(price !== null && { price }),
				...(market_price !== null && { market_price })
			}
		})

		return result({ errCode: 0, errMsg: 'success', data, type: '获取' })
	}
}
