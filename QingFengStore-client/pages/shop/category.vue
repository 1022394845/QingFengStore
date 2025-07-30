<script setup>
import {
	containerHeight,
	searchHeight,
	tabBarHeight,
	tabBarHeight_px,
	settleBarHeight,
	navBarHeight,
	settleBarHeight_px
} from '@/utils/system.js'
import { formatPrice } from '@/utils/format.js'
import { throttle } from '@/utils/throttle.js'
import { getCurrentInstance, nextTick, onMounted, ref } from 'vue'
import CommonNavBar from '@/components/CommonNavBar.vue'
import CommonSearch from '@/components/CommonSearch.vue'
import GoodsCard from '@/components/GoodsCard.vue'
import GoodsSKU from '@/components/GoodsSKU.vue'
import GoodsCart from '@/components/GoodsCart.vue'
import { getCategoryListAPI, getGoodsDetailAPI } from '@/apis/goods'
import { useCartStore } from '@/store/cart'
import { routerTo } from '@/utils/router'

const wrapperHeight_px = `${containerHeight - searchHeight - tabBarHeight - settleBarHeight}px`
const popupBottom_px = `${tabBarHeight + uni.rpx2px(40)}px`

// 分类
const categoryList = ref([])
const getCategoryList = async () => {
	const { data = [] } = await getCategoryListAPI()
	categoryList.value = data
}
onMounted(async () => {
	await getCategoryList()
	currentCategory.value = categoryList.value[0]._id
	await nextTick()
	getCategoryOffset()
})

const currentCategory = ref('')
const currentCategoryOffset = ref(0)
const instance = getCurrentInstance()
const getCategoryOffset = () => {
	categoryList.value.forEach((item, index) => {
		const query = uni
			.createSelectorQuery()
			.in(instance)
			.select(`#group-${item._id}`)
			.boundingClientRect(({ top }) => {
				item.top = top - navBarHeight - searchHeight
			})
			.exec()
	})
}

let onChanging = false // 在手动切换时禁用滚动监测
const onChangeCategory = (item) => {
	onChanging = true
	onScrollCategory.disableLastCall()
	currentCategory.value = item._id
	currentCategoryOffset.value = item.top
	setTimeout(() => {
		onChanging = false
		onScrollCategory.enableLastCall()
	}, 500)
}

const onScrollCategory = throttle((event) => {
	if (onChanging) return
	const scrollTop = event.detail.scrollTop
	const result = categoryList.value.filter((item) => item.top <= scrollTop + 1)
	if (result.length) currentCategory.value = result[result.length - 1]._id
})

