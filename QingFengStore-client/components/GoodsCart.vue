<script setup>
import { useCartStore } from '@/store/cart'
import GoodsCard from '@/components/GoodsCard.vue'
import { debounce, showMsg } from '@/utils/common.js'
import { routerTo } from '@/utils/router.js'

const cartStore = useCartStore()

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
	<view class="goods-cart-container">
		<scroll-view class="goods-cart_list" scroll-y>
			<view
				class="goods-cart_list_item"
				v-for="item in cartStore.localCart"
				:key="`${item.goods_id}_${item.sku._id}`"
			>
				<GoodsCard
					:detail="item"
					:sku="item.sku"
					:config="2"
					@overMinus="onConfirmRemove(item)"
					@updateQuantity="(quantity) => updateQuantity(item, quantity)"
				></GoodsCard>
			</view>
			<view class="goods-cart_list_item nomore" v-if="!cartStore.selectedTotal">购物车是空的</view>
		</scroll-view>
		<view
			class="goods-cart_buy-btn"
			v-if="cartStore.selectedTotal"
			@click="routerTo('/pages/shop/cart')"
		>
			结算
		</view>
	</view>
</template>

<style scoped lang="scss">
.goods-cart-container {
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
