<script setup>
import { routerTo } from '@/utils/router.js'
import { dayjs } from 'element-plus'
import { ref } from 'vue'

// 资讯列表
const newsList = ref([
	{
		title: '标题',
		image: null,
		author: '作者',
		viewNum: 50,
		status: true,
		createTime: 1754394564000
	}
])

// 搜索
const query = ref('')
const onSearch = () => {
	console.log(query.value)
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
					v-model="query"
					@confirm="search"
					:placeholder="$t('common.placeholder.query')"
				/>
				<button class="uni-button hide-on-phone" type="default" size="mini" @click="onSearch">
					{{ $t('common.button.search') }}
				</button>
				<button class="uni-button" type="primary" size="mini" @click="routerTo('./add')">
					{{ $t('common.button.add') }}
				</button>
				<button class="uni-button" type="warn" size="mini" :disabled="true">
					{{ $t('common.button.batchDelete') }}
				</button>
			</view>
		</view>
		<view class="uni-container">
			<el-table :data="newsList" stripe style="width: 100%">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="title" label="标题" show-overflow-tooltip />
				<el-table-column prop="image" label="缩略图" width="120" align="center" />
				<el-table-column
					prop="author"
					label="发布者"
					width="150"
					align="center"
					show-overflow-tooltip
				/>
				<el-table-column
					prop="viewNum"
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
				<el-table-column prop="createTime" label="发布时间" width="100" align="center">
					<template #default="{ row }">
						{{ dayjs(row.createTime).format('YYYY-MM-DD') }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="155" align="center" fixed="right">
					<el-button type="primary" text>{{ $t('common.button.edit') }}</el-button>
					<el-button type="danger" text>{{ $t('common.button.delete') }}</el-button>
				</el-table-column>
			</el-table>
			<el-pagination background layout="prev, pager, next" :total="1000" />
		</view>
	</view>
</template>

<style scoped lang="scss"></style>
