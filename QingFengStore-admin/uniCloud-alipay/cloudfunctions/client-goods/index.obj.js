// 资讯
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
	 * 获取商城页分类列表
	 * @returns {object[]} 分类列表 每个分类含有对应商品的总数
	 */
	async categories() {
		try {
			const goodsTemp = dbJQL.collection('QingFengStore-mall-goods').field('category_id').getTemp()
			const categoriesTemp = dbJQL
				.collection('QingFengStore-mall-categories')
				.orderBy('sort, create_date desc')
				.getTemp()

			const { errCode, data } = await dbJQL
				.collection(goodsTemp, categoriesTemp)
				.field('arrayElemAt(category_id, 0) as category')
				.groupBy('category')
				.groupField('count(*) as total')
				.get()

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			// 将category中的信息上移至对象根属性
			let finalData = data
			if (Array.isArray(data))
				finalData = data.map((item) => ({ total: item.total, ...item.category }))
			return result({ errCode: 0, errMsg: 'success', data: finalData, type: '获取' })
		} catch (err) {
			console.log(err)
			return defaultError
		}
	}
}
