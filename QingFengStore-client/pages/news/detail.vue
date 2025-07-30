<script setup>
import CommonNavBar from '@/components/CommonNavBar.vue'
import dayjs from 'dayjs'
import { ref } from 'vue'

const detail = ref({
	title: '测试标题测试标题测试标题测试标题测试标题测试标题测试标题测试标题测试标题',
	user: '作者',
	createTime: 1753792497000,
	content: `<p style="font-size:16px;color:#333;">2024全球智能科技博览会现场人头攒动，来自全球30多个国家的800余家企业带来了500余项前沿科技成果。从人工智能到量子计算，从自动驾驶到绿色能源，各类创新技术集中亮相，展现了全球科技发展的最新趋势。</p>
<h3 style="font-size:20px;color:#0066cc;margin-top:25px;margin-bottom:10px;">AI技术成全场焦点</h3>
<p style="font-size:15px;color:#555;line-height:1.8;">在<span style="font-weight:bold;color:#e63946;">人工智能展区</span>，一款搭载深度学习算法的服务机器人引发围观。它不仅能精准识别100余种方言，还可通过面部表情分析用户情绪，提供个性化服务方案。现场演示中，机器人为老年观众讲解产品时自动切换至慢速语音模式，贴心举动获赞无数。</p>
<img src="https://picsum.photos/800/400?random=3" alt="智能服务机器人演示" style="max-width:100%;height:auto;margin:15px 0;">
<h3 style="font-size:20px;color:#0066cc;margin-top:25px;margin-bottom:10px;">绿色科技亮点纷呈</h3>
<p style="font-size:15px;color:#555;line-height:1.8;">新能源专区内，<span style="font-style:italic;color:#2a9d8f;">钙钛矿太阳能电池</span>的转化效率突破31%，较传统硅基电池提升近40%。某企业负责人介绍：<span style="font-size:14px;color:#666;">"这款产品厚度仅0.3毫米，可直接附着在建筑玻璃表面，明年量产后面板成本将降低至每平方米80元。"</span></p>
<p style="font-size:14px;color:#888;margin-top:30px;">展会将持续至7月20日，期间还将举办20场专业论坛及12场技术对接会。</p>`
})

const contentTagStyle = {
	img: 'display: block; max-width: 100%; border: none'
}
</script>

<template>
	<view class="container">
		<CommonNavBar title="资讯详情" titleColor="#ffffff" backUrl="/pages/news/news"></CommonNavBar>
		<view class="news_title">
			{{ detail.title }}
		</view>
		<view class="news_info">
			<view class="news_info_user ellipsis">{{ detail.user }}</view>
			<view class="news_info_createTime">
				{{ dayjs(detail.createTime).format('YYYY-MM-DD') }}
			</view>
		</view>
		<view class="news_content">
			<uv-parse
				:content="detail.content"
				:tag-style="contentTagStyle"
				selectable
				lazyLoad
			></uv-parse>
		</view>
	</view>
</template>

<style scoped lang="scss">
.container {
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
