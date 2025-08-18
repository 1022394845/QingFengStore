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
import { onReady } from '@dcloudio/uni-app'
import { getCurrentInstance, nextTick, onMounted, ref } from 'vue'
import CommonNavBar from '@/components/CommonNavBar.vue'
import CommonSearch from '@/components/CommonSearch.vue'
import GoodsCard from '@/components/GoodsCard.vue'
import GoodsSKU from '@/components/GoodsSKU.vue'
import GoodsCart from '@/components/GoodsCart.vue'
import { useCartStore } from '@/store/cart'
import { needLogin, routerTo } from '@/utils/router'
import { isLogin, observeElement, showMsg } from '@/utils/common'
const goodsCloudObj = uniCloud.importObject('client-goods', { customUI: true })

const wrapperHeight_px = `${containerHeight - searchHeight - tabBarHeight - settleBarHeight}px`
const popupBottom_px = `${tabBarHeight + uni.rpx2px(40)}px`

// 分类
const dataList = ref([])
const getCategoryList = async () => {
	try {
		const { errCode, data } = await goodsCloudObj.categories()
		if (errCode !== 0) throw new Error()
		dataList.value = data
	} catch {
		return showMsg('获取数据失败，请刷新重试')
	}
}
onMounted(async () => {
	await getCategoryList()
	currentCategory.value = dataList.value[0]._id || ''
	nextTick(() => {
		getCategoryOffset()
		registerObserver()
	})
})

// 对所有分类标题监听是否可见 懒加载对应商品列表
const getCategoryGoods = async (category_id) => {
	try {
		const { errCode, data } = await goodsCloudObj.goods({ category_id })
		if (errCode !== 0) throw new Error()
		const target = dataList.value.find((item) => item._id === category_id)
		if (target) target.goods = data
		else throw new Error()
	} catch {
		return showMsg('获取商品信息失败，请刷新重试')
	}
}
const registerObserver = () => {
	if (!dataList.value) return

	dataList.value.forEach((item) => {
		const selector = `#group-${item._id}`
		observeElement(selector, () => getCategoryGoods(item._id), true)
	})
}

const currentCategory = ref('')
const currentCategoryOffset = ref(0)
const instance = getCurrentInstance()
const getCategoryOffset = () => {
	dataList.value.forEach((item, index) => {
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
	const result = dataList.value.filter((item) => item.top <= scrollTop + 1)
	if (result.length) currentCategory.value = result[result.length - 1]._id
})

// SKU弹出框
const skuPopRef = ref(null)
const currentGoodsDetail = ref({})
const currentSkuId = ref(null)
const openSkuPop = (item) => {
	if (!skuPopRef.value) return

	// 查看新商品信息，更新缓存
	if (!Object.keys(currentGoodsDetail.value).length || currentGoodsDetail.value._id !== item._id) {
		currentGoodsDetail.value = { ...item }
		currentSkuId.value = item.skus?.[0]?._id || null
	}

	skuPopRef.value.open()
}
const closeSkuPop = () => {
	skuPopRef.value.close()
}

// 购物车弹出框
const cartPopRef = ref(null)
const openCartPop = () => {
	if (isLogin()) cartPopRef.value.open()
	else needLogin()
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
					v-for="item in dataList"
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
				<view class="group" v-for="group in dataList" :key="group._id" :id="`group-${group._id}`">
					<view class="group_name">{{ group.name }}</view>
					<view class="group_list">
						<template v-if="group.goods">
							<GoodsCard
								v-for="item in group.goods"
								:key="item._id"
								:detail="item"
								:config="0"
								@onSelectBuy="openSkuPop(item)"
							></GoodsCard>
						</template>
						<template v-else>
							<GoodsCard v-for="item in group.total" :key="item" :config="0"></GoodsCard>
						</template>
					</view>
				</view>
				<view class="nomore">暂无更多</view>
			</scroll-view>
			<!-- 结算栏 -->
			<view class="settle-container">
				<view class="settle-info">
					<view class="settle-info_icon icon-container" @click="openCartPop">
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
						v-model="currentSkuId"
						:detail="currentGoodsDetail"
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
