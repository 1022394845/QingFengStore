<script setup>
import { routerBack, routerTo } from '@/utils/router'
import { statusBarHeight_px, titleBarHeight_px, navBarHeight_px } from '@/utils/system.js'

const props = defineProps({
	title: {
		type: String,
		default: '清风商城'
	},
	titleColor: {
		type: String,
		default: '#000000'
	},
	backUrl: {
		type: String,
		default: ''
	}
})

// 是否展示返回按钮
const showBack = props.backUrl || getCurrentPages().length > 1
const navBack = () => {
	if (props.backUrl) routerTo(props.backUrl, 'redirectTo')
	else routerBack()
}
</script>

<template>
	<view class="common-nav-bar">
		<view class="common-nav-bar_container">
			<view class="common-nav-bar_status-bar"></view>
			<view class="common-nav-bar_title-bar">
				<view class="common-nav-bar_title-bar_arrow" v-if="showBack" @click.stop="navBack">
					<uni-icons type="back" size="48rpx" :color="titleColor"></uni-icons>
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
		<view class="common-nav-bar_space"></view>
	</view>
</template>

<style scoped lang="scss">
.common-nav-bar {
	width: 750rpx;

	&_container {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		background-color: $uni-color-primary;
		z-index: 9998;
	}

	&_status-bar {
		width: 100%;
		height: v-bind(statusBarHeight_px);
	}

	&_title-bar {
		width: 100%;
		height: v-bind(titleBarHeight_px);
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

	&_space {
		height: v-bind(navBarHeight_px);
	}
}
</style>
