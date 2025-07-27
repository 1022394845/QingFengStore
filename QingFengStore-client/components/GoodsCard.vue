<script setup>
import { formatPrice } from '@/utils/format.js'
</script>

<template>
	<view class="goods-card">
		<view class="goods-card_picture">
			<image class="goods-card_picture_image" src="/static/tmp_goods.jpg" mode="aspectFill"></image>
		</view>
		<view class="goods-card_info">
			<view class="goods-card_info_top">
				<view class="goods-card_info_top_title ellipsis">商品名称</view>
			</view>
			<view class="goods-card_info_bottom">
				<view class="goods-card_info_bottom_left">
					<view class="goods-card_info_bottom_left_price">
						<view class="goods-card_info_bottom_left_price_new">
							<view class="goods-card_info_bottom_left_price_new_unit">￥</view>
							<view class="goods-card_info_bottom_left_price_new_text">
								{{ formatPrice(5560) }}
							</view>
						</view>
						<view class="goods-card_info_bottom_left_price_old">￥{{ formatPrice(6680) }}</view>
					</view>
				</view>
				<view class="goods-card_info_bottom_right">
					<view class="goods-card_info_bottom_right_buy">选购</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.goods-card {
	width: 100%;
	height: 180rpx;
	display: flex;

	&_picture {
		flex-shrink: 0;
		height: 100%;
		aspect-ratio: 1 / 1;

		&_image {
			width: 100%;
			height: 100%;
		}
	}

	&_info {
		flex: 1 1 0;
		width: 0;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		&_top {
			width: 100%;

			&_title {
				font-size: 32rpx;
				font-weight: bold;
			}
		}

		&_bottom {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;

			&_left {
				&_price {
					&_new {
						display: flex;
						align-items: baseline;
						font-size: 32rpx;
						font-weight: bold;
						color: #ff0f23;

						&_unit {
							font-size: 24rpx;
						}
					}

					&_old {
						font-size: 22rpx;
						color: #bbbbbb;
						text-decoration: line-through;
					}
				}
			}

			&_right {
				&_buy {
					width: 102rpx;
					height: 40rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 26rpx;
					color: #ffffff;
					background-color: $uni-color-primary;
					border-radius: 20rpx;
				}
			}
		}
	}
}
</style>
