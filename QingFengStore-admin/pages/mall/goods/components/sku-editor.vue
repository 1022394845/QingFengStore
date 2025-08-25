<script setup>
import { ref } from 'vue'
import { showMsg } from '@/utils/common.js'
import { ElMessageBox } from 'element-plus'
const skuCloudObj = uniCloud.importObject('admin-sku', { customUI: true })

const dialogVisible = ref(false)
let goods_id = null
let sku_id = null
/**
 * 开启sku编辑框
 * @param {string} goodsId 商品id 必传
 * @param {string} [skuId] 编辑sku传递id
 */
const open = (goodsId, skuId) => {
	if (!goodsId) return showMsg('请先新建商品，再添加规格信息', 'error')
	goods_id = goodsId
	// 判断是否可以使用缓存数据
	if (skuId) {
		if (!sku_id || skuId !== sku_id) {
			// 如果没有缓存或缓存数据不为当前查看 重新获取数据
			getDetail(skuId)
			if (formRef.value) formRef.value.resetFields()
			fileList.value = []
		}
	} else {
		// 新建规格
		if (formRef.value) formRef.value.resetFields()
		if (formData.value._id) delete formData.value._id
		fileList.value = []
	}
	sku_id = skuId // 缓存当前sku_id
	dialogVisible.value = true
}
/**
 * 关闭sku编辑框
 */
const close = () => {
	dialogVisible.value = false
	loading.value = false
	dataLoading.value = false
}
defineExpose({ open, close })

const formData = ref({
	sku_name: '',
	sku_thumb: null,
	price: 0.0,
	market_price: null,
	stock: 0
})
const rules = {
	sku_name: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
	price: [{ required: true, message: '请输入出售价格', trigger: 'blur' }]
}

const formRef = ref(null)
const uploadRef = ref(null)
const fileList = ref([]) // 展示图片列表
const loading = ref(false)
const dataLoading = ref(false)
const emits = defineEmits(['success'])
const onSubmit = async () => {
	if (!goods_id) return showMsg('获取商品id异常，请刷新重试', 'error')
	if (!formRef.value) return showMsg('未知错误，请刷新页面重试', 'error')

	// 表单非空校验
	try {
		await formRef.value.validate()
	} catch {
		loading.value = false
		return showMsg('存在校验未通过字段', 'error')
	}

	// 缩略图上传
	if (fileList.value.length) {
		try {
			await uploadRef.value.upload()
			if (!fileList.value[0].exist) {
				// 封面为重新上传的图片
				formData.value.sku_thumb = fileList.value[0].cloudUrl
			}
		} catch {
			loading.value = false
			return showMsg('缩略图上传失败，请重试', 'error')
		}
	}

	dataLoading.value = true

	// 将价格转为以分为单位
	const { price, market_price } = formData.value
	if (price) formData.value.price = Math.round(price * 100)
	if (market_price) formData.value.market_price = Math.round(market_price * 100)

	// 新增/更新sku
	try {
		if (formData.value._id) {
			// 更新
			const { errCode, errMsg } = await skuCloudObj.update(formData.value)
			if (errCode !== 0) throw new Error('edit')
			showMsg('修改成功', 'success')
		} else {
			// 新增
			formData.value.goods_id = goods_id
			const { errCode, errMsg } = await skuCloudObj.add(formData.value)
			if (errCode !== 0) throw new Error('add')
			showMsg('新增成功', 'success')
		}

		emits('success')
		close()
		sku_id = null // 清除缓存sku_id
	} catch (err) {
		showMsg(`${err.message === 'edit' ? '修改' : '新增'}失败`, 'error')
	} finally {
		loading.value = false
		dataLoading.value = false
	}
}

// 编辑数据回显
const getDetail = async (id) => {
	if (!id) return showMsg('获取规格id异常，请刷新重试', 'error')

	try {
		dataLoading.value = true

		const { errCode, data } = await skuCloudObj.detail(id)
		if (errCode !== 0) throw new Error()
		// 将价格转为以元为单位
		if (data.price) data.price = parseFloat((parseFloat(data.price) / 100).toFixed(2))
		if (data.market_price)
			data.market_price = parseFloat((parseFloat(data.market_price) / 100).toFixed(2))
		formData.value = { ...data }
		if (data.sku_thumb) uploadRef.value.init(data.sku_thumb)

		dataLoading.value = false
	} catch {
		return showMsg('获取规格信息失败，请关闭界面重试', 'error')
	}
}

// 移除编辑时初始的缩略图
const onRemoveImage = () => {
	formData.value.sku_thumb = null
}

// 删除
const onRemove = async () => {
	await ElMessageBox.confirm('确认删除该规格吗？', '警告', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
		center: true,
		'show-close': false
	})

	if (!sku_id) return showMsg('获取规格信息失败')

	try {
		const { errCode } = await skuCloudObj.remove(sku_id)
		if (errCode !== 0) throw new Error()

		emits('success')
		close()
		showMsg('删除成功')
	} catch {
		return showMsg('删除规格失败')
	}
}
</script>

<template>
	<view class="sku-editor">
		<el-dialog v-model="dialogVisible" title="规格编辑" center>
			<template #default>
				<el-row v-loading="dataLoading">
					<el-col :span="20" :offset="2">
						<el-form
							ref="formRef"
							:model="formData"
							:rules="rules"
							label-width="auto"
							scroll-to-error
						>
							<el-form-item label="规格名称" prop="sku_name">
								<el-input v-model="formData.sku_name" />
							</el-form-item>
							<el-form-item label="规格展示" prop="sku_thumb">
								<upload-image
									ref="uploadRef"
									v-model="fileList"
									width="100px"
									ratio="1 / 1"
									:limit="1"
									@remove="onRemoveImage"
								></upload-image>
							</el-form-item>
							<el-form-item label="出售价格" prop="price">
								<el-input-number
									v-model="formData.price"
									:precision="2"
									:step="0.1"
									:min="0"
									controls-position="right"
								/>
							</el-form-item>
							<el-form-item label="市场价格" prop="market_price">
								<el-input-number
									v-model="formData.market_price"
									:precision="2"
									:step="0.1"
									:min="0"
									controls-position="right"
								/>
							</el-form-item>
							<el-form-item label="库存数量" prop="stock">
								<el-input-number
									v-model="formData.stock"
									:precision="0"
									:min="0"
									controls-position="right"
								/>
							</el-form-item>
							<el-form-item label="是否上架" prop="is_on_sale">
								<el-switch v-model="formData.is_on_sale"></el-switch>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>
			</template>

			<template #footer>
				<div class="dialog-footer">
					<el-button @click="close">取消</el-button>
					<el-button type="danger" v-if="formData._id" @click="onRemove">删除</el-button>
					<el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
				</div>
			</template>
		</el-dialog>
	</view>
</template>

<style scoped lang="scss">
:deep(.el-dialog) {
	--el-dialog-width: min(80%, 600px);

	.el-dialog__header {
		padding-right: 0;
	}

	.dialog-footer {
		display: flex;
		justify-content: center;
		gap: 25px;
		align-items: center;
	}
}
</style>
