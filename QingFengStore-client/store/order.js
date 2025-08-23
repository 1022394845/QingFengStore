import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
const orderCloudObj = uniCloud.importObject('client-order')

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

	/**
	 * 支付订单
	 * @param {string} id 订单id
	 * @param {boolean} [force_result] 强制结果
	 * @returns {object} 操作结果
	 */
	const pay = async (id, force_result = true) => {
		if (!id) return { errCode: 400, errMsg: '订单id不可为空' }

		// 模拟支付
		return new Promise((resolve, reject) => {
			uni.showLoading({
				title: '支付中...'
			})
			setTimeout(() => {
				uni.hideLoading()
				if (force_result) {
					resolve({ errCode: 0, errMsg: '支付成功' })
				} else {
					resolve({ errCode: 403, errMsg: '支付失败' })
				}
			}, 2000)
		})
	}

	/**
	 * 创建订单
	 * @returns {object} 操作结果
	 * @returns {string} id 订单id
	 */
	const create = async () => {
		const { user_id, pay_type, info } = formData.value
		const now = Date.now()
		const form = {
			user_id,
			pay_type,
			info,
			total_fee: totalFee.value,
			create_time: now,
			update_time: now
		}

		try {
			// 生成订单
			const {
				errCode,
				errMsg,
				data: { id }
			} = await orderCloudObj.create(form)
			if (errCode !== 0) return { errCode, errMsg }

			// 如果是从购物车中生成的订单，需要删除对应物品

			return { errCode, errMsg, id }
		} catch {
			return { errCode: 500, errMsg: '服务器错误' }
		}
	}

	return {
		formData,
		payMethodList,
		goodsPrice,
		totalFee,
		createCheck,
		create,
		pay
	}
})
