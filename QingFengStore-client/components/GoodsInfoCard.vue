<script setup>
import DotLoading from '@/components/DotLoading.vue'
import { routerTo } from '@/utils/router.js'
import { formatPrice } from '@/utils/format.js'

const props = defineProps({
	detail: {
		type: Object,
		default: {}
	}
})

// 跳转详情页
const checkDetail = () => {
	if (!props.detail._id) return showMsg('获取商品信息失败')
	routerTo(`/pages/shop/detail?id=${props.detail._id}`)
}
</script>

<template>
	<view class="goods-info-card" @click="checkDetail">
		<view class="goods-info-card_image">
			<uv-image
				class="image"
				:src="detail.goods_thumb"
				observeLazyLoad
				width="100%"
				height="100%"
			></uv-image>
		</view>
		<view class="goods-info-card_info">
			<view class="goods-info-card_info_title ellipsis" v-if="detail.name">
				{{ detail.name }}
			</view>
			<DotLoading v-else>商品加载中</DotLoading>
			<view class="goods-info-card_info_price" v-if="detail._id">
				<view class="goods-info-card_info_price_new">
					<view class="goods-info-card_info_price_new_unit">￥</view>
					<view class="goods-info-card_info_price_new_text">
						{{ detail.price ? formatPrice(detail.price) : '暂无价格' }}
					</view>
				</view>
				<view class="goods-info-card_info_price_old" v-if="detail.market_price">
					￥{{ formatPrice(detail.market_price) }}
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.goods-info-card {
	width: 100%;
	height: fit-content;

	&_image {
		width: 100%;
		aspect-ratio: 1 / 1;
		border-radius: 20rpx;
		overflow: hidden;
	}

	&_info {
		margin-top: 11rpx;

		&_title {
			font-size: 30rpx;
			font-weight: bolder;
			color: #333333;
		}

		&_price {
			width: 100%;
			display: flex;
			align-items: baseline;
			flex-wrap: wrap;

			&_new {
				margin-right: 10rpx;
				display: flex;
				align-items: baseline;
				word-break: break-all;
				font-size: 32rpx;
				font-weight: bold;
				color: #ff0f23;

				&_unit {
					font-size: 24rpx;
				}
			}

			&_old {
				font-size: 20rpx;
				font-weight: 500;
				color: #bbbbbb;
				text-decoration: line-through;
			}
		}
	}
}
</style>
