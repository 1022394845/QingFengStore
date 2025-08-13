<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { routerTo, routerBack } from '@/utils/router.js'
import { showMsg } from '@/utils/common.js'
const categoriesCloudObj = uniCloud.importObject('admin-categories', { customUI: true })
const goodsCloudObj = uniCloud.importObject('admin-goods', { customUI: true })

const formData = ref({
	name: '', // 商品名称
	category_id: null, // 商品分类
	goods_desc: '', // 商品详情
	goods_banner_imgs: [], // 商品展示图
	goods_thumb: null, // 默认缩略图选取第一张展示图
	is_on_sale: false
})
const rules = {
	name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
	category_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
	goods_desc: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

const formRef = ref(null)
const uploadRef = ref(null)
const richTextEditorRef = ref(null)
const fileList = ref([]) // 展示图片列表
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

	// 展示图片上传
	if (fileList.value.length) {
		try {
			await uploadRef.value.upload()
			formData.value.goods_banner_imgs = fileList.value.map((item) =>
				item.exist ? item.url : item.cloudUrl
			)

			// 缩略图默认为第一张展示图片
			formData.value.goods_thumb = formData.value.goods_banner_imgs[0]
		} catch {
			btnLoading.value = false
			return showMsg('图片上传失败，请重试', 'error')
		}
	}

	// 删除内容中不存在但上传的云端图片
	richTextEditorRef.value.removeRedundantImage()

	// 新增/更新商品
	try {
		dataLoading.value = true
		if (formData.value._id) {
			// 更新
			const { errCode, errMsg } = await goodsCloudObj.update(formData.value)
			if (errCode !== 0) throw new Error('edit')
			showMsg('修改成功', 'success')
		} else {
			// 新增
			const { errCode, errMsg } = await goodsCloudObj.add(formData.value)
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

// 分类列表
const categoryList = ref([])
const getCategoryList = async () => {
	try {
		const { errCode, data } = await categoriesCloudObj.list()

		if (errCode !== 0) throw new Error()
		categoryList.value = data
	} catch {
		return showMsg('获取分类失败，请刷新重试', 'error')
	}
}
onMounted(() => {
	getCategoryList()
})

// sku编辑
const skuList = ref([])
const skuInput = ref('')
const skuInputVisible = ref(false)
const onAddSku = () => {
	console.log(skuInput.value.trim())
}

// 编辑数据回显
onLoad(async (e) => {
	if (!e.id) return

	try {
		dataLoading.value = true
		const { errCode, data } = await goodsCloudObj.detail(e.id)

		if (errCode !== 0) throw new Error()
		const {
			_id,
			category_id,
			name = '',
			goods_banner_imgs = [],
			goods_desc = '',
			is_on_sale = false
		} = data
		formData.value = { _id, category_id, name, goods_banner_imgs, goods_desc, is_on_sale }
		// 展示图片列表处理
		if (goods_banner_imgs.length) {
			goods_banner_imgs.forEach((item) => {
				fileList.value.push({
					url: item,
					status: 'success', // 避免被重复上传
					exist: true // 无需显示进度条
				})
			})
		}
		dataLoading.value = false
	} catch {
		showMsg('获取数据失败，请刷新页面重试')
	}
})

// 移除编辑时初始的展示图片
const onRemoveImage = (url) => {
	const index = formData.value.goods_banner_imgs.findIndex((item) => item === url)
	if (index !== -1) formData.value.goods_banner_imgs.splice(index, 1)
}
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
					<el-form-item label="商品标题" prop="name">
						<el-input v-model="formData.name" />
					</el-form-item>
					<el-form-item label="商品分类" prop="category_id">
						<el-select
							v-model="formData.category_id"
							placeholder="请选择商品分类"
							size="large"
							style="width: 240px"
						>
							<el-option
								v-for="item in categoryList"
								:key="item._id"
								:label="item.name"
								:value="item._id"
							/>
						</el-select>
					</el-form-item>
					<el-form-item label="商品展示" prop="goods_banner_imgs">
						<upload-image
							ref="uploadRef"
							v-model="fileList"
							width="200px"
							ratio="1 / 1"
							:limit="5"
							@remove="(url) => onRemoveImage(url)"
						></upload-image>
					</el-form-item>
					<el-form-item label="商品规格" prop="goods_sku">
						<el-tag v-for="sku in skuList" :key="sku._id" closable>
							{{ sku.sku_name }}
						</el-tag>
						<el-input
							v-if="skuInputVisible"
							v-model="skuInput"
							size="small"
							@keyup.enter="onAddSku"
							@blur="skuInputVisible = false"
						/>
						<el-button v-else size="small" @click="skuInputVisible = true">+ 新增规格</el-button>
					</el-form-item>
					<el-form-item label="商品详情" prop="goods_desc">
						<rich-text-editor
							ref="richTextEditorRef"
							v-model="formData.goods_desc"
						></rich-text-editor>
					</el-form-item>
					<el-form-item label="是否上架" prop="is_on_sale">
						<el-switch v-model="formData.is_on_sale"></el-switch>
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
</style>
