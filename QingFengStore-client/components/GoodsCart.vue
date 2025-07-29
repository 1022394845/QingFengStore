<script setup>
import { useCartStore } from '@/store/cart'
import GoodsCard from '@/components/GoodsCard.vue'

const cartStore = useCartStore()
</script>

<template>
	<view class="goods-cart-container">
		<scroll-view class="goods-cart_list" scroll-y>
			<view class="goods-cart_list_item" v-for="item in cartStore.cartList">
				<GoodsCard :detail="item" :sku="item.sku" :config="2"></GoodsCard>
			</view>
			<view class="goods-cart_list_item">
				<uni-load-more
					status="noMore"
					v-if="!cartStore.cartTotalNum"
					:content-text="{ contentnomore: '没有更多数据' }"
				/>
			</view>
		</scroll-view>
		<view class="goods-cart_buy-btn" v-if="cartStore.cartTotalNum">结算</view>
	</view>
</template>

<style scoped lang="scss">
.goods-cart-container {
	.goods-cart_list {
		max-height: 50vh;

		&_item {
			margin-bottom: 44rpx;
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
