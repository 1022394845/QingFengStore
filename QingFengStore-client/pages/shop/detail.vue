<script setup>
import { ref } from 'vue'
import CommonNavBar from '@/components/CommonNavBar.vue'
import { formatPrice } from '@/utils/format'

const detail = ref({
	title: '测试商品测试商品测试商品测试商品测试商品测试商品测试商品测试商品',
	content: `<p style="font-size:16px;color:#333;">2024全球智能科技博览会现场人头攒动，来自全球30多个国家的800余家企业带来了500余项前沿科技成果。从人工智能到量子计算，从自动驾驶到绿色能源，各类创新技术集中亮相，展现了全球科技发展的最新趋势。</p>
<h3 style="font-size:20px;color:#0066cc;margin-top:25px;margin-bottom:10px;">AI技术成全场焦点</h3>
<p style="font-size:15px;color:#555;line-height:1.8;">在<span style="font-weight:bold;color:#e63946;">人工智能展区</span>，一款搭载深度学习算法的服务机器人引发围观。它不仅能精准识别100余种方言，还可通过面部表情分析用户情绪，提供个性化服务方案。现场演示中，机器人为老年观众讲解产品时自动切换至慢速语音模式，贴心举动获赞无数。</p>
<img src="https://picsum.photos/800/400?random=3" alt="智能服务机器人演示" style="max-width:100%;height:auto;margin:15px 0;">
<h3 style="font-size:20px;color:#0066cc;margin-top:25px;margin-bottom:10px;">绿色科技亮点纷呈</h3>
<p style="font-size:15px;color:#555;line-height:1.8;">新能源专区内，<span style="font-style:italic;color:#2a9d8f;">钙钛矿太阳能电池</span>的转化效率突破31%，较传统硅基电池提升近40%。某企业负责人介绍：<span style="font-size:14px;color:#666;">"这款产品厚度仅0.3毫米，可直接附着在建筑玻璃表面，明年量产后面板成本将降低至每平方米80元。"</span></p>
<p style="font-size:14px;color:#888;margin-top:30px;">展会将持续至7月20日，期间还将举办20场专业论坛及12场技术对接会。</p>`
})
</script>

<template>
	<view class="container">
		<CommonNavBar title="商品详情" titleColor="#ffffff"></CommonNavBar>
		<view class="wrapper">
			<!-- 轮播图 -->
			<view class="banner">
				<swiper
					class="banner_swiper"
					indicator-dots
					indicator-color="rgba(255,255,255,0.5)"
					indicator-active-color="#ffffff"
					:autoplay="true"
					:interval="5000"
					:duration="1000"
					circular
				>
					<swiper-item class="banner_swiper_item">
						<image
							class="banner_swiper_item_image"
							src="/static/tmp_banner1.png"
							mode="aspectFill"
						></image>
					</swiper-item>
					<swiper-item class="banner_swiper_item">
						<image
							class="banner_swiper_item_image"
							src="/static/tmp_banner2.jpg"
							mode="aspectFill"
						></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- 内容详情 -->
			<view class="detail">
				<!-- 标题 -->
				<view class="detail_title">
					{{ detail.title }}
				</view>
				<!-- 价格 -->
				<view class="detail_price">
					<view class="detail_price_new">
						<view class="detail_price_new_unit">￥</view>
						<view class="detail_price_new_text">{{ formatPrice(18900) }}</view>
					</view>
					<view class="detail_price_old">￥{{ formatPrice(22900) }}</view>
				</view>
				<!-- 服务 -->

				<view class="detail_row servie">
					<view class="detail_row_label">服务</view>
					<view class="detail_row_content ellipsis">线下门店·快递发货·到店自取</view>
				</view>
				<!-- 规格 -->
				<view class="detail_row sku">
					<view class="detail_row_label">规格</view>
					<view class="detail_row_content ellipsis">线下门店·快递发货·到店自取</view>
					<view class="detail_row_icon">
						<uni-icons type="forward" size="36rpx" color="#999999"></uni-icons>
					</view>
				</view>
				<!-- 详细信息 -->
				<view class="detail_content">
					<uv-parse
						:content="detail.content"
						:tag-style="Object({ img: 'display: block; max-width: 100%; border: none' })"
						selectable
						lazyLoad
					></uv-parse>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	.banner {
		width: 100%;
		aspect-ratio: 1 / 1;

		&_swiper {
			width: 100%;
			height: 100%;

			&_item {
				width: 100%;
				height: 100%;

				&_image {
					display: block;
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.detail {
		padding: 32rpx;

		&_title {
			font-size: 42rpx;
			font-weight: bolder;
			color: #333333;
			line-height: 1.5em;
		}

		&_price {
			width: 100%;
			margin-top: 20rpx;
			display: flex;
			align-items: baseline;
			flex-wrap: wrap;

			&_new {
				margin-right: 10rpx;
				display: flex;
				align-items: baseline;
				word-break: break-all;
				font-size: 38rpx;
				font-weight: bold;
				color: #ff0f23;

				&_unit {
					font-size: 32rpx;
				}
			}

			&_old {
				margin-left: 10rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #bbbbbb;
				text-decoration: line-through;
			}
		}

		&_row {
			height: 100rpx;
			display: flex;
			align-items: center;
			padding-top: 16rpx;
			font-size: 32rpx;
			background-color: #ffffff;
			border-top: 32rpx solid #f9f9f9;

			&_label {
				flex-shrink: 0;
				margin-right: 40rpx;
				color: #999999;
			}

			&_content {
				flex: 1 1 0;
				color: #333333;
			}

			&_icon {
				flex-shrink: 0;
			}
		}

		&_content {
			margin-top: 50rpx;
		}
	}
}
</style>
