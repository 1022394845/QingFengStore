<script setup>
import dayjs from 'dayjs'
import { routerTo } from '@/utils/router.js'
import { onMounted, ref } from 'vue'
import { navBarHeight_px } from '@/utils/system.js'
const newsCloudObj = uniCloud.importObject('client-news', { customUI: true })

const newsList = ref([])
const pagingRef = ref(null)
const loadNewsList = async (page, pageSize) => {
	try {
		const { errCode, data } = await newsCloudObj.list({ page, pageSize })

		if (errCode !== 0) throw new Error()
		pagingRef.value.complete(data)
	} catch {
		pagingRef.value.complete(false)
	}
}
</script>

<template>
	<view class="container">
		<z-paging ref="pagingRef" v-model="newsList" :default-page-size="9" @query="loadNewsList">
			<template #top>
				<common-nav-bar title="资讯" titleColor="#ffffff"></common-nav-bar>
			</template>

			<template #loading>
				<view class="loading" style="margin: 100rpx auto">
					<dot-loading>加载中</dot-loading>
				</view>
			</template>

			<view class="news-list">
				<view
					class="news-list_item"
					v-for="item in newsList"
					:key="item._id"
					@click="routerTo(`/pages/news/detail?id=${item._id}`)"
				>
					<view class="news-list_item_text">
						<view class="news-list_item_text_title ellipsis-2">{{ item.title }}</view>
						<view class="news-list_item_text_info">
							<view class="news-list_item_text_info_user ellipsis">
								{{ item.user?.nickname || '未知用户' }}
							</view>
							<view class="news-list_item_text_info_createTime">
								{{ dayjs(item.publish_date).format('YYYY-MM-DD HH:mm') }}
							</view>
						</view>
					</view>
					<view class="news-list_item_image" v-if="item.avatar">
						<uv-image
							class="image"
							:src="item.avatar"
							observeLazyLoad
							width="100%"
							height="100%"
						></uv-image>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<style scoped lang="scss">
.container {
	min-height: calc(100vh - v-bind(navBarHeight_px));
	background-color: #f9f9f9;
}

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
