<script setup>
import { ref } from 'vue'
import { safeareaHeight_px } from '@/utils/system.js'
import { formatPrice } from '@/utils/format.js'
import { showMsg } from '@/utils/common.js'
import { routerTo } from '@/utils/router.js'

const props = defineProps({
	length: {
		type: Number,
		default: 6
	},
	price: {
		type: Number
	}
})

const keyboardPopRef = ref(null)
const open = () => {
	if (keyboardPopRef.value) keyboardPopRef.value.open()
}
const close = () => {
	if (keyboardPopRef.value) keyboardPopRef.value.close()
}
defineExpose({ open })

const password = ref('')
const onInput = (value) => {
	if (loading.value) return
	if (password.value.length < props.length) password.value += value
}
const onRollBack = () => {
	if (loading.value) return
	if (password.value.length > 0) password.value = password.value.slice(0, -1)
}

const keyboardList = [
	{ type: 'number', value: 1 },
	{ type: 'number', value: 2 },
	{ type: 'number', value: 3 },
	{ type: 'number', value: 4 },
	{ type: 'number', value: 5 },
	{ type: 'number', value: 6 },
	{ type: 'number', value: 7 },
	{ type: 'number', value: 8 },
	{ type: 'number', value: 9 },
	{ type: 'empty' },
	{ type: 'number', value: 0 },
	{ type: 'icon', value: 'icon-rollback', event: onRollBack }
]

const loading = ref(false)
const onSubmit = async () => {
	console.log('submit')
	try {
		loading.value = true

		await new Promise((resolve) => {
			setTimeout(() => {
				console.log('success')
				resolve()
			}, 2000)
		})
	} catch {
		showMsg('未知错误')
	} finally {
		console.log('final')
		password.value = ''
		loading.value = false
	}
}
</script>

<template>
	<uni-popup ref="keyboardPopRef" type="bottom" :safe-area="false">
		<view class="code-keyboard">
			<view class="header">输入密码</view>
			<view class="content">
				<!-- 加载 -->
				<template v-if="loading">
					<view class="loading">
						<dot-loading :length="5" size="15rpx"></dot-loading>
					</view>
				</template>

				<template v-else>
					<view class="price" v-if="price">￥{{ formatPrice(price) }}</view>
					<code-input
						v-model="password"
						:disabled="true"
						:length="length"
						@finish="onSubmit"
					></code-input>
					<view class="forget" @click="routerTo('/pages/user/safety/payment')">忘记密码</view>
				</template>
			</view>
			<view class="keyboard">
				<view class="keyboard-item" v-for="(item, index) in keyboardList" :key="index">
					<!-- 数字 -->
					<template v-if="item.type === 'number'">
						<view class="keyboard-item_content number" @click="onInput(item.value)">
							{{ item.value }}
						</view>
					</template>

					<!-- 图标 -->
					<template v-else-if="item.type === 'icon'">
						<view
							class="keyboard-item_content icon iconfont"
							:class="item.value"
							@click="() => onRollBack()"
						></view>
					</template>

					<!-- 空占位 -->
					<template v-else>
						<view class="keyboard-item_content empty"></view>
					</template>
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<style scoped lang="scss">
.code-keyboard {
	overflow: hidden;
	min-height: 300rpx;
	padding-bottom: v-bind(safeareaHeight_px);
	background-color: #ffffff;
	border-radius: 30rpx 30rpx 0 0;

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 80rpx;
		background-color: $uni-color-primary;
		border-radius: 30rpx 30rpx 100rpx 100rpx;
		font-size: 36rpx;
		color: #ffffff;
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 20rpx;
		min-height: 320rpx;
		padding: 40rpx;

		.loading {
			display: flex;
			justify-content: center;
		}

		.price {
			font-size: 42rpx;
			color: $uni-color-primary;
			text-align: center;
		}

		.forget {
			font-size: 28rpx;
			color: $uni-color-primary;
			text-align: center;
		}
	}

	.keyboard {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2px;
		padding: 2px 0;
		background-color: #f2f2f2;

		&-item {
			width: 100%;
			height: 80rpx;
			font-size: 38rpx;

			&_content {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;
				transition: all 0.1s;

				&.number {
					background-color: #ffffff;
					color: #000000;

					&:active {
						color: #ffffff;
						background-color: $uni-color-primary;
					}
				}

				&.icon {
					color: #333333;

					&:active {
						color: $uni-color-primary;
					}
				}
			}
		}
	}
}
</style>
