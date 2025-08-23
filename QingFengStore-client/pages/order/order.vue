<script setup>
import {
	safeareaHeight_px,
	settleBarHeight,
	settleBarHeight_px,
	containerHeight
} from '@/utils/system.js'
import { formatPrice } from '@/utils/format.js'
import { routerTo } from '@/utils/router.js'
import { ref } from 'vue'
import { useAddressStore } from '@/store/address.js'
import { useOrderStore } from '@/store/order.js'
import { showMsg } from '@/utils/common.js'

const wrapperHeight_px = `${containerHeight - settleBarHeight}px`
const wrapperBottom_px = `${settleBarHeight + uni.rpx2px(40)}px`

const addressStore = useAddressStore()
const orderStore = useOrderStore()
addressStore.init()

let cache_id = null // 避免在支付阶段发生错误而重复生成订单
const onConfirm = async () => {
	if (!cache_id) {
		// 创建订单
		const { errCode, id } = await orderStore.create()
		if (errCode !== 0) return showMsg('生成订单失败')
		cache_id = id
	}

	// 拉起支付
	try {
		const { errCode, errMsg } = await orderStore.pay(cache_id)
		routerTo(`/pages/order/feedback?id=${cache_id}&status=${errCode === 0 ? true : false}`)
	} catch {
		showMsg('未知错误', 'error')
	}
}
</script>

