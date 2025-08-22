import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 订单
export const useOrderStore = defineStore('order', () => {
	const uid = uniCloud.getCurrentUserInfo().uid || null // 当前用户id
	const defaultData = {
		user_id: uid, // 用户id
		pay_type: 'balance', // 支付渠道
		info: [], //商品信息
		delivery_fee: 999, // 配送费
		discount: 0 // 折扣
	}
	const formData = ref({ ...defaultData })
	const payMethodList = [
		{
			label: '余额支付',
			type: 'balance',
			icon: 'icon-point-fill',
			iconColor: '#bdaf8d',
			disabled: false,
			note: '当前余额 99999'
		},
		{
			label: '微信支付',
			type: 'wxpay',
			icon: 'icon-wechatpay',
			iconColor: '#00C800',
			disabled: true,
			note: '暂未开放'
		},
		{
			label: '支付宝支付',
			type: 'alipay',
			icon: 'icon-zhifubaopay',
			iconColor: '#009FE8',
			disabled: true,
			note: '暂未开放'
		}
	]

	// 商品总价
	const goodsPrice = computed(() =>
		formData.value.info.reduce((sum, item) => sum + item.sku.price * item.quantity, 0)
	)

	// 订单总价
	const totalFee = computed(
		() => goodsPrice.value + formData.value.delivery_fee - formData.value.discount
	)

	/**
	 * 生成订单预览
	 * @param {object[]} info 商品信息
	 */
	const createCheck = (info) => {
		formData.value = { ...defaultData }
		formData.value.info = info
	}

	return {
		formData,
		payMethodList,
		goodsPrice,
		totalFee,
		createCheck
	}
})
