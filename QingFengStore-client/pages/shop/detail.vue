<script setup>
import CommonNavBar from '@/components/CommonNavBar.vue'
import CommonShopBar from '@/components/CommonShopBar.vue'
import GoodsSKU from '@/components/GoodsSKU.vue'
import GoodsCart from '@/components/GoodsCart.vue'
import { computed, onMounted, ref } from 'vue'
import { formatPrice } from '@/utils/format'
import { getGoodsDetailAPI } from '@/apis/goods'
import { safeareaHeight, shopBarHeight } from '@/utils/system'

const detailHeight_px = `${safeareaHeight + shopBarHeight + uni.rpx2px(30)}px`
const popupBottom_px = `${safeareaHeight + uni.rpx2px(40)}px`

const detail = ref({})
const getDetail = async () => {
	const { data = {} } = await getGoodsDetailAPI()
	detail.value = data
	currentGoodsSkuId.value = data.sku?.[0]._id
}
onMounted(() => {
	getDetail()
})

// SKU弹出框
const skuPopRef = ref(null)
const currentGoodsSkuId = ref('')
const currentSkuInfo = computed(
	() => detail.value.sku?.find((item) => item._id === currentGoodsSkuId.value) || {}
)
const openSkuPop = () => {
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
					<swiper-item
						class="banner_swiper_item"
						v-for="item in detail.goods_banner_imgs"
						:key="item"
					>
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
						<view class="detail_price_new_text">
							{{ formatPrice(currentSkuInfo.price || null) }}
						</view>
					</view>
					<view class="detail_price_old" v-if="currentSkuInfo.market_price">
						￥{{ formatPrice(currentSkuInfo.market_price) }}
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
						{{ currentSkuInfo.name || '请选择产品规格' }}
					</view>
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
		<CommonShopBar @openSku="openSkuPop" @openCart="openCartPop"></CommonShopBar>
		<!-- SKU弹出框 -->
		<uni-popup ref="skuPopRef" type="bottom" :safe-area="false">
			<view class="sku-popup_container">
				<GoodsSKU
					:detail="detail"
					v-model:currentGoodsSkuId="currentGoodsSkuId"
					@close="closeSkuPop"
				></GoodsSKU>
			</view>
		</uni-popup>
		<!-- 购物车弹出框 -->
		<uni-popup ref="cartPopRef" type="bottom" :safe-area="false">
			<view class="cart-popup_container">
				<GoodsCart></GoodsCart>
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

.sku-popup_container,
.cart-popup_container {
	min-height: 300rpx;
	padding: 40rpx 32rpx v-bind(popupBottom_px);
	background-color: #ffffff;
	border-radius: 30rpx 30rpx 0 0;
}
</style>
