<script setup>
import { computed, onMounted, ref } from 'vue'
import RegionsPicker from './regions-picker.vue'
import { showMsg } from '@/utils/common.js'

const formData = ref({
	region: [],
	detail: '',
	name: '',
	phone: '',
	default: false
})
const rules = {
	region: {
		type: 'array',
		min: 3,
		required: true,
		message: '请选择所在地区',
		trigger: ['change']
	},
	detail: {
		type: 'string',
		required: true,
		message: '请填写详细地址',
		trigger: ['blur']
	},
	name: {
		type: 'string',
		required: true,
		message: '请填写联系姓名',
		trigger: ['blur']
	},
	phone: [
		{
			type: 'string',
			required: true,
			message: '请填写联系电话',
			trigger: ['blur']
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: '请输入正确的手机号码',
			trigger: ['blur']
		}
	]
}

// 选择地区
const pickerRef = ref(null)
const onPickRegion = () => {
	if (!pickerRef.value) return
	pickerRef.value.open()
}
const onSetRegion = (data) => {
	formData.value.region = data
}
const regionInfo = computed(() => {
	if (!formData.value?.region) return ''
	return formData.value.region.map((item) => item.name).join(' ')
})

// 提交
const formRef = ref(null)
const emits = defineEmits(['success'])
const onSubmit = async () => {
	if (!formRef.value) return showMsg('未知错误，请稍后再试')

	// 验证表单
	await formRef.value.validate()

	// 提交表单

	emits('success')
}
</script>

<template>
	<view class="address-editor-container">
		<uv-form
			ref="formRef"
			:model="formData"
			:rules="rules"
			labelWidth="auto"
			:labelStyle="{ marginRight: '30rpx', fontSize: '28rpx', color: '#666666' }"
		>
			<uv-form-item label="所在地区" prop="region" :borderBottom="true" required>
				<uv-input
					:value="regionInfo"
					border="none"
					fontSize="32rpx"
					disabled
					disabledColor="transparent"
					@click="onPickRegion"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="详细地址" prop="detail" :borderBottom="true" required>
				<uv-input v-model="formData.detail" border="none" fontSize="32rpx"></uv-input>
			</uv-form-item>
			<uv-form-item label="联系姓名" prop="name" :borderBottom="true" required>
				<uv-input v-model="formData.name" border="none" fontSize="32rpx"></uv-input>
			</uv-form-item>
			<uv-form-item label="联系电话" prop="phone" :borderBottom="true" required>
				<uv-input v-model="formData.phone" border="none" fontSize="32rpx"></uv-input>
			</uv-form-item>
			<uv-form-item label="设为默认" prop="default" :borderBottom="true">
				<uv-switch v-model="formData.default" size="32rpx" activeColor="#bdaf8d"></uv-switch>
			</uv-form-item>
			<view class="submit-btn" @click="onSubmit">保存地址</view>
		</uv-form>
		<regions-picker ref="pickerRef" @confirm="(data) => onSetRegion(data)"></regions-picker>
	</view>
</template>

<style scoped lang="scss">
.submit-btn {
	width: 100%;
	height: 80rpx;
	margin: 60rpx auto 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 32rpx;
	color: #ffffff;
	background-color: $uni-color-primary;
	border-radius: 20rpx;
}
</style>
