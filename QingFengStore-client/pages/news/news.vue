<script setup>
import CommonNavBar from '@/components/CommonNavBar.vue'
import dayjs from 'dayjs'
import { routerTo } from '@/utils/router'
</script>

<template>
	<view class="container">
		<CommonNavBar title="资讯" titleColor="#ffffff"></CommonNavBar>
		<view class="news-list">
			<view class="news-list_item" v-for="item in 3" @click="routerTo('/pages/news/detail')">
				<view class="news-list_item_text">
					<view class="news-list_item_text_title ellipsis-2">测试标题</view>
					<view class="news-list_item_text_info">
						<view class="news-list_item_text_info_user ellipsis">作者</view>
						<view class="news-list_item_text_info_createTime">
							{{ dayjs(1753792497000).format('YYYY-MM-DD') }}
						</view>
					</view>
				</view>
				<view class="news-list_item_image" v-if="true">
					<uv-image
						class="image"
						src="/static/tmp_banner1.png"
						observeLazyLoad
						width="100%"
						height="100%"
					></uv-image>
				</view>
			</view>
			<view class="news-list_nomore">暂无更多资讯</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.news-list {
	padding: 20rpx;
	width: 100%;

	&_item {
		width: 100%;
		height: 150rpx;
		margin-bottom: 50rpx;
		display: flex;
		justify-content: space-between;
		gap: 20rpx;
		align-items: center;

		&_text {
			flex: 1 1 0;
			width: 0;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			&_title {
				font-size: 32rpx;
			}

			&_info {
				display: flex;
				gap: 20rpx;
				align-items: center;
				font-size: 28rpx;
				color: #aaaaaa;

				&_createTime {
					flex-shrink: 0;
				}
			}
		}

		&_image {
			flex-shrink: 0;
			height: 100%;
			aspect-ratio: 16 / 9;
			border-radius: 20rpx;
			overflow: hidden;
		}
	}

	.news-list_nomore {
		margin: 30rpx auto;
		font-size: 32rpx;
		color: #aaaaaa;
		text-align: center;
	}
}
</style>
