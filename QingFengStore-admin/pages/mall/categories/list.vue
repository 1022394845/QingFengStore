<script setup>
import { onMounted, ref } from 'vue'
import { showMsg } from '@/utils/common'
import { ElLoading, ElMessageBox, dayjs } from 'element-plus'
const categoriesCloudObj = uniCloud.importObject('admin-categories', { customUI: true })

const categoryList = ref([])
const loading = ref(false)
const getCategoryList = async () => {
	try {
		loading.value = true
		const { errCode, data } = await categoriesCloudObj.list()
		if (errCode !== 0) throw new Error()
		categoryList.value = data
	} catch {
		categoryList.value = []
		showMsg('加载失败，请刷新重试', 'error')
	} finally {
		loading.value = false
	}
}
onMounted(() => {
	getCategoryList()
})

// 新增分类
const onAdd = async () => {
	let name = ''

	try {
		const res = await ElMessageBox.prompt('请输入分类名称', '新增', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/, // 非空
			inputErrorMessage: '分类名称不能为空'
		})
		name = res.value
	} catch {
		return
	}

	// 新增分类
	if (!name.trim()) return showMsg('分类名称不能为空', 'error')

	const loading = ElLoading.service({
		lock: true,
		text: '新增中',
		background: 'rgba(0, 0, 0, 0.7)'
	})
	try {
		const { errCode } = await categoriesCloudObj.add({ name })
		if (errCode !== 0) throw new Error()
		showMsg('新增成功', 'success')
		getCategoryList()
	} catch {
		showMsg('新增失败，请稍后再试', 'error')
	} finally {
		loading.close()
	}
}

// 编辑分类
const onEdit = async (row) => {
	let name = row.name

	try {
		const res = await ElMessageBox.prompt('请输入分类名称', '编辑', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			inputValue: name,
			inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/, // 非空
			inputErrorMessage: '分类名称不能为空'
		})
		name = res.value
	} catch {
		return
	}

	// 修改分类
	if (!name.trim()) return showMsg('分类名称不能为空', 'error')

	const loading = ElLoading.service({
		lock: true,
		text: '修改中',
		background: 'rgba(0, 0, 0, 0.7)'
	})
	try {
		const { errCode } = await categoriesCloudObj.update({ _id: row._id, name })
		if (errCode !== 0) throw new Error()
		showMsg('修改成功', 'success')
		getCategoryList()
	} catch {
		showMsg('修改失败，请稍后再试', 'error')
	} finally {
		loading.close()
	}
}

// 修改分类状态
const onChangeStatus = async (row) => {
	try {
		row.statusLoading = true
		const { _id, status } = row
		const newStatus = status ? false : true
		const { errCode } = await categoriesCloudObj.update({ _id, status: newStatus })
		if (errCode !== 0) throw new Error()
		row.statusLoading = false
		showMsg(`更改成功`, 'success')
		return true
	} catch {
		row.statusLoading = false
		showMsg('更改失败，请稍后再试', 'error')
		return false
	}
}

// 删除
let deleteIds = []
const batchDeletedisabled = ref(true)
const onSelectionChange = (selection) => {
	deleteIds = selection
	batchDeletedisabled.value = selection.length === 0
}
// 删除确认
const confirmDelete = async () => {
	return ElMessageBox.confirm('确认删除分类吗？', '警告', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
		center: true,
		'show-close': false
	})
}
// 批量删除
const onBatchDelete = async () => {
	await confirmDelete() // 弹出框确认操作

	try {
		loading.value = true
		const ids = deleteIds.map((item) => item._id)
		const {
			errCode,
			data: { deleted }
		} = await categoriesCloudObj.remove(ids)
		if (errCode !== 0) throw new Error()
		showMsg(`成功删除${deleted}条分类`, 'success')
		getCategoryList()
	} catch {
		loading.value = false
		showMsg('删除失败，请刷新重试', 'error')
	}
}
// 单项删除
const onDelete = async (id) => {
	await confirmDelete() // 弹出框确认操作

	try {
		loading.value = true
		const { errCode } = await categoriesCloudObj.remove(id)
		if (errCode !== 0) throw new Error()
		showMsg(`删除成功`, 'success')
		getCategoryList()
	} catch {
		loading.value = false
		showMsg('删除失败，请刷新重试', 'error')
	}
}
</script>

<template>
	<view class="fix-top-window">
		<view class="uni-header">
			<uni-stat-breadcrumb class="uni-stat-breadcrumb-on-phone" />
			<view class="uni-group">
				<button class="uni-button" type="primary" size="mini" @click="onAdd">
					{{ $t('common.button.add') }}
				</button>
				<button
					class="uni-button"
					type="warn"
					size="mini"
					:disabled="batchDeletedisabled"
					@click="onBatchDelete"
				>
					{{ $t('common.button.batchDelete') }}
				</button>
			</view>
		</view>
		<view class="uni-container">
			<el-table
				:data="categoryList"
				v-loading="loading"
				stripe
				style="width: 100%"
				@selection-change="onSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="name" label="分类名称" show-overflow-tooltip />
				<el-table-column prop="status" label="是否启用" width="80" align="center">
					<template #default="{ row }">
						<el-switch
							v-model="row.status"
							:loading="row.statusLoading"
							:before-change="() => onChangeStatus(row)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="create_date" label="创建时间" width="100" align="center">
					<template #default="{ row }">
						{{ dayjs(row.create_date).format('YYYY-MM-DD') }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150" align="center" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" text @click="onEdit(row)">
							{{ $t('common.button.edit') }}
						</el-button>
						<el-button type="danger" text style="margin-left: 0" @click="onDelete(row._id)">
							{{ $t('common.button.delete') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</view>
	</view>
</template>

<style scoped lang="scss"></style>
