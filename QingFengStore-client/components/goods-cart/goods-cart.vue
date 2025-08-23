<script setup>
import { computed, ref } from 'vue'
import { useCartStore } from '@/store/cart.js'
import { debounce, isLogin, showMsg } from '@/utils/common.js'
import { needLogin, routerTo } from '@/utils/router.js'
import { safeareaHeight, tabBarHeight } from '@/utils/system.js'

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

const cartStore = useCartStore()

const cartPopRef = ref(null)
/**
 * 开启购物车弹出框
 */
const open = () => {
	if (!cartPopRef.value) return showMsg('未知错误，请稍后再试')
	if (isLogin()) cartPopRef.value.open()
	else needLogin()
}
defineExpose({ open })
const close = () => {
	if (!cartPopRef.value) return showMsg('未知错误，请稍后再试')
	cartPopRef.value.close()
}

// 移除商品确认
const onConfirmRemove = async (item) => {
	const { cancel } = await uni.showModal({
		title: '温馨提示',
		content: '你确认移除该商品吗',
		confirmColor: '#bdaf8d'
	})
	if (cancel) return

	cartStore.remove(item.goods_id, item.sku._id)
}

/**
 * 更新商品数量 防抖1s
 * @param {object} item 商品信息
 * @param {number} quantity 更新数量
 */
const updateQuantity = debounce((item, quantity) => {
	const { errCode, errMsg } = cartStore.update(item.goods_id, item.sku._id, quantity)
	if (errCode !== 0) return showMsg(errMsg || '更新商品购买数量失败')
}, 1000)
</script>

<template>
	<uni-popup ref="cartPopRef" type="bottom" :safe-area="false">
		<view class="goods-cart-container">
			<scroll-view class="goods-cart_list" scroll-y>
				<view
					class="goods-cart_list_item"
					v-for="item in cartStore.localCart"
					:key="`${item.goods_id}_${item.sku._id}`"
				>
					<goods-card
						:detail="item"
						:sku="item.sku"
						:config="2"
						@overMinus="onConfirmRemove(item)"
						@updateQuantity="(quantity) => updateQuantity(item, quantity)"
					></goods-card>
				</view>
				<view class="goods-cart_list_item nomore" v-if="!cartStore.selectedTotal">
					购物车是空的
				</view>
			</scroll-view>
			<view
				class="goods-cart_buy-btn"
				v-if="cartStore.selectedTotal"
				@click="routerTo('/pages/shop/cart')"
			>
				结算
			</view>
		</view>
	</uni-popup>
</template>

<style scoped lang="scss">
.goods-cart-container {
	min-height: 300rpx;
	padding: 40rpx 32rpx v-bind(popupBottom_px);
	background-color: #ffffff;
	border-radius: 30rpx 30rpx 0 0;

	.goods-cart_list {
		max-height: 50vh;

		&_item {
			margin-bottom: 44rpx;

			&.nomore {
				margin: 30rpx auto 0;
				font-size: 32rpx;
				color: #aaaaaa;
				text-align: center;
			}
		}
	}

	.goods-cart_buy-btn {
		width: 100%;
		height: 80rpx;
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		color: #ffffff;
		background-color: #ff0f23;
		border-radius: 40rpx;
	}
}
</style>
