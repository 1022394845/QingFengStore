<script setup>
import { routerTo } from '@/utils/router.js'
import { dayjs, ElMessageBox } from 'element-plus'
import { nextTick, onMounted, ref } from 'vue'
import { showMsg } from '@/utils/common.js'
import { getResizeImage } from '@/utils/network.js'
import emptyImage from '@/static/noImage.png'
const newsCloudObj = uniCloud.importObject('admin-news', { customUI: true })

// 资讯列表
const newsList = ref([])
const pageInfo = ref({
	page: 1,
	pageSize: 5,
	total: 0
})
const loading = ref(false)
const getNewsList = async () => {
	try {
		loading.value = true
		const { errCode, total, data } = await newsCloudObj.list(pageInfo.value, query.value)
		if (errCode !== 0) throw new Error()
		pageInfo.value.total = total
		newsList.value = data
	} catch {
		showMsg('获取数据失败，请刷新重试', 'error')
	} finally {
		loading.value = false
	}
}
onMounted(() => {
	getNewsList()
})

// 重置分页
const resetPage = () => {
	pageInfo.value.page = 1
	getNewsList()
}

// 搜索
const query = ref('')
const onSearch = () => {
	resetPage()
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
	return ElMessageBox.confirm('确认删除数据吗？', '警告', {
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
		} = await newsCloudObj.remove(ids)
		if (errCode !== 0) throw new Error()
		showMsg(`成功删除${deleted}条数据`, 'success')
		resetPage() // 重置分页
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
		const { errCode } = await newsCloudObj.remove(id)
		if (errCode !== 0) throw new Error()
		showMsg(`删除成功`, 'success')
		// 删除非第一页的最后一条数据，回退页码
		if (newsList.value.length === 1 && pageInfo.value.page > 1) pageInfo.value.page--
		getNewsList()
	} catch {
		loading.value = false
		showMsg('删除失败，请刷新重试', 'error')
	}
}

// 改变文章状态
const onChangeArticleStatus = async (row) => {
	try {
		row.articleStatusLoading = true
		const { _id, article_status } = row
		const newStatus = article_status ? 0 : 1
		const { errCode } = await newsCloudObj.update({ _id, article_status: newStatus })
		if (errCode !== 0) throw new Error()
		row.articleStatusLoading = false
		showMsg(`更改成功`, 'success')
		return true
	} catch {
		row.articleStatusLoading = false
		showMsg('更改失败，请稍后再试', 'error')
		return false
	}
}

// 改变文章推荐状态
const onChangeIsSticky = async (row) => {
	try {
		row.isStickyLoading = true
		const { _id, is_sticky } = row
		const newStatus = is_sticky ? false : true
		const { errCode } = await newsCloudObj.update({ _id, is_sticky: newStatus })
		if (errCode !== 0) throw new Error()
		row.isStickyLoading = false
		showMsg(`更改成功`, 'success')
		return true
	} catch {
		row.isStickyLoading = false
		showMsg('更改失败，请稍后再试', 'error')
		return false
	}
}
</script>

<template>
	<view class="fix-top-window">
		<view class="uni-header">
			<uni-stat-breadcrumb class="uni-stat-breadcrumb-on-phone" />
			<view class="uni-group">
				<input
					class="uni-search"
					type="text"
					v-model.trim="query"
					@confirm="onSearch"
					:placeholder="$t('common.placeholder.query')"
				/>
				<button class="uni-button hide-on-phone" type="default" size="mini" @click="onSearch">
					{{ $t('common.button.search') }}
				</button>
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
				:data="newsList"
				v-loading="loading"
				stripe
				style="width: 100%"
				:row-style="{ height: '120px' }"
				@selection-change="onSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="title" label="标题" show-overflow-tooltip />
				<el-table-column prop="image" label="缩略图" width="184" align="center">
					<template #default="{ row }">
						<el-image
							:src="getResizeImage(row.avatar, 160, 90) || emptyImage"
							fit="cover"
							style="height: 90px; display: block"
							lazy
							:preview-src-list="row.avatar ? [row.avatar] : undefined"
							preview-teleported
						/>
					</template>
				</el-table-column>
				<el-table-column
					prop="user.nickname"
					label="发布者"
					width="150"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					prop="view_count"
					label="阅读数"
					width="90"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column prop="article_status" label="是否可见" width="80" align="center">
					<template #default="{ row }">
						<el-switch
							v-model="row.article_status"
							:active-value="1"
							:inactive-value="0"
							:loading="row.articleStatusLoading"
							:before-change="() => onChangeArticleStatus(row)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="is_sticky" label="是否推荐" width="80" align="center">
					<template #default="{ row }">
						<el-switch
							v-model="row.is_sticky"
							:loading="row.isStickyLoading"
							:before-change="() => onChangeIsSticky(row)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="publish_date" label="发布时间" width="100" align="center">
					<template #default="{ row }">
						{{ dayjs(row.publish_date).format('YYYY-MM-DD') }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150" align="center" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" text @click="routerTo(`./edit?id=${row._id}`)">
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
				@current-change="getNewsList"
			/>
		</view>
	</view>
</template>

<style scoped lang="scss"></style>
