<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { routerBack, routerTo } from '@/utils/router.js'
import { showMsg } from '@/utils/common.js'
const newsCloudObj = uniCloud.importObject('admin-news', { customUI: true })

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
const richTextEditorRef = ref(null)
const fileList = ref([]) // 封面列表
const btnLoading = ref(false) // 按钮加载
const dataLoading = ref(false) // 页面数据加载
const onSubmit = async () => {
	if (!formRef.value) return showMsg('未知错误，请刷新页面重试', 'error')

	btnLoading.value = true
	// 表单非空校验
	try {
		await formRef.value.validate()
	} catch {
		btnLoading.value = false
		return showMsg('存在校验未通过字段', 'error')
	}

	// 封面上传
	if (fileList.value.length) {
		try {
			await uploadRef.value.upload()
			if (!fileList.value[0].exist) {
				// 封面为重新上传的图片
				formData.value.avatar = fileList.value[0].cloudUrl
			}
		} catch {
			btnLoading.value = false
			return showMsg('封面上传失败，请重试', 'error')
		}
	}

	// 删除内容中不存在但上传的云端图片
	richTextEditorRef.value.removeRedundantImage()

	// 新增/更新数据
	try {
		dataLoading.value = true
		if (formData.value._id) {
			// 更新
			const { errCode, errMsg } = await newsCloudObj.update(formData.value)
			if (errCode !== 0) throw new Error('edit')
			showMsg('修改成功', 'success')
		} else {
			// 新增
			const { errCode, errMsg } = await newsCloudObj.add(formData.value)
			if (errCode !== 0) throw new Error('add')
			showMsg('新增成功', 'success')
		}
		routerTo('./list')
	} catch (err) {
		showMsg(`${err.message === 'edit' ? '修改' : '新增'}失败`, 'error')
	} finally {
		btnLoading.value = false
		dataLoading.value = false
	}
}

// 编辑数据回显
onLoad(async (e) => {
	if (!e.id) return

	try {
		dataLoading.value = true

		const { errCode, data } = await newsCloudObj.detail(e.id)
		if (errCode !== 0) throw new Error()
		formData.value = { ...data }
		// 封面列表处理
		if (data.avatar) uploadRef.value.init(data.avatar)

		dataLoading.value = false
	} catch {
		showMsg('获取数据失败，请刷新页面重试')
	}
})

// 移除编辑时初始的avatar
const onRemoveAvatar = () => {
	formData.value.avatar = ''
}
</script>

<template>
	<view class="uni-container">
		<el-row v-loading="dataLoading">
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
							@remove="onRemoveAvatar"
						></upload-image>
					</el-form-item>
					<el-form-item label="内容" prop="content">
						<rich-text-editor ref="richTextEditorRef" v-model="formData.content"></rich-text-editor>
					</el-form-item>
					<el-form-item label="推荐" prop="is_sticky">
						<el-switch v-model="formData.is_sticky"></el-switch>
					</el-form-item>
					<el-form-item>
						<view class="btn-group">
							<el-button size="large" @click="routerBack()">
								{{ $t('common.button.back') }}
							</el-button>
							<el-button type="primary" size="large" @click="onSubmit" :loading="btnLoading">
								{{ formData._id ? $t('common.button.edit') : $t('common.button.add') }}
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
