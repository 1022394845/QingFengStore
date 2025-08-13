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

			// 商品id 商品名称 缩略图 商品销量 是否上架 更新时间
			const { errCode, errMsg, data, count } = await dbJQL
				.collection('QingFengStore-mall-goods')
				.where(query)
				.orderBy('last_modify_date desc, total_sell_count desc')
				.skip(currentSize)
				.limit(pageSize)
				.field(
					'_id, category_id, name, goods_thumb, total_sell_count, is_on_sale, last_modify_date'
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
	}
}
