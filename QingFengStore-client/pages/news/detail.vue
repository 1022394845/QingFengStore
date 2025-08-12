<script setup>
import CommonNavBar from '@/components/CommonNavBar.vue'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const newsCloudObj = uniCloud.importObject('client-news', { customUI: true })

const detail = ref({})
const getDetail = async (id) => {
	try {
		uni.showLoading({
			title: '加载中'
		})

		const { errCode, data } = await newsCloudObj.detail(id)

		detail.value = data
		if (errCode !== 0) throw new Error()
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
	if (e.id) getDetail(e.id)
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
				<view class="news_info_user ellipsis">{{ detail.user?.nickname || '未知用户' }}</view>
				<view class="news_info_createTime">
					{{ dayjs(detail.publish_date).format('YYYY-MM-DD HH:mm') }}
				</view>
			</view>
			<view class="news_content">
				<uv-parse :content="detail.content" selectable lazyLoad></uv-parse>
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
			display: flex;
			gap: 20rpx;
			align-items: center;
			font-size: 28rpx;
			color: #aaaaaa;

			&_createTime {
				flex-shrink: 0;
			}
		}

		&_content {
			margin-top: 32rpx;
			font-size: 32rpx;
		}
	}
}
</style>
