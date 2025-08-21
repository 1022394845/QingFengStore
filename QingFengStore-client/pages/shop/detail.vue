<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'
import { formatPrice } from '@/utils/format.js'
import { safeareaHeight, shopBarHeight } from '@/utils/system.js'
import { showMsg } from '@/utils/common.js'
const goodsCloudObj = uniCloud.importObject('client-goods', { customUI: true })

const detailHeight_px = `${safeareaHeight + shopBarHeight + uni.rpx2px(30)}px`
const popupBottom_px = `${safeareaHeight + uni.rpx2px(40)}px`

let goods_id = null
const detail = ref({})

const getDetail = async () => {
	if (!goods_id) return showMsg('获取商品id失败')

	try {
		uni.showLoading({
			title: '加载中...'
		})
		const { errCode, data } = await goodsCloudObj.detail(goods_id)
		if (errCode !== 0) throw new Error()

		detail.value = data
		currentSkuId.value = data.skus?.[0]?._id || null // 设置默认sku规格
	} catch {
		showMsg('获取商品信息失败')
	} finally {
		uni.hideLoading()
	}
}

onLoad((e) => {
	if (e.id) goods_id = e.id
})

onMounted(() => {
	getDetail()
})

const currentSkuId = ref(null)
const currentSku = computed(() => {
	return detail.value.skus?.find((item) => item._id === currentSkuId.value) || {}
})

// SKU弹出框
const skuPopRef = ref(null)
const openSkuPop = () => {
	if (!skuPopRef.value) return
	skuPopRef.value.open()
}
const closeSkuPop = () => {
	skuPopRef.value.close()
}

// 购物车弹出框
const cartPopRef = ref(null)
const openCartPop = () => {
	cartPopRef.value.open()
}
const closeCartPop = () => {
	cartPopRef.value.close()
}
</script>

<template>
	<view class="container">
		<common-nav-bar title="商品详情" titleColor="#ffffff" :canBack="true"></common-nav-bar>
		<view class="wrapper">
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
		</view>
		<!-- 操作栏 -->
		<common-shop-bar @openSku="openSkuPop" @openCart="openCartPop"></common-shop-bar>
		<!-- SKU弹出框 -->
		<uni-popup ref="skuPopRef" type="bottom" :safe-area="false">
			<view class="sku-popup_container">
				<goods-sku v-model="currentSkuId" :detail="detail" @close="closeSkuPop"></goods-sku>
			</view>
		</uni-popup>
		<!-- 购物车弹出框 -->
		<uni-popup ref="cartPopRef" type="bottom" :safe-area="false">
			<view class="cart-popup_container">
				<goods-cart></goods-cart>
			</view>
		</uni-popup>
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

.sku-popup_container,
.cart-popup_container {
	min-height: 300rpx;
	padding: 40rpx 32rpx v-bind(popupBottom_px);
	background-color: #ffffff;
	border-radius: 30rpx 30rpx 0 0;
}
</style>
