<script setup>
import CommonNavBar from '@/components/CommonNavBar.vue'
import CommonShopBar from '@/components/CommonShopBar.vue'
import { onMounted, ref } from 'vue'
import { formatPrice } from '@/utils/format'
import { getGoodsDetailAPI } from '@/apis/goods'
import { safeareaHeight, shopBarHeight } from '@/utils/system'

const detailHeight_px = safeareaHeight + shopBarHeight + uni.rpx2px(30) + 'px'

const detail = ref({})
const getDetail = async () => {
	const { data } = await getGoodsDetailAPI()
	detail.value = data
}
onMounted(() => {
	getDetail()
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
					<swiper-item class="banner_swiper_item" v-for="item in detail.goods_banner_imgs">
						<image class="banner_swiper_item_image" :src="item" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- 内容详情 -->
			<view class="detail">
				<!-- 标题 -->
				<view class="detail_title">
					{{ detail.name }}
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
						:content="detail.goods_desc"
						:tag-style="Object({ img: 'display: block; max-width: 100%; border: none' })"
						selectable
						lazyLoad
					></uv-parse>
				</view>
			</view>
		</view>
		<!-- 操作栏 -->
		<CommonShopBar></CommonShopBar>
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
		padding-bottom: v-bind(detailHeight_px);

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
