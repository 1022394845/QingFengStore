<script setup>
import { computed, ref, watch } from 'vue'
import { useCartStore } from '@/store/cart.js'
import { isLogin, showMsg } from '@/utils/common.js'
import { needLogin, routerTo } from '@/utils/router.js'
import { safeareaHeight, tabBarHeight } from '@/utils/system.js'
import { useOrderStore } from '@/store/order.js'

const props = defineProps({
	tabBar: {
		// 用于区分弹出框是否需要tabBarHeight底填充
		type: Boolean,
		default: false
	}
})
const popupBottom_px = computed(() => {
	const base = safeareaHeight + uni.rpx2px(40)

	if (props.tabBar) return `${tabBarHeight + base}px`
	return `${base}px`
})

const detail = ref({})
// 当前选中的SKU
const currentSkuId = ref(null)
const currentSku = computed(() => {
	if (!currentSkuId.value) return {}
	return detail.value.skus?.find((item) => item._id === currentSkuId.value) || {}
})

const skuPopRef = ref(null)
/**
 * 设置当前查看商品数据
 * @param {object} data 查看商品数据
 */
const setInfo = (data) => {
	if (!detail.value._id || detail.value._id !== data._id) {
		// 查看新商品 更新缓存
		detail.value = { ...data }
		currentSkuId.value = data.skus?.[0]?._id || null
	}
}

/**
 * 开启SKU编辑框
 * @param {object} data 选择商品数据
 */
const open = (data = null) => {
	if (!skuPopRef.value) return showMsg('未知错误，请稍后再试')

	if (data) setInfo(data)
	skuPopRef.value.open()
}
const close = () => {
	if (!skuPopRef.value) return showMsg('未知错误，请稍后再试')
	skuPopRef.value.close()
}
defineExpose({ setInfo, open, currentSku })

// 切换SKU
const onChangeSku = (sku_id) => {
	currentSkuId.value = sku_id
}

// 创建商品购买信息
const quantity = ref(1) // 选择数量
const createInfo = () => {
	if (!currentSkuId.value) {
		return { errCode: 400, errMsg: '缺少商品规格参数' }
	}

	if (!Object.keys(currentSku.value).length) {
		return { errCode: 500, errMsg: '获取商品规格信息异常' }
	}

	try {
		const { _id, skus, price, market_price, ...cartGoodsInfo } = detail.value

		const data = {
			...cartGoodsInfo,
			goods_id: _id,
			goods_thumb: currentSku.value.sku_thumb || detail.value.goods_thumb || null,
			sku: currentSku.value,
			quantity: quantity.value
		}

		return {
			errCode: 0,
			data
		}
	} catch {
		return { errCode: 500, errMsg: '创建商品表单失败' }
	}
}

// 加入购物车
const cartStore = useCartStore()
const onCart = () => {
	if (isLogin()) {
		const { errCode, errMsg, data } = createInfo()
		if (errCode !== 0) return showMsg(errMsg)

		{
			const { errCode, errMsg } = cartStore.add(data)
			if (errCode !== 0) return showMsg(errMsg || '添加商品至购物车失败')
		}

		close()
		showMsg('加入购物车成功')
	} else needLogin()
}

// 立即购买
const orderStore = useOrderStore()
const onBuy = () => {
	if (isLogin()) {
		const { errCode, errMsg, data } = createInfo()
		if (errCode !== 0) return showMsg(errMsg)

		orderStore.createCheck([data])
		close()
		routerTo('/pages/order/order')
	} else needLogin()
}
</script>

<template>
	<uni-popup ref="skuPopRef" type="bottom" :safe-area="false">
		<view class="goods-sku-container">
			<goods-card :detail="detail" :sku="currentSku" :config="1"></goods-card>
			<!-- SKU列表 -->
			<view class="goods-sku">
				<view class="goods-sku_label label">规格</view>
				<view class="goods-sku_list">
					<view class="goods-sku_list_item" v-if="detail.skus?.length === 0">暂无规格</view>
					<view
						class="goods-sku_list_item"
						v-for="item in detail.skus"
						:key="item._id"
						:class="{ active: item._id === currentSkuId }"
						@click="onChangeSku(item._id)"
					>
						{{ item.sku_name }}
					</view>
				</view>
			</view>
			<!-- 步进器 -->
			<view class="goods-quantity">
				<view class="goods-quantity_label label">数量</view>
				<number-box v-model="quantity"></number-box>
			</view>
			<!-- 操作 -->
			<view class="goods-btn-group">
				<view class="goods-btn cart" @click="onCart">加入购物车</view>
				<view class="goods-btn buy" @click="onBuy">立即购买</view>
			</view>
		</view>
	</uni-popup>
</template>

<style scoped lang="scss">
.goods-sku-container {
	min-height: 300rpx;
	padding: 40rpx 32rpx v-bind(popupBottom_px);
	background-color: #ffffff;
	border-radius: 30rpx 30rpx 0 0;

	.label {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}

	.goods-sku {
		margin-top: 44rpx;

		&_list {
			margin-top: 20rpx;
			display: flex;
			flex-wrap: wrap;
			gap: 28rpx;

			&_item {
				width: fit-content;
				height: 40rpx;
				padding: 0 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24rpx;
				color: #666666;
				background-color: #f4f4f4;
				border-radius: 10rpx;

				&.active {
					color: #ffffff;
					background-color: $uni-color-primary;
				}
			}
		}
	}

	.goods-quantity {
		margin-top: 44rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.goods-btn-group {
		margin-top: 50rpx;
		display: flex;
		align-items: center;

		.goods-btn {
			flex: 1 1 0;
			width: 100%;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			color: #ffffff;

			&.cart {
				background-color: #ff9300;
				border-radius: 40rpx 0 0 40rpx;
			}

			&.buy {
				background-color: #ef5350;
				border-radius: 0 40rpx 40rpx 0;
			}
		}
	}
}
</style>
