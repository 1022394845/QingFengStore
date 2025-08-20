<script setup>
import { onReady } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { observeElement, showMsg } from '@/utils/common.js'
import { routerTo } from '@/utils/router.js'
const newsCloudObj = uniCloud.importObject('client-news', { customUI: true })
const goodsCloudObj = uniCloud.importObject('client-goods', { customUI: true })

// 菜单列表
const menuList = ref([
	{
		label: '我的积分',
		icon: 'icon-point-fill',
		color: '#6470E8',
		bgc1: '#CBD6FC',
		bgc2: '#EDEFFD'
	},
	{
		label: '购物商城',
		icon: 'icon-cart-fill',
		color: '#EF807A',
		bgc1: '#FADAD2',
		bgc2: '#FFF6F5'
	},
	{
		label: '商家地图',
		icon: 'icon-shop-fill',
		color: '#79AA9C',
		bgc1: '#D3F2EE',
		bgc2: '#EDF7F7'
	},
	{
		label: '我要合作',
		icon: 'icon-cooperation-fill',
		color: '#45C2D3',
		bgc1: '#A4F2FD',
		bgc2: '#ECFBFD'
	}
])

const onSearch = (newKeyword) => {
	routerTo(`/pages/shop/search?keyword=${newKeyword}`)
}

// 公告列表
const noticeList = ref([])
const getNoticeList = async () => {
	try {
		const { errCode, data } = await newsCloudObj.sticky()

		if (errCode !== 0) throw new Error()
		noticeList.value = data
	} catch {
		showMsg('获取公告失败')
		noticeList.value = [{ _id: 0, title: '获取失败' }]
	}
}
onMounted(() => {
	getNoticeList()
})

// 热销产品
const hotList = ref([])
const getHotList = async () => {
	try {
		const { errCode, data } = await goodsCloudObj.hot()
		if (errCode !== 0) throw new Error()
		hotList.value = data
	} catch {
		showMsg('获取热销产品失败')
	}
}
onReady(() => {
	// 热销产品懒加载
	observeElement('.hot', () => getHotList(), true)
})
</script>

<template>
	<view class="container">
		<common-nav-bar title="清风商城" titleColor="#ffffff"></common-nav-bar>
		<common-search
			placeholder="请输入商品名称"
			@search="(newKeyword) => onSearch(newKeyword)"
		></common-search>
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
						<image class="image" src="/static/tmp_banner1.png" mode="aspectFill"></image>
					</swiper-item>
					<swiper-item class="banner_swiper_item">
						<image class="image" src="/static/tmp_banner2.jpg" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- 公告 -->
			<scroll-notice :list="noticeList"></scroll-notice>
			<!-- 菜单 -->
			<view class="menu">
				<view
					class="menu_item"
					v-for="item in menuList"
					:key="item.label"
					:style="{ color: item.color }"
				>
					<view
						class="menu_item_icon icon-container"
						:style="{ background: `linear-gradient(to bottom,${item.bgc1},${item.bgc2})` }"
					>
						<view class="iconfont" :class="item.icon"></view>
					</view>
					<view class="menu_item_label">{{ item.label }}</view>
				</view>
			</view>
			<!-- 抽奖 -->
			<view class="prize">
				<image class="image" src="/static/home_xydcj.png" mode="aspectFill"></image>
			</view>
			<!-- 产品 -->
			<view class="hot">
				<common-title name="热销产品"></common-title>
				<view class="hot_list">
					<goods-info-card v-for="item in hotList" :key="item._id" :detail="item"></goods-info-card>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	position: relative;
	padding: 20rpx 32rpx;
}

.banner {
	width: 100%;
	aspect-ratio: 686 / 352;

	&_swiper {
		width: 100%;
		height: 100%;
		border-radius: 30rpx;
		overflow: hidden;

		&_item {
			width: 100%;
			height: 100%;
		}
	}
}

.menu {
	margin-top: 40rpx;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(140rpx, 1fr));
	place-items: center;

	&_item {
		&_icon {
			width: 140rpx;
			height: 140rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;

			.iconfont {
				font-size: 60rpx;
			}
		}

		&_label {
			margin: 10rpx 0;
			font-size: 32rpx;
			text-align: center;
		}
	}
}

.prize {
	margin-top: 50rpx;
	width: 100%;
	aspect-ratio: 686 / 185;
}

.hot {
	&_list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(316rpx, 1fr));
		gap: 30rpx;
	}
}
</style>
