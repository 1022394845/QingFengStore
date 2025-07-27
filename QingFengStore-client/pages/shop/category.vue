<script setup>
import {
	containerHeight,
	searchHeight,
	tabBarHeight,
	tabBarHeight_px,
	settleBarHeight
} from '@/utils/system.js'
import { formatPrice } from '@/utils/format.js'
import CommonNavBar from '@/components/CommonNavBar.vue'
import CommonSearch from '@/components/CommonSearch.vue'
import GoodsCard from '@/components/GoodsCard.vue'

const wrapperHeight_px = `${
	containerHeight - uni.rpx2px(searchHeight) - tabBarHeight - uni.rpx2px(settleBarHeight)
}px`
</script>

<template>
	<view class="container">
		<CommonNavBar title="商城" titleColor="#ffffff"></CommonNavBar>
		<CommonSearch placeholder="请输入商品名称"></CommonSearch>
		<view class="wrapper">
			<scroll-view class="aside" scroll-y>
				<view class="aside_item" v-for="(item, index) in 10" :class="{ active: index === 0 }">
					菜单
				</view>
			</scroll-view>
			<scroll-view class="main" scroll-y>
				<view class="group" v-for="(group, index) in 3">
					<view class="group_label">白酒{{ index }}</view>
					<view class="group_list">
						<GoodsCard v-for="item in 3"></GoodsCard>
					</view>
				</view>
			</scroll-view>
			<!-- 结算栏 -->
			<view class="settle-container">
				<view class="settle-info">
					<view class="settle-info_icon">
						<view class="iconfont icon-caigou"></view>
						<view class="settle-info_icon_tag">3</view>
					</view>
					<view class="settle-info_text">
						<view class="settle-info_text_note">合计</view>
						<view class="settle-info_text_unit">￥</view>
						<view class="settle-info_text_price">
							{{ formatPrice(153300) }}
						</view>
					</view>
				</view>
				<view class="settle-btn">去结算</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	display: flex;
	height: v-bind(wrapperHeight_px);

	.aside {
		flex-shrink: 0;
		width: 200rpx;
		height: 100%;
		background-color: #f9f9f9;

		&_item {
			position: relative;
			width: 100%;
			height: 90rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			color: #333333;

			&.active {
				font-weight: bold;
				color: #000000;
				background-color: #ffffff;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					display: block;
					width: 8rpx;
					height: 28rpx;
					background-color: $uni-color-primary;
				}
			}
		}
	}

	.main {
		flex: 1;
		height: 100%;

		.group {
			padding: 10rpx 24rpx;

			&:nth-child(n + 2) {
				margin-top: 40rpx;
			}

			&_label {
				position: sticky;
				top: 0;
				left: 0;
				margin-bottom: 10rpx;
				background-color: #ffffff;
				font-size: 30rpx;
				color: #888888;
				z-index: 999;
			}

			&_list {
				display: grid;
				gap: 40rpx;
			}
		}
	}

	.settle-container {
		position: fixed;
		bottom: v-bind(tabBarHeight_px);
		z-index: 8000;
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		background-color: #676767;

		.settle-info {
			display: flex;
			align-items: center;

			&_icon {
				position: absolute;
				bottom: 0;
				width: 112rpx;
				height: 112rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				color: #ffffff;
				background-color: #bdaf8d;
				border-radius: 50%;

				.iconfont {
					font-size: 60rpx;
				}

				&_tag {
					position: absolute;
					top: 10%;
					left: 55%;
					min-width: 40rpx;
					height: 40rpx;
					padding: 10rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 24rpx;
					background-color: #ef5350;
					border-radius: 50%;
				}
			}

			&_text {
				margin-left: 130rpx;
				display: flex;
				align-items: baseline;
				color: #ffffff;

				&_note {
					flex-shrink: 0;
					font-size: 24rpx;
				}

				&_unit {
					flex-shrink: 0;
					font-size: 32rpx;
					font-weight: bold;
				}

				&_price {
					font-size: 42rpx;
					font-weight: bold;
				}
			}
		}

		.settle-btn {
			flex-shrink: 0;
			margin-left: auto;
			width: 210rpx;
			height: 66rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 36rpx;
			color: #ffffff;
			border-radius: 33rpx;
			background-color: #ef5350;
		}
	}
}
</style>
