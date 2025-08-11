<script setup>
import { routerTo } from '@/utils/router.js'
import { dayjs } from 'element-plus'
import { nextTick, onMounted, ref } from 'vue'
import { showMsg } from '@/utils/common'
const newsCloudObj = uniCloud.importObject('admin-news', { customUI: true })

// 资讯列表
const newsList = ref([])
const pageInfo = ref({
	page: 1,
	pageSize: 5,
	total: 0
})
const loading = ref(false)
const tableRef = ref(null)
const getNewsList = async () => {
	try {
		loading.value = true
		const { total, data } = await newsCloudObj.list(pageInfo.value, query.value)
		pageInfo.value.total = total
		newsList.value = data
		nextTick(() => {
			tableRef.value.setScrollTop(0) // 滚动至表格顶部
		})
	} catch {
		showMsg('获取数据失败，请刷新重试', 'error')
	} finally {
		loading.value = false
	}
}
onMounted(() => {
	getNewsList()
})

// 搜索
const query = ref('')
const onSearch = () => {
	// 重置分页
	pageInfo.value.page = 1
	pageInfo.value.total = 0
	getNewsList()
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
				<button class="uni-button" type="warn" size="mini" :disabled="true">
					{{ $t('common.button.batchDelete') }}
				</button>
			</view>
		</view>
		<view class="uni-container">
			<el-table
				ref="tableRef"
				:data="newsList"
				v-loading="loading"
				stripe
				style="width: 100%"
				:row-style="{ height: '120px' }"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column prop="title" label="标题" show-overflow-tooltip />
				<el-table-column prop="image" label="缩略图" width="184" align="center">
					<template #default="{ row }">
						<el-image
							v-if="row.avatar"
							:src="row.avatar"
							fit="cover"
							style="height: 90px; display: block"
							lazy
							:preview-src-list="[row.avatar]"
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
				<el-table-column prop="status" label="是否推荐" width="80" align="center">
					<template #default="{ row }">
						<el-switch v-model="row.status" />
					</template>
				</el-table-column>
				<el-table-column prop="publish_date" label="发布时间" width="100" align="center">
					<template #default="{ row }">
						{{ dayjs(row.publish_date).format('YYYY-MM-DD') }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150" align="center" fixed="right">
					<el-button type="primary" text>{{ $t('common.button.edit') }}</el-button>
					<el-button type="danger" text style="margin-left: 0">
						{{ $t('common.button.delete') }}
					</el-button>
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
