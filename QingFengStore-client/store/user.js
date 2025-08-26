import { defineStore } from 'pinia'
import { ref } from 'vue'
import { showConfirm, showMsg } from '@/utils/common.js'
import { needLogin } from '@/utils/router.js'
const userCloudObj = uniCloud.importObject('uni-id-co')
const orderCloudObj = uniCloud.importObject('client-order', { customUI: true })

// 用户
export const useUserStore = defineStore('user', () => {
	let token = null // 用户token
	let uid = uniCloud.getCurrentUserInfo().uid || null // 用户id
	// 用户信息
	const userInfo = ref({
		_id: null, // 用户id
		nickname: null, // 用户昵称
		avatar_file: null, // 用户头像
		balance: 0 // 余额
	})
	const orderCount = ref({}) // 订单按状态分组数量信息
	const TOKEN_STORAGE_KEY = 'uni_id_token'
	const INFO_STORAGE_KEY = 'uni-id-pages-userInfo'

	/**
	 * 初始化
	 */
	const init = () => {
		if (token) return // 已初始化过

		token = uni.getStorageSync(TOKEN_STORAGE_KEY) || null
		if (!token) return needLogin(true)

		userInfo.value = { ...uni.getStorageSync(INFO_STORAGE_KEY) } || null
		getOrderCount()
	}

	/**
	 * 登出
	 */
	const logout = async () => {
		// 退出登录
		const cancel = await showConfirm('温馨提示', '确认退出登录吗？')
		if (cancel) return

		try {
			const { errCode, errMsg } = await userCloudObj.logout()
			if (errCode !== 0) throw new Error()
			uni.removeStorageSync(TOKEN_STORAGE_KEY)
			uni.removeStorageSync(INFO_STORAGE_KEY)
			showMsg('退出登录成功')
			needLogin(true)
		} catch {
			return showMsg('退出登录失败')
		}
	}

	/**
	 * 获取订单按状态分组数量信息
	 * 订单状态，1：待付款，2：待发货，3：运输中，4：待收货，5：已完成，6：申请退款，7：已退款，-1已关闭，-2：退款失败
	 * @returns {object} 操作结果
	 */
	const getOrderCount = async () => {
		if (!uid) return { errCode: 400, errMsg: '用户id不可为空' }

		try {
			const { errCode, errMsg, data } = await orderCloudObj.count(uid)
			if (errCode !== 0) return { errCode, errMsg }

			orderCount.value = {}
			data.forEach((item) => {
				orderCount.value[item.status] = item.total
			})
			return { errCode, errMsg }
		} catch {
			return { errCode: 500, errMsg: '服务器错误' }
		}
	}

	return {
		userInfo,
		orderCount,
		init,
		logout,
		getOrderCount
	}
})
