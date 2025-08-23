<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import RegionsPicker from './regions-picker.vue'
import { showConfirm, showMsg } from '@/utils/common.js'
import { useAddressStore } from '@/store/address.js'
import { safeareaHeight } from '@/utils/system.js'

const popupBottom_px = `${safeareaHeight + uni.rpx2px(40)}px`

const addressStore = useAddressStore()
addressStore.init()
// 没有默认地址时，强制为默认
const needDefault = computed(() => {
	if (addressStore.addressList.length === 0) return true
	return formData.value._id && formData.value._id === addressStore.defaultAddress._id ? true : false
})

const defaultData = {
	region: '',
	province_code: null,
	city_code: null,
	area_code: null,
	detail: '',
	name: '',
	phone: '',
	default: false
}
const formData = ref({ ...defaultData })
const rules = {
	region: {
		validator: (rule, value, callback) => {
			const { province_code, city_code, area_code } = formData.value
			return province_code && city_code && area_code
		},
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

	const { province_code, city_code, area_code } = formData.value
	if (province_code && city_code && area_code)
		pickerRef.value.open([province_code, city_code, area_code])
	else pickerRef.value.open()
}
const onSetRegion = (data) => {
	if (!Array.isArray(data) || data.length < 3) return showMsg('地区选择异常，请稍后再试')

	formData.value.region = data.map((item) => item.name).join(' ') || ''
	formData.value.province_code = data[0].code
	formData.value.city_code = data[1].code
	formData.value.area_code = data[2].code
}

const addressPopRef = ref(null)
const formRef = ref(null)
/**
 * 打开编辑框
 * @param {object} [info] 编辑回显数据
 */
const open = (info = null) => {
	if (!addressPopRef.value) return

	if (info) formData.value = { ...info }
	else formData.value = { ...defaultData }
	formData.value.default = needDefault.value

	addressPopRef.value.open()
}
const close = () => {
	if (!addressPopRef.value) return

	addressPopRef.value.close()
}
defineExpose({ open })

// 提交
const emits = defineEmits(['success'])
const onSubmit = async () => {
	if (!formRef.value) return showMsg('未知错误，请稍后再试')

	// 验证表单
	await formRef.value.validate()

	// 提交表单
	try {
		if (formData.value._id) {
			// 更新
			const { errCode } = await addressStore.update(formData.value)
			if (errCode !== 0) throw new Error()
		} else {
			// 新增
			const { errCode } = await addressStore.add(formData.value)
			if (errCode !== 0) throw new Error()
		}
	} catch {
		return showMsg('保存失败，请稍后再试')
	}

	showMsg('保存成功')
	addressPopRef.value.close()
}

// 删除
const onRemove = async () => {
	if (!formData.value || !formData.value._id) return showMsg('未知错误，请稍后再试')

	const cancel = await showConfirm('温馨提示', '确认删除该地址吗？')
	if (cancel) return

	try {
		const { errCode } = await addressStore.remove(formData.value._id)
		if (errCode !== 0) throw new Error()

		showMsg('删除成功')
		close()
	} catch (err) {
		console.log(err)
		return showMsg('删除失败，请稍后再试')
	}
}
</script>

<template>
	<uni-popup ref="addressPopRef" type="bottom" :safe-area="false">
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
						v-model="formData.region"
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
					<uv-switch
						v-model="formData.default"
						size="32rpx"
						activeColor="#bdaf8d"
						:disabled="needDefault"
					></uv-switch>
				</uv-form-item>
				<view class="btn-group">
					<view class="btn remove" v-if="formData._id" @click="onRemove">删除地址</view>
					<view class="btn submit" @click="onSubmit">保存地址</view>
				</view>
			</uv-form>
			<regions-picker ref="pickerRef" @confirm="(data) => onSetRegion(data)"></regions-picker>
		</view>
	</uni-popup>
</template>

<style scoped lang="scss">
.address-editor-container {
	min-height: 300rpx;
	padding: 40rpx 60rpx v-bind(popupBottom_px);
	background-color: #ffffff;
	border-radius: 30rpx 30rpx 0 0;
}

.btn-group {
	width: 100%;
	height: 80rpx;
	margin: 40rpx auto 20rpx;
	display: flex;
	gap: 40rpx;
	align-items: center;

	.btn {
		flex: 1;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		color: #ffffff;
		border-radius: 20rpx;

		&.submit {
			background-color: $uni-color-primary;
		}
		&.remove {
			background-color: #ef5350;
		}
	}
}
</style>
