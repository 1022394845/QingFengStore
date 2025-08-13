<script setup>
import { onMounted, ref } from 'vue'
import { showMsg } from '@/utils/common.js'
import { routerTo } from '@/utils/router.js'
import { getResizeImage } from '@/utils/network.js'
import { ElLoading, ElMessageBox, dayjs } from 'element-plus'
import emptyImage from '@/static/noImage.png'
const goodsCloudObj = uniCloud.importObject('admin-goods', { customUI: true })

const goodsList = ref([])
const pageInfo = ref({
	page: 1,
	pageSize: 5,
	total: 0
})
const loading = ref(false)
const getGoodsList = async () => {
	try {
		loading.value = true
		const { errCode, data } = await goodsCloudObj.list()
		if (errCode !== 0) throw new Error()
		goodsList.value = data
	} catch {
		goodsList.value = []
		showMsg('加载失败，请刷新重试', 'error')
	} finally {
		loading.value = false
	}
}
onMounted(() => {
	getGoodsList()
})

// 修改上架状态
const onChangeStatus = async (row) => {
	try {
		row.statusLoading = true
		const { _id, is_on_sale } = row
		const newStatus = is_on_sale ? false : true
		const { errCode } = await goodsCloudObj.update({ _id, is_on_sale: newStatus })
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
	return ElMessageBox.confirm('确认删除商品吗？该操作会同时删除商品的所有规格信息！', '警告', {
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
		} = await goodsCloudObj.remove(ids)
		if (errCode !== 0) throw new Error()
		showMsg(`成功删除${deleted}件商品`, 'success')
		getGoodsList()
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
		const { errCode } = await goodsCloudObj.remove(id)
		if (errCode !== 0) throw new Error()
		showMsg(`删除成功`, 'success')
		getGoodsList()
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
				<button class="uni-button" type="primary" size="mini" @click="routerTo('./edit')">
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
				:data="goodsList"
				v-loading="loading"
				stripe
				style="width: 100%"
				:row-style="{ height: '120px' }"
				@selection-change="onSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="name" label="商品名称" show-overflow-tooltip />
				<el-table-column prop="goods_thumb" label="缩略图" width="124" align="center">
					<template #default="{ row }">
						<el-image
							:src="getResizeImage(row.goods_thumb, 100, 100) || emptyImage"
							fit="cover"
							style="height: 100px; display: block"
							lazy
							:preview-src-list="row.goods_thumb ? [row.goods_thumb] : undefined"
							preview-teleported
						/>
					</template>
				</el-table-column>
				<el-table-column
					prop="category.name"
					label="商品分类"
					width="120"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					prop="total_sell_count"
					label="商品销量"
					width="90"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column prop="is_on_sale" label="是否上架" width="80" align="center">
					<template #default="{ row }">
						<el-switch
							v-model="row.is_on_sale"
							:loading="row.statusLoading"
							:before-change="() => onChangeStatus(row)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="last_modify_date" label="更新时间" width="100" align="center">
					<template #default="{ row }">
						{{ dayjs(row.last_modify_date).format('YYYY-MM-DD') }}
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
			<el-pagination
				background
				layout="prev, pager, next"
				v-model:current-page="pageInfo.page"
				:page-size="pageInfo.pageSize"
				:total="pageInfo.total"
				@current-change="getGoodsList"
			/>
		</view>
	</view>
</template>

<style scoped lang="scss"></style>
