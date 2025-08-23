import { defineStore } from 'pinia'
import { ref } from 'vue'
import { showConfirm, showMsg } from '@/utils/common.js'
import { needLogin } from '@/utils/router.js'
const userCloudObj = uniCloud.importObject('uni-id-co')

// 用户
export const useUserStore = defineStore('user', () => {
	let token = null // 用户token
	// 用户信息
	const userInfo = ref({
		_id: null, // 用户id
		nickname: null, // 用户昵称
		avatar_file: null // 用户头像
	})
	const TOKEN_STORAGE_KEY = 'uni_id_token'
	const INFO_STORAGE_KEY = 'uni-id-pages-userInfo'

	/**
	 * 初始化
	 */
	const init = () => {
		if (token) return
		token = uni.getStorageSync(TOKEN_STORAGE_KEY) || null
		if (!token) return needLogin(true)
		userInfo.value = { ...uni.getStorageSync(INFO_STORAGE_KEY) } || null
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

	return {
		userInfo,
		init,
		logout
	}
})
