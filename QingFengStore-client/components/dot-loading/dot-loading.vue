<script setup></script>

<template>
	<view class="dot-loading">
		<!-- 显示内容 -->
		<slot></slot>
		<!-- 加载样式 -->
		<view class="loading-dot dot1"></view>
		<view class="loading-dot dot2"></view>
		<view class="loading-dot dot3"></view>
	</view>
</template>

<style scoped lang="scss">
.dot-loading {
	display: flex;
	gap: 10rpx;
	align-items: center;
	color: #666666;

	.loading-dot {
		width: 5rpx;
		height: 5rpx;
		border-radius: 50%;
		background-color: #333333;
		animation: dotPulse 1.5s infinite ease-in-out;

		@for $i from 1 through 3 {
			&.dot#{$i} {
				animation-delay: 0.2s * ($i - 1);
			}
		}
	}

	/* 点淡入淡出效果 */
	@keyframes dotPulse {
		0%,
		100% {
			opacity: 0;
			transform: scale(0.5);
		}
		50% {
			opacity: 1;
			transform: scale(1);
		}
	}
}
</style>
