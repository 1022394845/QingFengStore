<script setup>
import { windowHeight_px } from '@/utils/system.js'
</script>

<template>
	<view class="container">
		<view class="wrapper">
			<view class="header">
				<view class="header_title">选择地址</view>
				<view class="header_add-address">
					<view class="iconfont icon-add"></view>
					<view class="text">新增地址</view>
				</view>
			</view>
			<view class="address-list">
				<view class="address-list_item" v-for="item in 3" :key="item">
					<view class="address-list_item_info">
						<view class="address-list_item_info_base-address">山东省 济南市 历下区</view>
						<view class="address-list_item_info_detail-address">中铁会展中心2号楼5层530室</view>
						<view class="address-list_item_info_contact">王五 18966665555</view>
					</view>
					<view class="address-list_item_edit">
						<view class="iconfont icon-edit"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	width: 100%;
	height: v-bind(windowHeight_px);
	padding: 40rpx;
	background-color: #f3f4f6;

	.header {
		width: 100%;
		margin-bottom: 40rpx;
		display: flex;
		align-items: center;

		&_title {
			font-size: 32rpx;
			font-weight: bold;
		}

		&_add-address {
			margin-left: auto;
			display: flex;
			gap: 5rpx;
			align-items: center;
			font-size: 32rpx;
			color: $uni-color-primary;
		}
	}

	.address-list {
		width: 100%;

		&_item {
			width: 100%;
			height: fit-content;
			margin-bottom: 40rpx;
			padding: 40rpx;
			display: flex;
			gap: 20rpx;
			align-items: center;
			background-color: #ffffff;
			border-radius: 20rpx;

			&_info {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 10rpx;

				&_base-address {
					font-size: 28rpx;
					color: #666666;
				}

				&_detail-address {
					font-size: 34rpx;
					color: #000000;
				}

				&_contact {
					font-size: 30rpx;
					color: #000000;
				}
			}

			&_edit {
				flex-shrink: 0;
				font-size: 32rpx;
				color: #333333;
			}
		}
	}
}
</style>
