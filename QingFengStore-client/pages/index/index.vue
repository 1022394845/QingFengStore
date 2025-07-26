<script setup>
import CommonNavBar from '@/components/CommonNavBar.vue'
import CommonSearch from '@/components/CommonSearch.vue'
import ScrollNotice from '@/components/ScrollNotice.vue'
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
			<ScrollNotice style="margin-top: 20rpx"></ScrollNotice>
			<view class="" v-for="item in 20">
				{{ item }}
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
</style>
