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
import { nextTick, onMounted, ref } from 'vue'
import { useCartStore } from '@/store/cart.js'
import { needLogin, routerTo } from '@/utils/router.js'
import { isLogin, observeElement, showMsg } from '@/utils/common.js'
const goodsCloudObj = uniCloud.importObject('client-goods', { customUI: true })

const headerHeight_px = `${navBarHeight + searchHeight}px`
const wrapperHeight_px = `${containerHeight - searchHeight - tabBarHeight - settleBarHeight}px`
const popupBottom_px = `${tabBarHeight + uni.rpx2px(40)}px`

// 分类
const dataList = ref([])
const getCategoryList = async () => {
	try {
		uni.showLoading({
			title: '加载中...'
		})
		const { errCode, data } = await goodsCloudObj.categories()
		if (errCode !== 0) throw new Error()

		dataList.value = data
	} catch {
		showMsg('获取数据失败，请刷新重试')
	} finally {
		uni.hideLoading()
	}
}
onMounted(async () => {
	await getCategoryList()
	nextTick(() => {
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

// SKU弹出框
const skuPopRef = ref(null)
const openSkuPop = (item) => {
	if (!skuPopRef.value) return showMsg('未知错误，请刷新后重试')
	skuPopRef.value.open(item)
}

// 购物车弹出框
const cartPopRef = ref(null)
const openCartPop = () => {
	if (!cartPopRef.value) return showMsg('未知错误，请刷新后重试')

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
		<common-nav-bar title="商城" titleColor="#ffffff"></common-nav-bar>
		<common-search
			placeholder="请输入商品名称"
			@search="(newKeyword) => onSearch(newKeyword)"
		></common-search>
		<view class="wrapper">
			<uv-vtabs
				:list="dataList"
				:hdHeight="headerHeight_px"
				:height="wrapperHeight_px"
				barWidth="200rpx"
				:barItemStyle="{ fontSize: '32rpx', textAlign: 'center' }"
				:barItemActiveStyle="{
					fontSize: '32rpx',
					textAlign: 'center',
					color: '#bdaf8d',
					fontWeight: 'bold'
				}"
				:barItemActiveLineStyle="{
					background: '#bdaf8d',
					height: '40%',
					top: '50%',
					transform: 'translateY(-50%)'
				}"
				:contentStyle="{
					padding: '20rpx 24rpx',
					boxSizing: 'border-box'
				}"
			>
				<template v-for="group in dataList" :key="group._id">
					<uv-vtabs-item :index="group._id">
						<view class="group" :id="`group-${group._id}`">
							<view class="group-title">{{ group.name }}</view>
							<view class="group-list">
								<template v-if="group.goods">
									<goods-card
										v-for="item in group.goods"
										:key="item._id"
										:detail="item"
										:config="0"
										@onSelectSku="openSkuPop(item)"
									></goods-card>
								</template>
								<!-- 加载占位 -->
								<template v-else>
									<goods-card v-for="item in group.total" :key="item" :config="0"></goods-card>
								</template>
							</view>
						</view>
					</uv-vtabs-item>
				</template>
			</uv-vtabs>

			<!-- 结算栏 -->
			<view class="settle-container">
				<view class="settle-info">
					<view class="settle-info_icon icon-container" @click="openCartPop">
						<view class="iconfont icon-caigou"></view>
						<view class="settle-info_icon_tag" v-if="cartStore.selectedTotal">
							{{ cartStore.selectedTotal }}
						</view>
					</view>
					<view class="settle-info_text">
						<view class="settle-info_text_note">合计</view>
						<view class="settle-info_text_unit">￥</view>
						<view class="settle-info_text_price ellipsis">
							{{ formatPrice(cartStore.selectedPrice) }}
						</view>
					</view>
				</view>
				<view class="settle-btn" @click="routerTo('/pages/shop/cart')">去结算</view>
			</view>
			<!-- SKU弹出框 -->
			<goods-sku ref="skuPopRef"></goods-sku>
			<!-- 购物车弹出框 -->
			<uni-popup ref="cartPopRef" type="bottom" :safe-area="false">
				<view class="cart-popup_container">
					<goods-cart></goods-cart>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	height: v-bind(wrapperHeight_px);

	.group {
		height: fit-content;
		padding-bottom: 40rpx;

		&:last-child {
			padding-bottom: 0;
		}

		&-title {
			margin-bottom: 10rpx;
			background-color: #ffffff;
			font-size: 30rpx;
			color: #888888;
		}

		&-list {
			display: flex;
			flex-direction: column;
			gap: 40rpx;
			padding-bottom: 40rpx;
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
					max-width: 250rpx;
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

	.cart-popup_container {
		min-height: 300rpx;
		padding: 40rpx 32rpx v-bind(popupBottom_px);
		background-color: #ffffff;
		border-radius: 30rpx 30rpx 0 0;
	}
}
</style>