<template>
	<view class="container">
		<view class="wrapper">
			<!-- 地址信息 -->
			<view class="address-container card">
				<template v-if="addressStore.selectedAddress?._id">
					<view class="base-address">{{ addressStore.selectedAddress.region }}</view>
					<view class="detail-address">{{ addressStore.selectedAddress.detail }}</view>
					<view class="contact">
						{{ `${addressStore.selectedAddress.name} ${addressStore.selectedAddress.phone}` }}
					</view>
					<view class="delivery">
						<view class="delivery-method">配送方式</view>
						<view class="delivery-cost">
							快递运费 ￥{{
								orderStore.formData.delivery_fee
									? formatPrice(orderStore.formData.delivery_fee)
									: '暂不支持配送'
							}}
						</view>
					</view>
					<view
						class="edit-address iconfont icon-edit"
						@click="routerTo('/pages/order/address')"
					></view>
				</template>
				<dot-loading v-else>加载中</dot-loading>
			</view>

			<!-- 商品列表 -->
			<view class="goods-list card">
				<goods-card
					v-for="item in orderStore.formData.info"
					:key="`${item.goods_id}-${item.sku._id}`"
					:detail="item"
					:sku="item.sku"
					:config="3"
				></goods-card>
			</view>

			<!-- 支付方式 -->
			<view class="pay-method card">
				<view class="pay-method_header">
					<view class="pay-method_header_title">支付方式</view>
				</view>
				<view class="pay-method_list">
					<uv-radio-group
						v-model="orderStore.formData.pay_type"
						placement="column"
						size="32rpx"
						iconSize="24rpx"
						labelSize="28rpx"
						activeColor="#bdaf8d"
						:customStyle="{ gap: '30rpx' }"
					>
						<uv-radio
							v-for="item in orderStore.payMethodList"
							:key="item.type"
							:label="item.label"
							:name="item.type"
							:disabled="item.disabled"
						>
							<view class="pay-method_list_item">
								<view class="iconfont" :class="item.icon" :style="{ color: item.iconColor }"></view>
								<view class="text">
									{{ item.label }}
								</view>
								<view class="note ellipsis" v-if="item.note">
									{{ item.note }}
								</view>
							</view>
						</uv-radio>
					</uv-radio-group>
				</view>
			</view>

			<!-- 金额统计 -->
			<view class="order card">
				<view class="order_header">
					<view class="order_header_title">商品金额</view>
					<view class="order_header_goods-total">共 4 件商品</view>
					<view class="order_header_goods-price">￥{{ formatPrice(orderStore.goodsPrice) }}</view>
				</view>
				<!-- 折扣 -->
				<view class="order_discount">
					<view class="order_discount_item">
						<view class="order_discount_item_label">优惠券</view>
						<view class="order_discount_item_price">
							-￥{{ formatPrice(orderStore.formData.discount) }}
						</view>
						<view class="order_discount_item_more">
							<view class="iconfont icon-more"></view>
						</view>
					</view>
					<view class="order_discount_item">
						<view class="order_discount_item_label">配送费</view>
						<view class="order_discount_item_price">
							￥{{ formatPrice(orderStore.formData.delivery_fee) }}
						</view>
						<view class="order_discount_item_more"></view>
					</view>
				</view>
				<!-- 分隔栏 -->
				<view class="devider"></view>
				<!-- 最终价格 -->
				<view class="order_final-price">合计：￥{{ formatPrice(orderStore.totalFee) }}</view>
			</view>
		</view>

		<!-- 结算栏 -->
		<view class="settle-container">
			<view class="settle-info">
				<view class="settle-info_text">
					<view class="settle-info_text_note">合计</view>
					<view class="settle-info_text_unit">￥</view>
					<view class="settle-info_text_price ellipsis">
						{{ formatPrice(orderStore.totalFee) }}
					</view>
				</view>
			</view>
			<view class="settle-btn" @click="onConfirm">提交订单</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	width: 100%;
	padding: 40rpx;
	padding-bottom: v-bind(wrapperBottom_px);
	background-color: #f9f9f9;

	.card {
		width: 100%;
		height: fit-content;
		background-color: #ffffff;
		border-radius: 10rpx;
	}

	.address-container {
		position: relative;
		padding: 40rpx;

		.base-address {
			font-size: 28rpx;
			color: #666666;
		}

		.detail-address {
			font-size: 42rpx;
			font-weight: bold;
			color: #000000;
		}

		.contact {
			margin-top: 30rpx;
			font-size: 36rpx;
			font-weight: bold;
			color: #000000;
		}

		.delivery {
			margin-top: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			color: #666666;
		}

		.edit-address {
			position: absolute;
			top: 40rpx;
			right: 40rpx;
			width: 80rpx;
			height: 80rpx;
			text-align: right;
			font-size: 42rpx;
			color: #aaaaaa;
		}
	}

	.goods-list {
		margin-top: 20rpx;
		padding: 24rpx;
		display: flex;
		flex-direction: column;
		gap: 40rpx;
	}

	.pay-method {
		margin-top: 28rpx;
		padding: 40rpx 28rpx;

		&_header {
			margin-bottom: 60rpx;

			&_title {
				font-size: 36rpx;
			}
		}

		&_list_item {
			margin-left: 20rpx;
			display: flex;
			gap: 20rpx;
			align-items: center;
			font-size: 32rpx;
			color: #666666;

			.iconfont {
				font-size: 32rpx;
			}

			.note {
				max-width: 250rpx;
				margin-left: auto;
				font-size: 28rpx;
				color: #aaaaaa;
			}
		}
	}

	.order {
		margin-top: 40rpx;
		padding: 40rpx 28rpx;

		&_header {
			display: flex;
			align-items: baseline;
			margin-bottom: 60rpx;

			&_title {
				flex-shrink: 0;
				font-size: 36rpx;
			}

			&_goods-total {
				flex-shrink: 0;
				margin-left: 10rpx;
				font-size: 26rpx;
				color: #999999;
			}

			&_goods-price {
				margin-left: auto;
				font-size: 32rpx;
				color: #000000;
			}
		}

		&_discount {
			display: flex;
			flex-direction: column;
			gap: 30rpx;

			&_item {
				display: flex;
				align-items: baseline;
				font-size: 30rpx;

				&_label {
					color: #666666;
				}

				&_price {
					margin-left: auto;
					color: #ef5350;
				}

				&_more {
					margin-left: 5rpx;
					width: 10rpx;
					color: #aaaaaa;

					.iconfont {
						font-size: 30rpx;
					}
				}
			}
		}

		.devider {
			width: 100%;
			height: 4rpx;
			margin: 20rpx 0;
			background-color: #efefef;
		}

		&_final-price {
			text-align: right;
			font-size: 34rpx;
			color: #000000;
		}
	}
}

.settle-container {
	position: fixed;
	bottom: v-bind(safeareaHeight_px);
	width: 100%;
	height: v-bind(settleBarHeight_px);
	padding: 0 36rpx 0 42rpx;
	display: flex;
	align-items: center;
	background-color: #676767;

	.settle-info {
		display: flex;
		align-items: center;

		&_text {
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
</style>
