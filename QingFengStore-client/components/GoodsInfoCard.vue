<script setup>
import { formatPrice } from '@/utils/format.js'
</script>

<template>
	<view class="goods-info-card">
		<view class="goods-info-card_item">
			<image
				class="goods-info-card_item_image"
				src="/static/tmp_goods.jpg"
				mode="aspectFill"
				lazy-load
			></image>
		</view>
		<view class="goods-info-card_info">
			<view class="goods-info-card_info_title ellipsis">
				测试商品测试商品测试商品测试商品测试商品测试商品测试商品测试商品
			</view>
			<view class="goods-info-card_info_price">
				<view class="goods-info-card_info_price_new">
					<view class="goods-info-card_info_price_new_unit">￥</view>
					<view class="goods-info-card_info_price_new_text">{{ formatPrice(18900) }}</view>
				</view>
				<view class="goods-info-card_info_price_old">￥{{ formatPrice(22900) }}</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.goods-info-card {
	width: 100%;
	height: fit-content;

	&_item {
		width: 100%;
		aspect-ratio: 1 / 1;
		border-radius: 20rpx;
		overflow: hidden;

		&_image {
			display: block;
			width: 100%;
			height: 100%;
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
