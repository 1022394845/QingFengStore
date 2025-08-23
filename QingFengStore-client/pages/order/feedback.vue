<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const status = ref(true)
onLoad((e) => {
	if (e.status) status.value = e.status === 'true' ? true : false
})
</script>

<template>
	<view class="container">
		<view class="icon">
			<view class="iconfont icon-success success" v-if="status"></view>
			<view class="iconfont icon-error error" v-else></view>
		</view>
		<view class="text" :class="{ success: status }">支付{{ status ? '成功' : '失败' }}</view>
	</view>
</template>

<style scoped lang="scss">
.container {
	overflow-y: hidden;
}

.icon {
	width: fit-content;
	margin: 200rpx auto 50rpx;

	.iconfont {
		font-size: 200rpx;

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
	font-size: 100rpx;
	font-weight: bold;
	color: $uni-color-error;

	&.success {
		color: $uni-color-success;
	}
}
</style>
