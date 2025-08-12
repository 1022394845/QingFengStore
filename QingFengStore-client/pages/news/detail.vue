<script setup>
import CommonNavBar from '@/components/CommonNavBar.vue'
import dayjs from 'dayjs'
import hljs from 'highlight.js' // 代码块高亮
import 'highlight.js/styles/atom-one-dark.css'
import { nextTick, onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const newsCloudObj = uniCloud.importObject('client-news', { customUI: true })

let newsId = null
const contentRef = ref(null)
const detail = ref({})
const getDetail = async (id) => {
	try {
		uni.showLoading({
			title: '加载中'
		})

		const { errCode, data } = await newsCloudObj.detail(id)

		if (errCode !== 0) throw new Error()
		detail.value = data
		nextTick(() => {
			// 高亮代码块
			const query = document.querySelectorAll('code') || []
			query.forEach((item) => {
				hljs.highlightElement(item)
			})
		})
	} catch {
		uni.showToast({
			title: '获取失败',
			icon: 'none'
		})
	} finally {
		uni.hideLoading()
	}
}

onLoad((e) => {
	if (e.id) newsId = e.id
})
onMounted(() => {
	getDetail(newsId)
})
</script>

<template>
	<view class="container">
		<CommonNavBar title="资讯详情" titleColor="#ffffff" :canBack="true"></CommonNavBar>
		<view class="wrapper" v-if="detail._id">
			<view class="news_title">
				{{ detail.title }}
			</view>
			<view class="news_info">
				<view id="row1">
					<view class="news_info_user ellipsis">{{ detail.user?.nickname || '未知用户' }}</view>
					<view class="news_info_publish-date">
						{{ dayjs(detail.publish_date).format('YYYY-MM-DD HH:mm') }}
					</view>
				</view>
				<view id="row2">
					<view class="news_info_view-count">
						<view class="news_info_view-count_icon">
							<uni-icons type="eye" size="28rpx" color="#AAAAAA"></uni-icons>
						</view>
						<view class="news_info_view-count_text ellipsis">
							{{ detail.view_count }}
						</view>
					</view>
				</view>
			</view>
			<view class="news_content" ref="contentRef">
				<uv-parse
					:content="detail.content"
					selectable
					lazyLoad
					:tagStyle="{ p: 'line-height: 1.5em;' }"
				></uv-parse>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	width: 100%;
	padding: 32rpx;

	.news {
		width: 100%;

		&_title {
			font-size: 36rpx;
			font-weight: bold;
			line-height: 1.5em;
		}

		&_info {
			margin-top: 24rpx;
			line-height: 1.5em;
			border-bottom: 1rpx solid $uni-border-color;

			#row1 {
				display: flex;
				gap: 20rpx;
				align-items: center;
				font-size: 28rpx;
				color: #aaaaaa;

				.news_info_publish-date {
					flex-shrink: 0;
				}
			}

			#row2 {
				.news_info_view-count {
					display: flex;
					gap: 10rpx;
					align-items: center;
					font-size: 28rpx;
					color: #aaaaaa;
				}
			}
		}

		&_content {
			margin-top: 32rpx;
			font-size: 32rpx;
		}
	}
}
</style>
