<script setup>
import { ref } from 'vue'
import { routerBack, routerTo } from '@/utils/router.js'
import { showMsg } from '@/utils/common.js'
const newsCloudObj = uniCloud.importObject('admin-news')

const formData = ref({
	title: '',
	avatar: '',
	content: '',
	is_sticky: false
})
const rules = {
	title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
	content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

const formRef = ref(null)
const uploadRef = ref(null)
const loading = ref(false)
const onSubmit = async () => {
	if (!formRef.value) return showMsg('未知错误，请刷新页面重试', 'error')

	loading.value = true
	// 表单非空校验
	try {
		await formRef.value.validate()
	} catch {
		loading.value = false
		return showMsg('存在校验未通过字段', 'error')
	}

	// 封面上传
	if (fileList.value?.length) {
		try {
			await uploadRef.value.upload()
			formData.value.avatar = fileList.value[0].cloudUrl
		} catch {
			loading.value = false
			return showMsg('封面上传失败，请重试', 'error')
		}
	}

	// 新增数据
	try {
		const { errCode, errMsg } = await newsCloudObj.add(formData.value)
		if (errCode !== 0) return showMsg(errMsg, 'error')
		showMsg('新增成功', 'success')
		routerTo('./list')
	} catch {
		loading.value = false
		return showMsg('新增失败', 'error')
	}
}

// 封面列表
const fileList = ref([])
</script>

<template>
	<view class="uni-container">
		<el-row>
			<el-col :span="20" :offset="2">
				<el-form
					ref="formRef"
					:model="formData"
					:rules="rules"
					label-width="auto"
					scroll-to-error
					size="large"
				>
					<el-form-item label="标题" prop="title">
						<el-input v-model="formData.title" />
					</el-form-item>
					<el-form-item label="封面" prop="avatar">
						<upload-image
							ref="uploadRef"
							v-model="fileList"
							width="200px"
							ratio="16 / 9"
							:limit="1"
						></upload-image>
					</el-form-item>
					<el-form-item label="内容" prop="content">
						<el-input v-model="formData.content" type="textarea" />
					</el-form-item>
					<el-form-item label="推荐" prop="is_sticky">
						<el-switch v-model="formData.is_sticky"></el-switch>
					</el-form-item>
					<el-form-item>
						<view class="btn-group">
							<el-button size="large" @click="routerBack()">
								{{ $t('common.button.back') }}
							</el-button>
							<el-button type="primary" size="large" @click="onSubmit" :loading="loading">
								{{ $t('common.button.add') }}
							</el-button>
						</view>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</view>
</template>

<style scoped lang="scss">
.btn-group {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 20px;
}

.avatar-container {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);

	&:hover {
		border-color: var(--el-color-primary);
	}
}
</style>
