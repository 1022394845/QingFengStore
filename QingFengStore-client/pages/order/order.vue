<script setup>
import {
	safeareaHeight_px,
	settleBarHeight,
	settleBarHeight_px,
	containerHeight
} from '@/utils/system.js'
import { formatPrice } from '@/utils/format.js'
import { ref } from 'vue'

const wrapperHeight_px = `${containerHeight - settleBarHeight}px`
const wrapperBottom_px = `${settleBarHeight + uni.rpx2px(40)}px`

const goodsList = ref([
	{
		name: '商品规格测试用',
		goods_thumb: 'https://env-00jxtt1yph9m.normal.cloudstatic.cn/admin/20250814/1755164631068.webp',
		goods_id: '689da9ea16634a0a158d98dd',
		sku: {
			_id: '689dafd8ac6b4af5dc11070d',
			price: 199,
			stock: 1,
			sku_name: '规格4',
			sku_thumb: 'https://env-00jxtt1yph9m.normal.cloudstatic.cn/admin/20250814/1755164631068.webp',
			market_price: 299
		},
		quantity: 3,
		is_selected: true,
		create_date: 1755649171968,
		update_date: 1755649605294
	},
	{
		name: '商品规格测试用',
		goods_thumb: null,
		goods_id: '689da9ea16634a0a158d98dd',
		sku: {
			_id: '689dad6514fbd59188b5d522',
			price: 1,
			stock: 1,
			sku_name: '规格2',
			sku_thumb: null,
			market_price: 2
		},
		quantity: 1,
		is_selected: true,
		create_date: 1755649167180,
		update_date: 1755649167180
	}
])

const payMethod = ref(0)
const payMethodList = [
	{
		id: 0,
		label: '余额支付',
		icon: 'icon-point-fill',
		iconColor: '#bdaf8d',
		disabled: false,
		note: '当前余额 99999'
	},
	{
		id: 1,
		label: '微信支付',
		icon: 'icon-wechatpay',
		iconColor: '#00C800',
		disabled: true,
		note: '暂未开放'
	},
	{
		id: 2,
		label: '支付宝支付',
		icon: 'icon-zhifubaopay',
		iconColor: '#009FE8',
		disabled: true,
		note: '暂未开放'
	}
]
</script>

<template>
	<view class="container">
		<view class="wrapper">
			<!-- 地址信息 -->
			<view class="address-container card">
				<view class="base-address">山东省 济南市 历下区</view>
				<view class="detail-address">中铁会展中心2号楼5层530室</view>
				<view class="contact">张三 13888888888</view>
				<view class="delivery">
					<view class="delivery-method">配送方式</view>
					<view class="delivery-cost">快递运费 ￥28.88</view>
				</view>
				<view class="edit-address iconfont icon-edit"></view>
			</view>

			<!-- 商品列表 -->
			<view class="goods-list card">
				<goods-card
					v-for="item in goodsList"
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
						v-model="payMethod"
						placement="column"
						size="32rpx"
						iconSize="24rpx"
						labelSize="28rpx"
						activeColor="#bdaf8d"
						:customStyle="{ gap: '30rpx' }"
					>
						<uv-radio
							v-for="item in payMethodList"
							:key="item.id"
							:label="item.label"
							:name="item.id"
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
					<view class="order_header_goods-price">￥5.98</view>
				</view>
				<!-- 折扣 -->
				<view class="order_discount">
					<view class="order_discount_item">
						<view class="order_discount_item_label">优惠券</view>
						<view class="order_discount_item_price">-￥{{ formatPrice(0) }}</view>
						<view class="order_discount_item_more">
							<view class="iconfont icon-more"></view>
						</view>
					</view>
					<view class="order_discount_item">
						<view class="order_discount_item_label">配送费</view>
						<view class="order_discount_item_price">￥{{ formatPrice(2888) }}</view>
						<view class="order_discount_item_more"></view>
					</view>
				</view>
				<!-- 分隔栏 -->
				<view class="devider"></view>
				<!-- 最终价格 -->
				<view class="order_final-price">合计：￥{{ formatPrice(3486) }}</view>
			</view>
		</view>

		<!-- 结算栏 -->
		<view class="settle-container">
			<view class="settle-info">
				<view class="settle-info_text">
					<view class="settle-info_text_note">合计</view>
					<view class="settle-info_text_unit">￥</view>
					<view class="settle-info_text_price ellipsis">
						{{ formatPrice(3486) }}
					</view>
				</view>
			</view>
			<view class="settle-btn">提交订单</view>
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
