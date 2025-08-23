<script setup>
import { computed } from 'vue'
import { formatPrice } from '@/utils/format.js'
import { routerTo } from '@/utils/router.js'
import { showMsg } from '@/utils/common.js'

const props = defineProps({
	detail: {
		type: Object,
		default: {}
	},
	sku: {
		type: Object,
		default: {}
	},
	config: {
		// 0-商城列表 1-规格选择 2-购物车列表 3-订单列表
		type: Number,
		default: 0
	}
})
const emits = defineEmits(['onSelectSku', 'overMinus', 'updateQuantity'])

const goods_id = computed(() => {
	if ([2, 3].includes(props.config)) return props.detail.goods_id
	else return props.detail._id
})
const info = computed(() => ({ ...props.detail, ...props.sku }))

const onSelectSku = () => {
	emits('onSelectSku')
}

// 步进器超出阈值
const overMinus = () => {
	emits('overMinus')
}

// 更新商品购买数量
const updateQuantity = (quantity) => {
	emits('updateQuantity', quantity)
}

// 跳转详情页
const checkDetail = () => {
	if (!goods_id.value) return showMsg('获取商品信息失败')

	routerTo(`/pages/shop/detail?id=${goods_id.value}`)
}
</script>

<template>
	<view class="goods-card" @click="checkDetail">
		<view class="goods-card_banner">
			<uv-image
				class="image"
				:src="info.sku_thumb || info.goods_thumb"
				observeLazyLoad
				width="100%"
				height="100%"
			></uv-image>
		</view>
		<view class="goods-card_info">
			<view class="goods-card_info_top">
				<view class="goods-card_info_top_title ellipsis" v-if="info.name">{{ info.name }}</view>
				<dot-loading v-else>商品加载中</dot-loading>
				<view
					class="goods-card_info_top_sku-tag ellipsis"
					v-if="[2, 3].includes(config) && info.sku_name"
				>
					{{ info.sku_name }}
				</view>
			</view>
			<view class="goods-card_info_bottom" v-if="goods_id">
				<view class="goods-card_info_bottom_left">
					<view class="goods-card_info_bottom_left_price">
						<view class="goods-card_info_bottom_left_price_new">
							<view class="goods-card_info_bottom_left_price_new_unit">￥</view>
							<view class="goods-card_info_bottom_left_price_new_text">
								{{ info.price ? formatPrice(info.price) : '暂无价格' }}
							</view>
						</view>
						<view class="goods-card_info_bottom_left_price_old" v-if="info.market_price">
							￥{{ formatPrice(info.market_price) }}
						</view>
					</view>
				</view>
				<view class="goods-card_info_bottom_right">
					<!-- 选购按钮 -->
					<template v-if="[0].includes(config)">
						<view class="goods-card_info_bottom_right_buy" @click.stop="onSelectSku">选购</view>
					</template>

					<!-- 购买数量步进器 -->
					<template v-if="[2].includes(config)">
						<number-box
							v-model="detail.quantity"
							@overMinus="overMinus"
							@update="(value) => updateQuantity(value)"
						></number-box>
					</template>

					<!-- 购买数量 -->
					<template v-if="[3].includes(config)">
						<view class="goods-card_info_bottom_right_quantity" v-if="detail.quantity">
							×{{ detail.quantity }}
						</view>
					</template>
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

				&_quantity {
					font-size: 26rpx;
					color: #666666;
				}
			}
		}
	}
}
</style>
