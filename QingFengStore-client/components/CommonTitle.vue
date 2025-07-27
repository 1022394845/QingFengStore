<script setup>
const props = defineProps({
	name: {
		type: String,
		required: true
	},
	info: {
		type: String,
		default: '查看更多'
	}
})
</script>

<template>
	<view class="common-title">
		<view class="common-title_left">
			<view class="common-title_left_dot"></view>
			<view class="common-title_left_name">{{ name }}</view>
		</view>
		<view class="common-title_right">
			<view class="common-title_right_info">{{ info }}</view>
			<view class="common-title_right_icon">
				<uni-icons type="forward" size="28rpx" color="#A6A6A6"></uni-icons>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.common-title {
	margin: 34rpx 0;
	display: flex;
	justify-content: space-between;
	align-items: center;

	&_left {
		display: flex;
		align-items: center;
		font-size: 36rpx;
		font-weight: bold;
		color: $uni-color-primary;

		&_dot {
			margin-right: 12rpx;
			width: 6rpx;
			height: 32rpx;
			background-color: $uni-color-primary;
			border-radius: 6rpx;
		}
	}

	&_right {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #a6a6a6;
	}
}
</style>
