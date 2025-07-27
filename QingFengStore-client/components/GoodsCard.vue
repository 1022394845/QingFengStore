<script setup>
import { formatPrice } from '@/utils/format.js'
</script>

<template>
	<view class="goods-card">
		<view class="goods-card_item">
			<image class="goods-card_item_image" src="/static/tmp_goods.jpg" mode="aspectFill"></image>
		</view>
		<view class="goods-card_info">
			<view class="goods-card_info_title ellipsis">
				测试商品测试商品测试商品测试商品测试商品测试商品测试商品测试商品
			</view>
			<view class="goods-card_info_price">
				<view class="goods-card_info_price_new">
					<view class="goods-card_info_price_new_unit">￥</view>
					<view class="goods-card_info_price_new_text">{{ formatPrice(18900) }}</view>
				</view>
				<view class="goods-card_info_price_old">￥{{ formatPrice(22900) }}</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.goods-card {
	width: 100%;
	height: fit-content;

	&_item {
		width: 100%;
		aspect-ratio: 1 / 1;
		border-radius: 20rpx;
		overflow: hidden;

		&_image {
			width: 100%;
			height: 100%;
			display: block;
		}
	}

	&_info {
		margin-top: 11rpx;

		&_title {
			font-size: 30rpx;
			font-weight: bolder;
			color: #333333;
		}

		&_price {
			width: 100%;
			display: flex;
			align-items: baseline;
			flex-wrap: wrap;

			&_new {
				margin-right: 10rpx;
				display: flex;
				align-items: baseline;
				word-break: break-all;
				font-size: 32rpx;
				font-weight: bold;
				color: #ff0f23;

				&_unit {
					font-size: 24rpx;
				}
			}

			&_old {
				font-size: 20rpx;
				font-weight: 500;
				color: #bbbbbb;
				text-decoration: line-through;
			}
		}
	}
}
</style>
