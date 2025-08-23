<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'
import { formatPrice } from '@/utils/format.js'
import { safeareaHeight, shopBarHeight } from '@/utils/system.js'
import { showMsg } from '@/utils/common.js'
const goodsCloudObj = uniCloud.importObject('client-goods', { customUI: true })

const detailHeight_px = `${safeareaHeight + shopBarHeight + uni.rpx2px(30)}px`

const loading = ref(false)
const detail = ref({})
const getDetail = async (id) => {
	if (!id) return showMsg('获取商品id失败')

	try {
		loading.value = true

		const { errCode, data } = await goodsCloudObj.detail(id)
		if (errCode !== 0) throw new Error()

		detail.value = data
		skuPopRef.value.setInfo(data)
	} catch {
		showMsg('获取商品信息失败')
	} finally {
		loading.value = false
	}
}

onLoad((e) => {
	if (e.id) getDetail(e.id)
})

const currentSku = computed(() => skuPopRef.value.currentSku)

// SKU弹出框
const skuPopRef = ref(null)
const openSkuPop = () => {
	if (!skuPopRef.value) return showMsg('未知错误，请刷新后重试')
	skuPopRef.value.open()
}

// 购物车弹出框
const cartPopRef = ref(null)
const openCartPop = () => {
	if (!cartPopRef.value) return showMsg('未知错误，请刷新后重试')
	cartPopRef.value.open()
}
</script>

<template>
	<view class="container">
		<common-nav-bar title="商品详情" titleColor="#ffffff" :canBack="true"></common-nav-bar>
		<view class="wrapper">
			<template v-if="detail._id">
				<!-- 轮播图 -->
				<view v-if="detail.goods_banner_imgs && detail.goods_banner_imgs.length" class="banner">
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
						<swiper-item
							class="banner_swiper_item"
							v-for="item in detail.goods_banner_imgs"
							:key="item"
						>
							<image class="image" :src="item" mode="aspectFill"></image>
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
							<view class="detail_price_new_text">
								{{ currentSku.price ? formatPrice(currentSku.price) : '暂无价格' }}
							</view>
						</view>
						<view class="detail_price_old" v-if="currentSku.market_price">
							￥{{ formatPrice(currentSku.market_price) }}
						</view>
					</view>
					<!-- 服务 -->
					<view class="detail_row servie">
						<view class="detail_row_label">服务</view>
						<view class="detail_row_content ellipsis">线下门店·快递发货·到店自取</view>
					</view>
					<!-- 规格 -->
					<view class="detail_row sku" @click="openSkuPop">
						<view class="detail_row_label">规格</view>
						<view class="detail_row_content ellipsis" style="font-weight: bold">
							{{ currentSku.sku_name || '请选择产品规格' }}
						</view>
						<view class="detail_row_icon icon-container">
							<uni-icons type="forward" size="36rpx" color="#999999"></uni-icons>
						</view>
					</view>
					<!-- 详细信息 -->
					<view class="detail_content">
						<mp-html :content="detail.goods_desc" lazy-load selectable />
					</view>
				</view>
			</template>

			<uv-loading-page :loading="loading" loading-text="加载中" font-size="48rpx"></uv-loading-page>
		</view>
		<!-- 操作栏 -->
		<common-shop-bar
			v-if="detail._id"
			@openSku="openSkuPop"
			@openCart="openCartPop"
		></common-shop-bar>

		<!-- SKU弹出框 -->
		<goods-sku ref="skuPopRef"></goods-sku>
		<!-- 购物车弹出框 -->
		<goods-cart ref="cartPopRef"></goods-cart>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	.loading {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 32rpx;
		color: #333333;
	}

	.banner {
		width: 100%;
		aspect-ratio: 1 / 1;

		&_swiper {
			width: 100%;
			height: 100%;

			&_item {
				width: 100%;
				height: 100%;
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
