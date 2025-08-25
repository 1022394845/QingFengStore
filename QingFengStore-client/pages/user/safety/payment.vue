<script setup>
import { ref } from 'vue'
import { routerBack } from '@/utils/router.js'

const currentStep = ref(0) // 0-验证旧密码 1-设置新密码 2-完成
const formData = ref({
	old_code: '',
	new_code: '',
	repeate_code: '',
	show_repeate: false
})
const onNextStep = () => {
	if (currentStep.value === 0) {
		// 验证旧密码

		currentStep.value++
	} else {
		// 设置新密码

		currentStep.value++
	}
}
</script>

<template>
	<view class="container">
		<view class="wrapper">
			<!-- 步骤条 -->
			<uv-steps :current="currentStep" activeColor="#bdaf8d">
				<uv-steps-item title="验证旧密码"></uv-steps-item>
				<uv-steps-item title="设置新密码"></uv-steps-item>
				<uv-steps-item title="完成"></uv-steps-item>
			</uv-steps>
			<!-- 卡片容器 -->
			<view class="card">
				<template v-if="currentStep === 0">
					<view class="title">请输入旧密码</view>
					<view class="input">
						<view class="input-box">
							<uv-code-input
								v-model="formData.old_code"
								dot
								focus
								size="70rpx"
								space="20rpx"
								borderColor="#bdaf8d"
								@finish="onNextStep"
							></uv-code-input>
						</view>
					</view>
					<uv-button
						text="下一步"
						color="#bdaf8d"
						style="margin-left: auto"
						:customStyle="{ width: '150rpx', height: '70rpx', 'border-radius': '10rpx' }"
						:customTextStyle="{ fontSize: '28rpx' }"
						:disabled="formData.old_code.length < 6"
						@click="onNextStep"
					></uv-button>
				</template>

				<template v-else-if="currentStep === 1">
					<view class="title">请设置新密码</view>
					<view class="input">
						<view class="input-label">请输入新密码</view>
						<view class="input-box">
							<uv-code-input
								v-model="formData.new_code"
								dot
								focus
								size="70rpx"
								space="20rpx"
								borderColor="#bdaf8d"
								@finish="formData.show_repeate = true"
							></uv-code-input>
						</view>
					</view>
					<view class="input" v-if="formData.show_repeate">
						<view class="input-label">请再次输入密码</view>
						<view class="input-box">
							<uv-code-input
								v-model="formData.repeate_code"
								dot
								focus
								size="70rpx"
								space="20rpx"
								borderColor="#bdaf8d"
							></uv-code-input>
						</view>
					</view>
					<uv-button
						text="下一步"
						color="#bdaf8d"
						style="margin-left: auto"
						:customStyle="{ width: '150rpx', height: '70rpx', 'border-radius': '10rpx' }"
						:customTextStyle="{ fontSize: '28rpx' }"
						:disabled="formData.repeate_code.length < 6"
						@click="onNextStep"
					></uv-button>
				</template>

				<template v-else>
					<view class="iconfont icon-success"></view>
					<view class="success-text">支付密码修改成功</view>
					<uv-button
						text="返回"
						color="#bdaf8d"
						style="margin: auto"
						:customStyle="{ width: '150rpx', height: '70rpx', 'border-radius': '10rpx' }"
						:customTextStyle="{ fontSize: '28rpx' }"
						@click="routerBack()"
					></uv-button>
				</template>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	padding: 40rpx;
}

.card {
	width: 100%;
	margin-top: 40rpx;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	gap: 40rpx;
	border-radius: 20rpx;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

	.title {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
	}

	.input {
		&-label {
			padding-left: 30rpx;
			margin-bottom: 10rpx;
			font-size: 28rpx;
			color: #666666;
		}

		&-box {
			display: flex;
			justify-content: center;
		}
	}

	.iconfont {
		margin: auto;
		font-size: 100rpx;
		color: $uni-color-primary;
	}

	.success-text {
		font-size: 42rpx;
		font-weight: bold;
		color: #3a3a3a;
		text-align: center;
	}
}
</style>
