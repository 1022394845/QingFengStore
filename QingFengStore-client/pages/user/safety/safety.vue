<script setup>
import { defaultNavBarHeight_px } from '@/utils/system.js'
</script>

<template>
	<view class="container">
		<view class="cell-list">
			<view class="cell-list_item">
				<view class="cell-list_item_title">支付安全</view>
				<view class="cell-list_item_content">
					<uv-cell-group>
						<uv-cell title="支付密码" :isLink="true" url="./payment"></uv-cell>
					</uv-cell-group>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.container {
	min-height: calc(100vh - v-bind(defaultNavBarHeight_px));
	background-color: #f3f4f6;
}

.cell-list {
	width: 100%;

	&_item {
		margin-bottom: 40rpx;

		&_title {
			height: 80rpx;
			padding-left: 40rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #666666;
			line-height: 80rpx;
		}

		&_content {
			background-color: #ffffff;
		}
	}
}
</style>
