<script setup>
import { routerTo } from '@/utils/router.js'
import { ref } from 'vue'

// 搜索
const query = ref('')
const search = () => {
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
				<button class="uni-button hide-on-phone" type="default" size="mini" @click="search">
					{{ $t('common.button.search') }}
				</button>
				<button class="uni-button" type="primary" size="mini" @click="routerTo('./add')">
					{{ $t('common.button.add') }}
				</button>
				<button class="uni-button" type="warn" size="mini" :disabled="true" @click="delTable">
					{{ $t('common.button.batchDelete') }}
				</button>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss"></style>
