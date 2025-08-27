import { defineStore } from 'pinia'
import { ref } from 'vue'
import { showConfirm, showMsg } from '@/utils/common.js'
import { needLogin } from '@/utils/router.js'
const userCloudObj = uniCloud.importObject('uni-id-co')
const orderCloudObj = uniCloud.importObject('client-order', { customUI: true })
const balanceCloudObj = uniCloud.importObject('client-balance', { customUI: true })

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
			if (errCode !== 0) return (result = { errCode, errMsg })

			orderCount.value = {}
			data.forEach((item) => {
				orderCount.value[item.status] = item.total
			})

			return { errCode, errMsg }
		} catch {
			return { errCode: 500, errMsg: '服务器错误' }
		}
	}

	/**
	 * 获取用户当前余额
	 * @returns {object} 操作结果
	 */
	const getBalance = (() => {
		let executed = false
		let result = null

		return async () => {
			if (executed) return result
			executed = true

			if (!uid) {
				result = { errCode: 400, errMsg: '用户id不可为空' }
				return result
			}

			try {
				const { errCode, errMsg, data } = await balanceCloudObj.get(uid)
				if (errCode !== 0) {
					result = { errCode, errMsg }
					return result
				}

				userInfo.value.balance = data.balance || 0
				result = { errCode, errMsg, data: { balance: data.balance || 0 } }
				return result
			} catch {
				result = { errCode: 500, errMsg: '服务器错误' }
				return result
			}
		}
	})()

	/**
	 * 修改用户余额
	 * @param {object} data 信息对象
	 * @param {number} data.change 本次变化的余额
	 * @param {number} data.type 类型 1-收入 2-支出
	 * @param {string} [data.comment] 备注
	 * @returns {object} 操作结果
	 */
	const updateBalance = async (data) => {
		if (!uid) return { errCode: 400, errMsg: '用户id不可为空' }

		const { change, type } = data
		if (!change || !type) return { errCode: 400, errMsg: '必要参数不可为空' }

		try {
			let balance = userInfo.value.balance
			if (type === 1) balance += change
			else balance -= change
			const { errCode, errMsg } = await balanceCloudObj.update({
				user_id: uid,
				balance,
				...data
			})
			if (errCode !== 0) throw new Error()

			userInfo.value.balance = balance
			return { errCode, errMsg }
		} catch {
			return { errCode: 500, errMsg: '服务器错误' }
		}
	}

	/**
	 * 余额充值
	 * @param {string} key 兑换码
	 */
	const charge = async (key) => {
		if (!uid) return { errCode: 400, errMsg: '用户id不可为空' }
		if (!key) return { errCode: 400, errMsg: '兑换码不可为空' }

		try {
			if (key === 'QingFengStore-admin') {
				// 测试账号 模拟充值
				const { errCode, errMsg, change } = await new Promise((resolve, _) => {
					setTimeout(() => {
						resolve({ errCode: 0, errMsg: '充值成功', change: 10000 })
					}, 2000)
				})
				if (errCode !== 0) throw new Error()

				{
					const { errCode, errMsg } = await updateBalance({ change, type: 1, comment: '余额充值' })
					if (errCode !== 0) return { errCode, errMsg }
				}
				return { errCode, errMsg, change }
			}

			return { errCode: 403, errMsg: '兑换码无效' }
		} catch {
			return { errCode: 500, errMsg: '服务器错误' }
		}
	}

	return {
		token,
		userInfo,
		orderCount,
		init,
		logout,
		getOrderCount,
		getBalance,
		updateBalance,
		charge
	}
})
