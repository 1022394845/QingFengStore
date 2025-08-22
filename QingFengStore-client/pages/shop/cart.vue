<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { useCartStore } from '@/store/cart.js'
import { settleBarHeight_px, tabBarHeight_px } from '@/utils/system.js'
import { formatPrice } from '@/utils/format.js'
import { debounce } from '@/utils/common.js'
import { routerTo } from '@/utils/router.js'
import { useOrderStore } from '@/store/order'

const cartStore = useCartStore()
const orderStore = useOrderStore()

// 更改选择状态
const toggleSelect = (item) => {
	item.is_selected = !item.is_selected
}
const toggleAllSelect = () => {
	cartStore.isAllSelected = !cartStore.isAllSelected
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

// 订单结算
const onCheck = () => {
	orderStore.createCheck(cartStore.selectedGoods)
	routerTo(`/pages/order/order`)
}
</script>

<template>
	<view class="container">
		<common-nav-bar title="购物车" titleColor="#ffffff"></common-nav-bar>
		<template v-if="cartStore.localCart.length">
			<scroll-view class="goods-list" scroll-y>
				<view
					class="goods-list_item"
					v-for="item in cartStore.localCart"
					:key="`${item.goods_id}_${item.sku._id}`"
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
					<goods-card
						:detail="item"
						:sku="item.sku"
						:config="2"
						@updateQuantity="(quantity) => updateQuantity(item, quantity)"
					></goods-card>
				</view>
			</scroll-view>

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

				<view class="shop-bar_settle-btn" @click="onCheck">结算</view>
			</view>
		</template>

		<view class="empty" v-else>
			<template v-if="cartStore.isIniting">
				<dot-loading>加载中</dot-loading>
			</template>
			<template v-else>购物车为空</template>
		</view>
	</view>
</template>

<style scoped lang="scss">
.goods-list {
	width: 100%;
	padding: 30rpx;
	padding-bottom: v-bind(settleBarHeight_px);
	box-sizing: border-box;

	&_item {
		margin-bottom: 40rpx;
		display: flex;
		gap: 20rpx;
		align-items: center;
	}
}

.empty {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 32rpx;
	color: #333333;
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
		width: 180rpx;
		height: 65rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		border-radius: 20rpx;
		background-color: $uni-color-primary;
	}
}
</style>
