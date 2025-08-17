<script setup>
import NumberBox from '@/components/NumberBox.vue'
import { computed } from 'vue'
import { formatPrice } from '@/utils/format.js'
import { routerTo } from '@/utils/router'

const props = defineProps({
	detail: {
		type: Object,
		required: true,
		default: {}
	},
	sku: {
		type: Object,
		default: {}
	},
	config: {
		// 0-商城列表 1-规格选择 2-购物车列表
		type: Number,
		default: 0
	}
})
const emits = defineEmits(['onSelectBuy', 'overMinus'])

const onSelectBuy = () => {
	emits('onSelectBuy', props.detail._id)
}

// 步进器超出阈值
const overMinus = () => {
	emits('overMinus')
}

// 跳转详情页
const checkDetail = () => {
	routerTo('/pages/shop/detail')
}
</script>

<template>
	<view class="goods-card" @click="checkDetail">
		<view class="goods-card_banner">
			<uv-image
				class="image"
				:src="detail.goods_thumb"
				observeLazyLoad
				width="100%"
				height="100%"
			></uv-image>
		</view>
		<view class="goods-card_info">
			<view class="goods-card_info_top">
				<view class="goods-card_info_top_title ellipsis" v-if="detail.name">{{ detail.name }}</view>
				<view class="goods-card_info_top_title loading" v-else>
					商品加载中
					<view class="loading-dot" id="dot1"></view>
					<view class="loading-dot" id="dot2"></view>
					<view class="loading-dot" id="dot3"></view>
				</view>
				<view class="goods-card_info_top_sku-tag ellipsis" v-if="config === 2 && sku.name">
					{{ sku.name }}
				</view>
			</view>
			<view class="goods-card_info_bottom" v-if="detail._id">
				<view class="goods-card_info_bottom_left">
					<view class="goods-card_info_bottom_left_price">
						<view class="goods-card_info_bottom_left_price_new">
							<view class="goods-card_info_bottom_left_price_new_unit">￥</view>
							<view class="goods-card_info_bottom_left_price_new_text">
								{{ detail.price ? formatPrice(detail.price) : '暂无价格' }}
							</view>
						</view>
						<view class="goods-card_info_bottom_left_price_old" v-if="detail.market_price">
							￥{{ formatPrice(detail.market_price) }}
						</view>
					</view>
				</view>
				<view class="goods-card_info_bottom_right">
					<view
						class="goods-card_info_bottom_right_buy"
						v-if="[0].includes(config)"
						@click.stop="onSelectBuy"
					>
						选购
					</view>
					<NumberBox
						v-if="[2].includes(config)"
						v-model="detail.count"
						@overMinus="overMinus"
					></NumberBox>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.goods-card {
	width: 100%;
	height: 180rpx;
	display: flex;

	&_banner {
		flex-shrink: 0;
		height: 100%;
		aspect-ratio: 1 / 1;
	}

	&_info {
		flex: 1 1 0;
		width: 0;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		&_top {
			width: 100%;

			&_title {
				font-size: 32rpx;
				font-weight: bold;

				&.loading {
					display: flex;
					gap: 10rpx;
					align-items: center;
					color: #666666;

					.loading-dot {
						width: 5rpx;
						height: 5rpx;
						border-radius: 50%;
						background-color: #333333;
						animation: dotPulse 1.5s infinite ease-in-out;

						@for $i from 1 through 3 {
							&#dot#{$i} {
								animation-delay: 0.2s * ($i - 1);
							}
						}
					}

					/* 点淡入淡出效果 */
					@keyframes dotPulse {
						0%,
						100% {
							opacity: 0;
							transform: scale(0.5);
						}
						50% {
							opacity: 1;
							transform: scale(1);
						}
					}
				}
			}

			&_sku-tag {
				max-width: 100%;
				width: fit-content;
				margin-top: 8rpx;
				padding: 6rpx 12rpx;
				font-size: 24rpx;
				color: #666666;
				background-color: #f4f4f4;
				border-radius: 4rpx;
			}
		}

		&_bottom {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;

			&_left {
				&_price {
					&_new {
						display: flex;
						align-items: baseline;
						font-size: 32rpx;
						font-weight: bold;
						color: #ff0f23;

						&_unit {
							font-size: 24rpx;
						}
					}

					&_old {
						font-size: 22rpx;
						color: #bbbbbb;
						text-decoration: line-through;
					}
				}
			}

			&_right {
				&_buy {
					width: 102rpx;
					height: 40rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 26rpx;
					color: #ffffff;
					background-color: $uni-color-primary;
					border-radius: 20rpx;
				}
			}
		}
	}
}
</style>
