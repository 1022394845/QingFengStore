<script setup>
import { routerTo } from '@/utils/router.js'
import { useOrderStore } from '@/store/order.js'
import { showConfirm, showMsg } from '@/utils/common.js'
import { formatPrice } from '@/utils/format.js'
const orderCloudObj = uniCloud.importObject('client-order')

const orderStore = useOrderStore()

const props = defineProps({
	detail: {
		type: Object,
		required: true
	}
})

// 订单状态，1：待付款，2：待发货，3：运输中，4：待收货，5：已完成，6：申请退款，7：已退款，-1已关闭，-2：退款失败
const statusMap = new Map([
	[1, '买家待付款'],
	[2, '卖家待发货'],
	[3, '商品运输中'],
	[4, '买家待收货'],
	[5, '订单已完成'],
	[6, '申请退款中'],
	[7, '已成功退款'],
	[-1, '已关闭'],
	[-2, '退款失败']
])
const priceText = (status) => {
	switch (status) {
		case -2:
			return '拟退款'
		case -1:
			return '订单金额'
		case 1:
			return '待付款'
		case 6:
			return '待退款'
		case 7:
			return '已退款'
		default:
			return '实付款'
	}
}

const emits = defineEmits(['success'])
// 取消订单
const onCancel = async () => {
	const cancel = await showConfirm('温馨提示', '确定取消该订单吗？')
	if (cancel) return

	const id = props.detail._id
	const status = props.detail.status
	if (!id || typeof status !== 'number') return showMsg('获取订单信息异常')

	try {
		if (status === 1) {
			const { errCode } = await orderCloudObj.status(id, -1) // 待付款取消->关闭订单
			if (errCode !== 0) throw new Error()
			showMsg('订单取消成功')
		} else if (status === 2) {
			const { errCode } = await orderCloudObj.status(id, 6) // 待发货取消->申请退款
			if (errCode !== 0) throw new Error()
		}

		emits('success')
	} catch {
		return showMsg('订单取消失败')
	}
}

// 确认付款
const onPay = () => {
	const id = props.detail._id
	if (!id) return showMsg('获取订单信息异常')

	orderStore.createCheck(props.detail.info, id)
	routerTo('/pages/order/order')
}

// 确认收货
const onConfirm = async () => {
	const cancel = await showConfirm('温馨提示', '确认收到商品了吗？')
	if (cancel) return

	const id = props.detail._id
	if (!id) return showMsg('获取订单信息异常')

	try {
		const { errCode } = await orderCloudObj.status(id, 5)
		if (errCode !== 0) throw new Error()

		emits('success')
		showMsg('收货成功')
	} catch {
		return showMsg('收货失败')
	}
}

// 申请退款
const onRefund = async () => {
	const cancel = await showConfirm('温馨提示', '商品有问题建议先与商家沟通，确认要退款吗？')
	if (cancel) return

	const id = props.detail._id
	if (!id) return showMsg('获取订单信息异常')

	try {
		const { errCode } = await orderCloudObj.status(id, 6)
		if (errCode !== 0) throw new Error()

		emits('success')
		showMsg('申请退款成功')
	} catch {
		return showMsg('申请退款失败')
	}
}
</script>

<template>
	<view class="order-card">
		<view class="order-card_header">
			<view class="order-card_header_order-id">订单编号：{{ detail._id }}</view>
			<view class="order-card_header_order-status">{{ statusMap.get(detail.status) || '' }}</view>
		</view>
		<uv-read-more
			showHeight="200rpx"
			closeText="查看更多"
			:toggle="true"
			fontSize="24rpx"
			color="#bdaf8d"
			textIndent="0"
			:shadowStyle="{
				background: 'none',
				paddingTop: '200rpx',
				marginTop: '-200rpx'
			}"
		>
			<view class="order-card_goods-list">
				<goods-card
					v-for="item in detail.info"
					:key="`${item.goods_id}-${item.sku._id}`"
					:detail="item"
					:sku="item.sku"
					:config="3"
				></goods-card>
			</view>
		</uv-read-more>
		<view class="devider"></view>
		<view class="order-card_footer">
			<view class="order-card_footer_price">
				{{ `${priceText(detail.status)}：￥${formatPrice(detail.total_fee)}` }}
			</view>
			<view class="order-card_footer_btn-group">
				<view class="btn" v-if="[1, 2].includes(detail.status)" @click="onCancel">取消订单</view>
				<view class="btn highlight" v-if="[1].includes(detail.status)" @click="onPay">
					确认付款
				</view>
				<view class="btn" v-if="[3].includes(detail.status)">查看物流</view>
				<view class="btn highlight" v-if="[3, 4].includes(detail.status)" @click="onConfirm">
					确认收货
				</view>
				<view class="btn" v-if="[4, 5].includes(detail.status)" @click="onRefund">申请退款</view>
				<view class="btn highlight" v-if="[2, 5].includes(detail.status)">联系商家</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.order-card {
	width: 100%;
	padding: 20rpx;
	background-color: #ffffff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

	&_header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		color: #000000;

		&_order-id {
			color: #999999;
		}
	}

	&_goods-list {
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		gap: 40rpx;
	}

	&_footer {
		display: flex;
		align-items: center;

		&_price {
			font-size: 28rpx;
		}

		&_btn-group {
			margin-left: auto;
			display: flex;
			gap: 20rpx;
			align-items: center;

			.btn {
				width: fit-content;
				height: 56rpx;
				padding: 0 26rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				color: #666666;
				background-color: #ffffff;
				border-radius: 28rpx;
				border: #cccccc solid 2rpx;

				&.highlight {
					color: #ffffff;
					background-color: #ef5350;
					border: none;
				}
			}
		}
	}
}

.devider {
	width: 100%;
	height: 4rpx;
	margin: 30rpx 0 20rpx;
	background-color: #efefef;
}
</style>
