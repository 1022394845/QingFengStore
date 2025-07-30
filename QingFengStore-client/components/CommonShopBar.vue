<script setup></script>

<template>
	<view class="common-shop-bar">
		<view class="common-shop-bar_menu">
			<view class="common-shop-bar_menu_item">
				<view class="common-shop-bar_menu_item_icon">
					<uni-icons type="chat" size="48rpx" color="#666666"></uni-icons>
				</view>
				<view class="common-shop-bar_menu_item_label">客服</view>
			</view>
			<view class="common-shop-bar_menu_item">
				<view class="common-shop-bar_menu_item_icon">
					<uni-icons type="cart" size="48rpx" color="#666666"></uni-icons>
					<view class="common-shop-bar_menu_item_icon_tag">3</view>
				</view>
				<view class="common-shop-bar_menu_item_label">购物车</view>
			</view>
		</view>
		<view class="common-shop-bar_operation">
			<view class="common-shop-bar_operation_btn cart">加入购物车</view>
			<view class="common-shop-bar_operation_btn buy">立即购买</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.common-shop-bar {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 100rpx;
	padding: 0 26rpx 0 48rpx;
	display: flex;
	gap: 40rpx;
	align-items: center;
	background-color: #ffffff;
	box-shadow: 0 -8rpx 8rpx 0 #e3e3e3;

	&_menu {
		flex-shrink: 0;
		display: flex;
		gap: 40rpx;
		align-items: center;
		font-size: 24rpx;
		color: #666666;

		&_item {
			text-align: center;

			&_icon {
				position: relative;

				&_tag {
					position: absolute;
					top: 0;
					left: 55%;
					min-width: 28rpx;
					height: 28rpx;
					padding: 10rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 18rpx;
					color: #ffffff;
					background-color: #ef5350;
					border-radius: 50%;
				}
			}
		}
	}

	&_operation {
		flex: 1;
		display: flex;
		align-items: center;

		&_btn {
			flex: 1 1 0;
			height: 64rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			color: #ffffff;
			text-align: center;

			&.cart {
				background-color: #ff9300;
				border-radius: 32rpx 0 0 32rpx;
			}

			&.buy {
				background-color: #ef5350;
				border-radius: 0 32rpx 32rpx 0;
			}
		}
	}
}
</style>
