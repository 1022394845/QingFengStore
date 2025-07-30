<script setup>
import { ref } from 'vue'

defineOptions({
	options: {
		styleIsolation: 'shared'
	}
})

const count = defineModel()

const emits = defineEmits(['overMinus'])
const onOverlimit = (type) => {
	if (type === 'plus') {
		uni.showToast({
			title: '超过单次购买限制',
			icon: 'none'
		})
	} else {
		emits('overMinus')
	}
}
</script>

<template>
	<uv-number-box v-model="count" integer :min="1" :max="999" @overlimit="onOverlimit" @click.stop>
		<template v-slot:minus>
			<view class="minus btn">
				<uv-icon name="minus" color="#bdaf8d" size="16rpx"></uv-icon>
			</view>
		</template>
		<template v-slot:plus>
			<view class="plus btn">
				<uv-icon name="plus" color="#ffffff" size="16rpx"></uv-icon>
			</view>
		</template>
	</uv-number-box>
</template>

<style lang="scss">
.btn {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.minus {
	border: $uni-color-primary solid 2rpx;
}
.plus {
	background-color: $uni-color-primary;
}

:deep(.uv-number-box__input) {
	width: 70rpx !important;
	height: 60rpx !important;
	font-size: 28rpx !important;
	background-color: transparent !important;
}
</style>
