import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 购物车
export const useCartStore = defineStore('cart', () => {
	const localCart = ref([]) // 本地购物车
	let isSyncing = false // 正在同步标志
	let needSync = false // 需要同步标志
	let syncTimer = null // 同步计时器
	const STORAGE_KEY = 'QingFengStore_cart' // 本地存储键
	const SYNC_INTERVAL = 30000 // 同步间隔 30s

	// 选中商品列表
	const selectedGoods = computed(() => localCart.value.filter((item) => item.is_selected))

	// 选中商品数量
	const selectedTotal = computed(
		() => localCart.value.reduce((total, item) => total + item.quantity),
		0
	)

	// 选中商品总价
	const selectedPrice = computed(
		() => localCart.value.reduce((total, item) => total + item.quantity * item.price),
		0
	)

	// 全选状态
	const isAllSelected = computed({
		get: () => localCart.value.length && localCart.value.every((item) => item.is_selected),
		set: (checked) => toggleAllSelect(checked)
	})

	/**
	 * 加载本地购物车数据
	 */
	const loadLocalCart = () => {
		const saved = localStorage.getItem(STORAGE_KEY)
		if (saved) localCart.value = saved
	}

	/**
	 * 保存购物车数据至本地
	 */
	const saveLocalCart = () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(localCart.value))
		needSync = true // 开启需要同步标志
	}

	/**
	 * 启动定时同步
	 */
	const startSyncTimer = () => {
		if (syncTimer) clearInterval(syncTimer)
		syncTimer = setInterval(() => {
			if (needSync && !isSyncing) syncToServer() // 同步至数据库
		}, SYNC_INTERVAL)
	}

	/**
	 * 关闭定时同步
	 */
	const clearSyncTimer = () => {
		if (syncTimer) {
			clearInterval(syncTimer)
			syncTimer = null
		}
	}

	/**
	 * 同步本地购物车至数据库
	 */
	const syncToServer = async () => {
		console.log('同步数据库')
	}

	/**
	 * 手动同步
	 */
	const forceSync = () => {
		if (needSync && !isSyncing) syncToServer()
	}

	/**
	 * 监听网络连接后强制同步
	 */
	const watchNetworkStatus = () => {
		uni.onNetworkStatusChange(({ isConnected }) => {
			if (isConnected) forceSync()
		})
	}

	/**
	 * 监听页面可见性强制同步
	 */
	const watchPageVisibility = () => {
		// 切换至后台
		uni.onAppHide(() => {
			forceSync()
		})
		// 页面卸载
		uni.onPageNotFound(() => {
			forceSync()
		})
	}

	/**
	 * 结算前强制同步
	 */
	const syncBeforeCheckout = async () => {
		forceSync()
	}

	/**
	 * 全选/取消全选商品
	 * @param {boolean} checked
	 * @returns {object} 操作结果
	 */
	const toggleAllSelect = (checked) => {
		try {
			localCart.value.forEach((item) => {
				item.is_selected = checked
			})

			saveLocalData()
			needSync = true
			return { errCode: 0 }
		} catch {
			return { errCode: 500, errMsg: '未知错误' }
		}
	}

	/**
	 * 添加商品至购物车
	 * @param {object} data 商品信息
	 * @param {string} data._id 商品id
	 * @param {string} data.sku_id 规格id
	 * @param {number} data.price 商品单价
	 * @param {number} data.quantity 购买数量
	 * @param  {string} [data.goods_name] 商品名称
	 * @param {string} [data.sku_name] 规格名称
	 * @param {number} [data.market_price] 商品市场价格
	 * @param {string} [data.goods_thumb] 商品缩略图
	 * @returns {object} 操作结果
	 */
	const add = (data) => {
		try {
			const { _id, sku_id, price, quantity } = data
			if (!_id || !sku_id || !price || !quantity)
				return { errCode: 400, errMsg: '缺少商品必要参数' }

			const target = localCart.value.find((item) => item._id === _id && item.sku_id === sku_id)
			if (target) {
				// 购物车中已有相同商品 累加数量
				target.quantity += quantity
			} else {
				localCart.value.unshift({
					...data,
					is_selected: true // 默认选中
				})
			}

			saveLocalCart()
			needSync
			return { errCode: 0 }
		} catch {
			return { errCode: 500, errMsg: '未知错误' }
		}
	}

	/**
	 * 修改商品购买数量
	 * @param {string} _id 商品id
	 * @param {string} sku_id 规格id
	 * @param {number} quantity 购买数量
	 * @returns {object} 操作结果
	 */
	const update = (_id, sku_id, quantity) => {
		if (!_id || !sku_id || !quantity) return { errCode: 400, errMsg: '缺少商品必要参数' }

		try {
			const target = localCart.value.find((item) => item._id === _id && item.sku_id === sku_id)
			if (target) target.quantity += quantity
			else return { errCode: 400, errMsg: '商品暂未加入购物车' }

			saveLocalCart()
			needSync
			return { errCode: 0 }
		} catch {
			return { errCode: 500, errMsg: '未知错误' }
		}
	}

	/**
	 * 删除购物车商品
	 * @param {string} _id 商品id
	 * @param {string} sku_id 规格id
	 * @return {object} 操作结果
	 */
	const remove = (_id, sku_id) => {
		if (!_id || !sku_id) return { errCode: 400, errMsg: '缺少商品必要参数' }

		try {
			const index = localCart.value.findIndex((item) => item._id === _id && item.sku_id === sku_id)
			if (index !== -1) localCart.value.splice(index, 1)
			else return { errCode: 400, errMsg: '购物车不存在该商品' }

			saveLocalCart()
			needSync
			return { errCode: 0 }
		} catch {
			return { errCode: 500, errMsg: '未知错误' }
		}
	}

	/**
	 * 初始化 开启定时同步 监听强制同步
	 */
	const init = () => {
		loadLocalCart()
		startSyncTimer()
		watchNetworkStatus()
		watchPageVisibility()
	}

	/**
	 * 清理资源
	 */
	const cleanup = () => {
		clearSyncTimer()
		uni.offNetworkStatusChange()
		forceSync()
	}

	return {
		loadLocalCart,
		selectedGoods,
		selectedTotal,
		selectedPrice,
		isAllSelected,
		init,
		cleanup,
		add,
		update,
		remove,
		toggleAllSelect,
		forceSync
	}
})
