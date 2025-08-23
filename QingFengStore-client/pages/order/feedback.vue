<script setup>
import { ref } from 'vue'
import { onLoad, onBackPress } from '@dcloudio/uni-app'
import { formatPrice } from '@/utils/format.js'
import { routerBack } from '@/utils/router.js'

const status = ref(true)
const formData = ref({
	id: null,
	total: 0
})
onLoad((e) => {
	if (e.status) status.value = e.status === 'true' ? true : false
	if (e.id) formData.value.id = e.id
	if (e.total) formData.value.total = e.total
})
</script>

<template>
	<view class="container">
		<view class="icon">
			<view class="iconfont icon-success success" v-if="status"></view>
			<view class="iconfont icon-error error" v-else></view>
		</view>
		<view class="text" :class="{ success: status }">支付{{ status ? '成功' : '失败' }}</view>
		<view class="form">
			<view class="form-item">
				<view class="form-item_label">交易单号</view>
				<view class="form-item_content">
					{{ formData.id }}
				</view>
			</view>
			<view class="form-item">
				<view class="form-item_label">订单金额</view>
				<view class="form-item_content">￥{{ formatPrice(formData.total) }}</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.container {
	overflow-y: hidden;
}

.icon {
	width: fit-content;
	margin: 100rpx auto 50rpx;

	.iconfont {
		font-size: 180rpx;

		&.success {
			color: $uni-color-success;
		}
		&.error {
			color: $uni-color-error;
		}
	}
}

.text {
	text-align: center;
	font-size: 70rpx;
	font-weight: bold;
	color: $uni-color-error;

	&.success {
		color: $uni-color-success;
	}
}

.form {
	margin-top: 40rpx;
	padding: 20rpx 60rpx;

	&-item {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		font-size: 32rpx;

		&_label {
			width: 30%;
			color: #666666;
		}
	}
}
</style>
