<script setup>
import { statusBarHeight, titleBarHeight, navBarHeight } from '@/utils/system.js'

const props = defineProps({
	title: {
		type: String,
		default: '清风商城'
	},
	titleColor: {
		type: String,
		default: '#000000'
	}
})

// 是否展示返回按钮
const showBack = getCurrentPages().length > 1
const navBack = () => {
	uni.navigateBack({
		fail: () => {
			uni.reLaunch({
				url: '/pages/index/index'
			})
		}
	})
}
</script>

<template>
	<view class="common-nav-bar">
		<view class="common-nav-bar_container">
			<view class="common-nav-bar_status-bar" :style="{ height: `${statusBarHeight}px` }"></view>
			<view class="common-nav-bar_title-bar" :style="{ height: `${titleBarHeight}px` }">
				<view class="common-nav-bar_title-bar_arrow" v-if="showBack" @click.stop="navBack">
					<uni-icons type="back" size="28" :color="titleColor"></uni-icons>
				</view>
				<view
					class="common-nav-bar_title-bar_text"
					:style="{ color: titleColor, textAlign: showBack ? 'center' : 'left' }"
				>
					{{ title }}
				</view>
				<view class="common-nav-bar_title-bar_menu"></view>
			</view>
		</view>
		<view class="common-nav-bar_space" :style="{ height: `${navBarHeight}px` }"></view>
	</view>
</template>

<style scoped lang="scss">
@import '@/styles/var.scss';

.common-nav-bar {
	width: 750rpx;

	&_container {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		background-color: $qfs-color-primary;
	}

	&_status-bar {
		width: 100%;
	}

	&_title-bar {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 32rpx;
		font-size: 44rpx;

		&_arrow,
		&_menu {
			width: 80rpx;
			height: 100%;
			flex-shrink: 0;
			display: flex;
			align-items: center;
		}
		&_text {
			flex: 1;
			font-weight: bold;
		}
	}
}
</style>
