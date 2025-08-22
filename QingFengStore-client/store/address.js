import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
const addressCloudObj = uniCloud.importObject('client-address')

// 地址
export const useAddressStore = defineStore('address', () => {
	const addressList = ref([]) // 地址列表
	const loading = ref(false) // 数据加载中
	const uid = uniCloud.getCurrentUserInfo().uid || null // 用户uid
	let isInitialized = false // 是否初始化过
	const selectedAddressId = ref(null) // 当前选择地址id

	// 默认地址
	const defaultAddress = computed(
		() => addressList.value.find((item) => item.default === true) || addressList.value[0]
	)

	// 当前选择地址
	const selectedAddress = computed(() => {
		if (selectedAddressId.value)
			return addressList.value.find((item) => item._id === selectedAddressId.value)
		return defaultAddress.value
	})

	/**
	 * 初始化获取数据
	 */
	const init = async () => {
		if (loading.value || isInitialized) return { errCode: 0 }

		try {
			loading.value = true

			const { errCode, errMsg, data } = await addressCloudObj.list(uid)
			if (errCode !== 0) throw new Error()

			addressList.value = data
			loading.value = false
			isInitialized = true
		} catch {
			return { errCode: 500, errMsg: '获取地址信息失败' }
		}
	}

	/**
	 * 新增地址
	 * @param {object} data 地址信息
	 * @param {string} data.name 收货人
	 * @param {string} data.phone 手机号码
	 * @param {string} data.province_code 省级编码
	 * @param {string} data.city_code 地级编码
	 * @param {string} data.area_code 区级编码
	 * @param {string} data.detail 详细地址
	 * @param {boolean} [data.default] 是否为默认地址
	 * @returns {object} 操作结果
	 */
	const add = async (data) => {
		try {
			loading.value = true

			const {
				errCode,
				errMsg,
				data: { id }
			} = await addressCloudObj.add({ ...data, user_id: uid })
			if (errCode !== 0) return { errCode, errMsg }

			if (data.default && defaultAddress.value?._id) {
				await addressCloudObj.update({ _id: defaultAddress.value._id, default: false })
				const target = addressList.value.find((item) => item._id === defaultAddress.value._id)
				if (target) target.default = false
			}

			addressList.value.unshift({ ...data, _id: id })
			loading.value = false

			return { errCode, errMsg }
		} catch {
			return { errCode: 500, errMsg: '未知错误' }
		}
	}

	/**
	 * 修改地址
	 * @param {object} data 地址信息
	 * @param {string} data._id 地址id
	 * @param {string} [data.name] 收货人
	 * @param {string} [data.phone] 手机号码
	 * @param {string} [data.province_code] 省级编码
	 * @param {string} [data.city_code] 地级编码
	 * @param {string} [data.area_code] 区级编码
	 * @param {string} [data.detail] 详细地址
	 * @param {boolean} [data.default] 是否为默认地址
	 * @returns {object} 操作结果
	 */
	const update = async (data) => {
		try {
			const targetIndex = addressList.value.findIndex((item) => item._id === data._id)
			if (targetIndex === -1) throw new Error()

			loading.value = true

			const { errCode, errMsg } = await addressCloudObj.update(data)
			if (errCode !== 0) return { errCode, errMsg }

			if (data.default && data._id !== defaultAddress.value._id) {
				await addressCloudObj.update({ _id: defaultAddress.value._id, default: false })
				const origin = addressList.value.find((item) => item.default === true)
				if (origin) origin.default = false
			}

			addressList.value[targetIndex] = data
			loading.value = false

			return { errCode, errMsg }
		} catch {
			return { errCode: 500, errMsg: '未知错误' }
		}
	}

	/**
	 * 删除地址
	 * @param {string} id 删除地址id
	 * @returns {object} 操作结果
	 */
	const remove = async (id) => {
		try {
			const targetIndex = addressList.value.findIndex((item) => item._id === id)
			if (targetIndex === -1) throw new Error()

			loading.value = true

			const { errCode, errMsg, data } = await addressCloudObj.remove(id)
			if (errCode !== 0) return { errCode, errMsg }

			if (selectedAddressId.value === id) selectedAddressId.value = null // 删除当前选中地址
			addressList.value.splice(targetIndex, 1)
			loading.value = false

			return { errCode, errMsg, data }
		} catch {
			return { errCode: 500, errMsg: '未知错误' }
		}
	}

	/**
	 * 选择地址
	 * @param {string} id 选择地址id
	 */
	const select = (id) => {
		if (!id) return
		selectedAddressId.value = id
	}

	return {
		addressList,
		loading,
		selectedAddressId,
		defaultAddress,
		selectedAddress,
		init,
		add,
		update,
		remove,
		select
	}
})
