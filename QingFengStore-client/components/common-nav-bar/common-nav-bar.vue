<script setup>
import { routerBack, routerTo } from '@/utils/router.js'
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
	canBack: {
		type: Boolean,
		default: false
	}
})

// 是否展示返回按钮
const pageStackNum = getCurrentPages().length
const showBack = pageStackNum > 1 || props.canBack
const navBack = () => {
	if (pageStackNum > 1) routerBack()
	else history.back()
}
</script>

<template>
	<view class="common-nav-bar">
		<view class="common-nav-bar_container">
			<view class="common-nav-bar_status-bar"></view>
			<view class="common-nav-bar_title-bar">
				<view
					class="common-nav-bar_title-bar_arrow iconfont icon-back"
					v-if="showBack"
					@click.stop="navBack"
				></view>
				<view
					class="common-nav-bar_title-bar_text"
					:style="{ color: titleColor, textAlign: showBack ? 'center' : 'left' }"
				>
					{{ title }}
				</view>
				<!-- 用于保证标题居中占位 -->
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

		&_arrow {
			margin-left: -10rpx;
			font-size: 42rpx;
			color: #ffffff;
		}

		&_text {
			flex: 1;
			font-weight: bold;
		}
	}

	&_space {
		width: 100%;
		height: v-bind(navBarHeight_px);
	}
}
</style>
