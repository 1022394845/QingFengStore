<script setup>
import { ref } from 'vue'
import { navBarHeight_px, searchHeight_px } from '@/utils/system.js'

defineOptions({
	options: {
		styleIsolation: 'shared'
	}
})

const props = defineProps({
	placeholder: {
		type: String,
		default: '请输入内容'
	}
})

const search = defineModel({ type: String, default: '' })
const emits = defineEmits(['search'])
const onSearch = () => {
	if (search.value) emits('search', search.value)
}
</script>

<template>
	<view class="search-container">
		<view class="search-input">
			<uni-easyinput
				suffixIcon="search"
				v-model.trim="search"
				:placeholder="placeholder"
				@iconClick="onSearch"
				@confirm="onSearch"
			></uni-easyinput>
		</view>
		<view class="search-space"></view>
	</view>
</template>

<style scoped lang="scss">
.search-container {
	.search-input {
		position: fixed;
		top: v-bind(navBarHeight_px);
		left: 0;
		width: 100%;
		height: v-bind(searchHeight_px);
		padding: 10rpx 32rpx 20rpx;
		background-color: $uni-color-primary;
		z-index: 9999;

		.uni-easyinput {
			height: 100%;

			:deep(.uni-easyinput__content) {
				height: 100%;
				border-radius: 35rpx !important;
				border: none !important;
			}
		}

		:deep(.uni-easyinput__content-input) {
			height: 70rpx;
			font-size: 28rpx !important;

			.uni-input-placeholder {
				font-size: 28rpx !important;
			}
		}

		:deep(.uni-icons) {
			font-size: 48rpx !important;
		}
	}

	.search-space {
		height: v-bind(searchHeight_px);
	}
}
</style>
