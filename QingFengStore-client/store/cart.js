import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// 购物车
export const useCartStore = defineStore('cart', () => {
	// 购物车列表
	const cartList = ref([])
	// 购物车商品总数
	const cartTotalNum = computed(
		() => cartList.value.reduce((sum, item) => sum + item.count, 0) || 0
	)
	// 购物车商品总价
	const cartTotalPrice = computed(
		() =>
			cartList.value.reduce(
				(sum, item) => sum + item.count * (item.sku.price || item.sku.market_price),
				0
			) || 0
	)

	/**
	 * 添加商品至购物车
	 * @param {object} data - 商品信息
	 */
	const addGoods = (data) => {
		data.count = Number(data.count)
		const {
			_id,
			sku: { _id: sku_id },
			count
		} = data
		for (let i = 0; i < cartList.value.length; i++) {
			const item = cartList.value[i]
			if (item._id === _id && item.sku._id === sku_id) {
				cartList.value[i].count += count
				return
			}
		}
		cartList.value.unshift(data)
	}

	return {
		cartList,
		cartTotalNum,
		cartTotalPrice,
		addGoods
	}
})
