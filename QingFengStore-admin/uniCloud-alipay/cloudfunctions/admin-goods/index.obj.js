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
	 * 获取商品列表
	 * @param {object} pageInfo 分页信息
	 * @param {number} pageInfo.page 当前页码
	 * @param {number} pageInfo.pageSize 页容量
	 * @param {string} [category_id] 筛选分类
	 * @returns {object[]} 资讯列表
	 */
	async list({ page = 1, pageSize = 10 } = {}, category_id = '') {
		if (page < 1) return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '页码异常' })

		try {
			pageSize = Math.min(20, pageSize) // 保证pageSize合理

			const currentSize = (page - 1) * pageSize // 忽略条数

			const query = category_id ? `category_id == "${category_id}"` : {} // 筛选分类

			const listTemp = dbJQL
				.collection('QingFengStore-mall-goods')
				.where(query)
				.orderBy('last_modify_date desc, total_sell_count desc')
				.skip(currentSize)
				.limit(pageSize)
				.getTemp()
			// 获取对应分类名称
			const categoriesTemp = dbJQL
				.collection('QingFengStore-mall-categories')
				.field('_id, name')
				.getTemp()

			// 商品id 商品名称 缩略图 商品销量 是否上架 更新时间
			const { errCode, errMsg, data, count } = await dbJQL
				.collection(listTemp, categoriesTemp)
				.field(
					'_id, arrayElemAt(category_id, 0) as category, name, goods_thumb, total_sell_count, is_on_sale, last_modify_date'
				)
				.get({ getCount: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data, total: count, type: '获取' })
		} catch (err) {
			console.log(err)
			return defaultError
		}
	},

	/**
	 * 新增商品
	 * @param {object} data 商品信息
	 * @param {string} data.name 商品名称
	 * @param {string} data.category_id 商品分类id
	 * @param {string} data.goods_desc 商品详情
	 * @param {array} [data.goods_banner_imgs] 商品展示图
	 * @param {string} [data.goods_thumb] 商品缩略图 默认为第一张展示图
	 * @param {boolean} [data.is_on_sale] 商品是否上架 默认为不上架false
	 * @returns {string} id 新增商品id
	 */
	async add(data = {}) {
		try {
			const { errCode, id } = await dbJQL.collection('QingFengStore-mall-goods').add(data)

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '新增', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { id }, type: '新增' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 修改商品
	 * @param {object} data 商品信息
	 * @param {string} data._id 商品id
	 * @param {string} [data.name] 商品名称
	 * @param {string} [data.category_id] 商品分类id
	 * @param {string} [data.goods_desc] 商品详情
	 * @param {array} [data.goods_banner_imgs] 商品展示图
	 * @param {string} [data.goods_thumb] 商品缩略图 默认为第一张展示图
	 * @param {boolean} [data.is_on_sale] 商品是否上架 默认为不上架false
	 * @returns {number} updated 成功修改个数(无变化为0)
	 */
	async update(data = {}) {
		if (!data._id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '商品id不可为空' })

		try {
			const { errCode, errMsg, updated } = await dbJQL
				.collection('QingFengStore-mall-goods')
				.doc(data._id)
				.update({ ...data, last_modify_date: Date.now() })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '修改', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { updated }, type: '修改' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 删除商品
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
				.collection('QingFengStore-mall-goods')
				.where(`_id in ${JSON.stringify(ids)}`)
				.remove()

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '删除', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { deleted }, type: '删除' })
		} catch {
			return defaultError
		}
	}
}
