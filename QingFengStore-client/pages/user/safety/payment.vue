<script setup>
import { computed, onMounted, ref } from 'vue'
import { routerBack } from '@/utils/router.js'
import { showMsg } from '@/utils/common.js'
const safetyCloudObj = uniCloud.importObject('client-safety', { customUI: true })

const uid = uniCloud.getCurrentUserInfo().uid || null

const currentStep = ref(0) // 0-验证旧密码 1-设置新密码 2-完成
const formData = ref({
	old_code: '',
	new_code: '',
	repeate_code: '',
	show_repeate: false
})

const btnLoading = ref(false)
const lock = ref(0)
let lockCount = 0
const onNextStep = async () => {
	if (btnLoading.value) return

	try {
		btnLoading.value = true

		if (opStep.value === 0) {
			// 验证旧密码
			const {
				errCode,
				data: { result }
			} = await safetyCloudObj.verifyBalencePassword(uid, formData.value.old_code)
			if (errCode !== 0) throw new Error()

			if (result) {
				// 验证正确
				currentStep.value++
			} else {
				// 验证失败
				lockCount++
				if (lockCount >= 3) {
					// 连续验证失败3次 禁用10s
					lock.value = 10
					const timer = setInterval(() => {
						lock.value--
						if (lock.value <= 0) {
							clearInterval(timer)
							lock.value = 0
							lockCount = 2
						}
					}, 1000)
				}
				showMsg('验证失败，请重新输入')
				formData.value.old_code = ''
			}
		} else if (opStep.value === 1) {
			// 设置新密码
			if (formData.value.new_code !== formData.value.repeate_code) {
				btnLoading.value = false
				return showMsg('两次密码不一致')
			}

			const { errCode } = await safetyCloudObj.update({
				user_id: uid,
				balence_password: formData.value.new_code
			})
			if (errCode !== 0) throw new Error()

			currentStep.value++
		} else {
			// 返回
			routerBack()
		}
	} catch (err) {
		console.log(err)
		showMsg('未知错误，请稍后再试')
	} finally {
		btnLoading.value = false
	}
}

const loading = ref(true)
const isExist = ref(true)
const opStep = computed(() => currentStep.value + Number(!isExist.value))
const existPassword = async () => {
	if (!uid) return showMsg('获取用户信息失败，请刷新重试')

	try {
		loading.value = true

		const {
			errCode,
			data: { exist }
		} = await safetyCloudObj.existBalencePassword(uid)
		if (errCode !== 0) throw new Error()

		isExist.value = !exist
		loading.value = false
	} catch {
		return showMsg('获取用户信息异常，请刷新重试')
	}
}
onMounted(() => {
	existPassword()
})
</script>

<template>
	<view class="container">
		<uv-loading-page
			:loading="loading"
			loading-text="加载中..."
			font-size="24rpx"
		></uv-loading-page>
		<view class="wrapper" v-if="!loading">
			<!-- 步骤条 -->
			<uv-steps :current="currentStep" activeColor="#bdaf8d">
				<uv-steps-item title="验证旧密码" v-if="isExist"></uv-steps-item>
				<uv-steps-item title="设置新密码"></uv-steps-item>
				<uv-steps-item title="完成"></uv-steps-item>
			</uv-steps>
			<!-- 卡片容器 -->
			<view class="card">
				<template v-if="opStep === 0">
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
								:disabledKeyboard="Boolean(lock) || btnLoading"
								@finish="onNextStep"
							></uv-code-input>
						</view>
					</view>
					<button
						class="next-step-btn"
						:disabled="formData.old_code.length < 6 || btnLoading || lock > 0"
						:loading="btnLoading"
						@click="onNextStep"
					>
						{{ lock ? `剩余禁用${lock}秒` : '下一步' }}
					</button>
				</template>

				<template v-else-if="opStep === 1">
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
								:disabledKeyboard="btnLoading"
							></uv-code-input>
						</view>
					</view>
					<button
						class="next-step-btn"
						:disabled="
							formData.new_code.length < 6 || formData.repeate_code.length < 6 || btnLoading
						"
						:loading="btnLoading"
						@click="onNextStep"
					>
						下一步
					</button>
				</template>

				<template v-else>
					<view class="iconfont icon-success"></view>
					<view class="success-text">支付密码修改成功</view>
					<button
						class="next-step-btn"
						style="margin-right: auto; padding: 0 60rpx"
						@click="onNextStep"
					>
						返回
					</button>
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

	.next-step-btn {
		margin-left: auto;
		margin-right: 0;
		width: fit-content;
		height: 70rpx;
		padding: 0 30rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #ffffff;
		background-color: $uni-color-primary;

		&::after {
			border: none;
		}

		&[disabled] {
			color: rgba(#ffffff, 0.7);
			background-color: rgba($uni-color-primary, 0.6);
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
