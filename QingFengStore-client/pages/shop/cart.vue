<script setup>
import { useCartStore } from '@/store/cart'
import GoodsCard from '@/components/GoodsCard.vue'
import CommonNavBar from '@/components/CommonNavBar.vue'
import { settleBarHeight_px, tabBarHeight_px } from '@/utils/system'
import { formatPrice } from '@/utils/format.js'

const cartStore = useCartStore()

// 更改选择状态
const toggleSelect = (item) => {
	item.is_selected = !item.is_selected
}
const toggleAllSelect = () => {
	cartStore.isAllSelected = !cartStore.isAllSelected
}
</script>

<template>
	<view class="container">
		<CommonNavBar title="购物车" titleColor="#ffffff"></CommonNavBar>
		<view class="goods-list">
			<view
				class="goods-list_item"
				v-for="item in cartStore.localCart"
				:key="`${item._id}_${item.sku._id}`"
			>
				<uv-checkbox-group
					:value="[item.is_selected]"
					shape="circle"
					size="32rpx"
					iconSize="24rpx"
					labelSize="28rpx"
					@change="toggleSelect(item)"
				>
					<uv-checkbox activeColor="#bdaf8d" :name="true"></uv-checkbox>
				</uv-checkbox-group>
				<GoodsCard :detail="item" :sku="item.sku" :config="2"></GoodsCard>
			</view>
		</view>
		<view class="shop-bar">
			<view class="shop-bar_check">
				<uv-checkbox-group
					:value="[cartStore.isAllSelected]"
					shape="circle"
					size="32rpx"
					iconSize="24rpx"
					labelSize="28rpx"
					@change="toggleAllSelect"
				>
					<uv-checkbox activeColor="#bdaf8d" label="全选" :name="true"></uv-checkbox>
				</uv-checkbox-group>
			</view>

			<view class="shop-bar_price">
				<view class="shop-bar_price_text">合计:</view>
				<view class="shop-bar_price_unit">￥</view>
				<view class="shop-bar_price_total ellipsis">
					{{ formatPrice(cartStore.selectedPrice) }}
				</view>
			</view>

			<view class="shop-bar_settle-btn">结算</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.goods-list {
	padding: 30rpx;

	&_item {
		margin-bottom: 40rpx;
		display: flex;
		gap: 20rpx;
		align-items: center;
	}
}

.shop-bar {
	position: fixed;
	bottom: v-bind(tabBarHeight_px);
	width: 100%;
	height: v-bind(settleBarHeight_px);
	padding: 0 30rpx;
	display: flex;
	gap: 20rpx;
	align-items: center;
	background-color: #ffffff;
	box-shadow: 0 -8rpx 8rpx 0 #e3e3e3;

	&_check {
		flex-shrink: 0;
	}

	&_price {
		margin-left: auto;
		display: flex;
		align-items: baseline;

		&_text,
		&_total {
			flex-shrink: 0;
			font-size: 28rpx;
		}

		&_unit,
		&_total {
			font-weight: bold;
			color: $uni-color-primary;
		}

		&_total {
			max-width: 280rpx;
			font-size: 42rpx;
		}
	}

	&_settle-btn {
		width: 160rpx;
		height: 65rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		border-radius: 10rpx;
		background-color: $uni-color-primary;
	}
}
</style>
