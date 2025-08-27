<script setup>
import { computed } from 'vue'

const props = defineProps({
	length: {
		// 加载点的个数
		type: Number,
		default: 3
	},
	size: {
		// 点大小 单位rpx
		type: [Number, String],
		default: '5rpx'
	}
})

const size = computed(() => {
	if (typeof props.size === 'number') return `${props.size}rpx`
	return props.size
})
</script>

<template>
	<view class="dot-loading">
		<!-- 显示内容 -->
		<slot></slot>
		<!-- 加载样式 -->
		<view
			class="loading-dot"
			v-for="index in length"
			:key="index"
			:style="{ fontSize: size, animationDelay: `${0.2 * (index - 1)}s` }"
		></view>
	</view>
</template>

<style scoped lang="scss">
.dot-loading {
	display: flex;
	gap: 10rpx;
	align-items: center;
	color: #666666;

	.loading-dot {
		width: v-bind(size);
		aspect-ratio: 1 / 1;
		border-radius: 50%;
		background-color: #333333;
		animation: dotPulse 1.5s infinite ease-in-out;
		opacity: 0;
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
