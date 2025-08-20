<script setup>
import { routerTo } from '@/utils/router.js'

defineOptions({
	options: {
		styleIsolation: 'shared'
	}
})

const props = defineProps({
	list: {
		type: Array,
		default: []
	}
})

const checkDetail = (id) => {
	routerTo(`/pages/news/detail?id=${id}`)
}
</script>

<template>
	<view class="scroll-notice">
		<view class="scroll-notice_prefix">
			<image class="image" src="/static/notic_prefix.png" mode="aspectFill"></image>
		</view>
		<view class="scroll-notice_list">
			<swiper
				class="scroll-notice_list_swiper"
				vertical
				autoplay
				:interval="5000"
				:duration="1000"
				circular
			>
				<swiper-item
					class="scroll-notice_list_swiper_item"
					v-for="item in list"
					:key="item._id"
					@click="checkDetail(item._id)"
				>
					<view class="scroll-notice_list_swiper_item_content ellipsis">{{ item.title }}</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="scroll-notice_suffix iconfont icon-more"></view>
	</view>
</template>

<style scoped lang="scss">
.scroll-notice {
	margin-top: 20rpx;
	display: flex;
	align-items: center;

	&_prefix {
		flex-shrink: 0;
		width: 88rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
	}

	&_list {
		flex: 1;
		margin-left: 20rpx;

		&_swiper {
			height: 40rpx;

			&_item {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;

				&_content {
					width: 100%;
					font-size: 32rpx;
					color: #333333;
				}
			}
		}
	}

	&_suffix {
		flex-shrink: 0;
		font-size: 32rpx;
		color: #333333;
	}
}
</style>