// SKU弹出框
const skuPopRef = ref(null)
const currentGoodsDetail = ref({})
const currentGoodsSkuId = ref('')
const getGoodsDetail = async (id) => {
	const { data = {} } = await getGoodsDetailAPI()
	currentGoodsDetail.value = data
	currentGoodsSkuId.value = data?.sku?.[0]?._id || ''
}
const openSkuPop = (id) => {
	skuPopRef.value.open()
	getGoodsDetail(id)
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

const cartStore = useCartStore()

const onSearch = (newKeyword) => {
	routerTo(`/pages/shop/search?keyword=${newKeyword}`)
}
</script>

<template>
	<view class="container">
		<CommonNavBar title="商城" titleColor="#ffffff"></CommonNavBar>
		<CommonSearch
			placeholder="请输入商品名称"
			@search="(newKeyword) => onSearch(newKeyword)"
		></CommonSearch>
		<view class="wrapper">
			<scroll-view class="aside" scroll-y>
				<view
					class="aside_item"
					v-for="item in categoryList"
					:key="item._id"
					:class="{ active: item._id === currentCategory }"
					@click="onChangeCategory(item)"
				>
					{{ item.name }}
				</view>
			</scroll-view>
			<scroll-view
				class="main"
				scroll-y
				:scroll-top="currentCategoryOffset"
				scroll-with-animation
				@scroll="onScrollCategory"
			>
				<view
					class="group"
					v-for="group in categoryList"
					:key="group._id"
					:id="`group-${group._id}`"
				>
					<view class="group_name">{{ group.name }}</view>
					<view class="group_list">
						<GoodsCard
							v-for="item in group.goods"
							:key="item._id"
							:detail="item"
							:config="0"
							@onSelectBuy="(id) => openSkuPop(id)"
						></GoodsCard>
					</view>
				</view>
				<view class="nomore">暂无更多</view>
			</scroll-view>
			<!-- 结算栏 -->
			<view class="settle-container">
				<view class="settle-info">
					<view class="settle-info_icon" @click="openCartPop">
						<view class="iconfont icon-caigou"></view>
						<view class="settle-info_icon_tag" v-if="cartStore.cartTotalNum">
							{{ cartStore.cartTotalNum }}
						</view>
					</view>
					<view class="settle-info_text">
						<view class="settle-info_text_note">合计</view>
						<view class="settle-info_text_unit">￥</view>
						<view class="settle-info_text_price">
							{{ formatPrice(cartStore.cartTotalPrice) }}
						</view>
					</view>
				</view>
				<view class="settle-btn">去结算</view>
			</view>
			<!-- SKU弹出框 -->
			<uni-popup ref="skuPopRef" type="bottom" :safe-area="false">
				<view class="sku-popup_container">
					<GoodsSKU
						:detail="currentGoodsDetail"
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
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	display: flex;
	height: v-bind(wrapperHeight_px);

	.aside {
		flex-shrink: 0;
		width: 200rpx;
		height: 100%;
		background-color: #f9f9f9;

		&_item {
			position: relative;
			width: 100%;
			height: 90rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			color: #333333;

			&.active {
				font-weight: bold;
				color: #000000;
				background-color: #ffffff;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					display: block;
					width: 8rpx;
					height: 28rpx;
					background-color: $uni-color-primary;
				}
			}
		}
	}

	.main {
		flex: 1;
		height: 100%;

		.group {
			padding: 10rpx 24rpx;

			&:nth-child(n + 2) {
				margin-top: 40rpx;
			}

			&_name {
				margin-bottom: 10rpx;
				background-color: #ffffff;
				font-size: 30rpx;
				color: #888888;
				z-index: 999;
			}

			&_list {
				display: grid;
				gap: 40rpx;
			}
		}

		.nomore {
			padding: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			color: #888888;
		}
	}

	.settle-container {
		position: fixed;
		bottom: v-bind(tabBarHeight_px);
		width: 100%;
		height: v-bind(settleBarHeight_px);
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		background-color: #676767;

		.settle-info {
			display: flex;
			align-items: center;

			&_icon {
				position: absolute;
				bottom: 0;
				width: 112rpx;
				height: 112rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
				color: #ffffff;
				background-color: #bdaf8d;
				border-radius: 50%;

				.iconfont {
					font-size: 60rpx;
				}

				&_tag {
					position: absolute;
					top: 10%;
					left: 55%;
					min-width: 40rpx;
					height: 40rpx;
					padding: 10rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 24rpx;
					background-color: #ef5350;
					border-radius: 50%;
				}
			}

			&_text {
				margin-left: 130rpx;
				display: flex;
				align-items: baseline;
				color: #ffffff;

				&_note {
					flex-shrink: 0;
					font-size: 24rpx;
				}

				&_unit {
					flex-shrink: 0;
					font-size: 32rpx;
					font-weight: bold;
				}

				&_price {
					font-size: 42rpx;
					font-weight: bold;
				}
			}
		}

		.settle-btn {
			flex-shrink: 0;
			margin-left: auto;
			width: 210rpx;
			height: 66rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 36rpx;
			color: #ffffff;
			border-radius: 33rpx;
			background-color: #ef5350;
		}
	}

	.sku-popup_container,
	.cart-popup_container {
		min-height: 300rpx;
		padding: 40rpx 32rpx v-bind(popupBottom_px);
		background-color: #ffffff;
		border-radius: 30rpx 30rpx 0 0;
	}
}
</style>
