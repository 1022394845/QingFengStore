import { ref } from 'vue'
import { defineStore } from 'pinia'

// 购物车
export const useCartStore = defineStore('cart', () => {
	const cartList = ref([])

	const addGoods = (data) => {
		cartList.value.unshift(data)
	}

	return {
		cartList,
		addGoods
	}
})
