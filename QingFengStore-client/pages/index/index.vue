<script setup>
import { ref } from 'vue'
import CommonNavBar from '@/components/CommonNavBar.vue'
import CommonSearch from '@/components/CommonSearch.vue'
import ScrollNotice from '@/components/ScrollNotice.vue'

// 菜单列表
const menuList = ref([
	{
		label: '我的积分',
		icon: 'icon-jifen',
		color: '#6470E8',
		bgc1: '#CBD6FC',
		bgc2: '#EDEFFD'
	},
	{
		label: '购物商城',
		icon: 'icon-caigou',
		color: '#EF807A',
		bgc1: '#FADAD2',
		bgc2: '#FFF6F5'
	},
	{
		label: '商家地图',
		icon: 'icon-dianpu1',
		color: '#79AA9C',
		bgc1: '#D3F2EE',
		bgc2: '#EDF7F7'
	},
	{
		label: '我要合作',
		icon: 'icon-hezuoguanxi',
		color: '#45C2D3',
		bgc1: '#A4F2FD',
		bgc2: '#ECFBFD'
	}
])
</script>

<template>
	<view class="container">
		<CommonNavBar title="首页" titleColor="#ffffff"></CommonNavBar>
		<CommonSearch placeholder="请输入商品名称"></CommonSearch>
		<view class="wrapper">
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
			<ScrollNotice></ScrollNotice>
			<view class="menu">
				<view
					class="menu_item"
					v-for="item in menuList"
					:key="item.label"
					:style="{ color: item.color }"
				>
					<view
						class="menu_item_icon"
						:style="{ background: `linear-gradient(to bottom,${item.bgc1},${item.bgc2})` }"
					>
						<text class="iconfont" :class="item.icon"></text>
					</view>
					<view class="menu_item_label">{{ item.label }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	position: relative;

	&::before {
		position: absolute;
		left: 50%;
		top: -320rpx;
		transform: translateX(-50%);
		content: '';
		display: block;
		width: 984rpx;
		height: 522rpx;
		border-radius: 50%;
		background-color: $uni-color-primary;
		z-index: -9999;
	}
}

.banner {
	width: 100%;

	&_swiper {
		width: 100%;
		height: 352rpx;
		border-radius: 30rpx;
		overflow: hidden;

		&_item {
			width: 100%;
			height: 100%;

			&_image {
				width: 100%;
				height: 100%;
			}
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
				font-size: 70rpx;
			}
		}

		&_label {
			margin: 10rpx 0;
			font-size: 32rpx;
			text-align: center;
		}
	}
}
</style>
