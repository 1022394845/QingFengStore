<script setup>
import CommonNavBar from '@/components/CommonNavBar.vue'
import CommonSearch from '@/components/CommonSearch.vue'
import GoodsInfoCard from '@/components/GoodsInfoCard.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const keyword = ref('')
onLoad((event) => {
	if (event.keyword) onSearch(event.keyword)
})
const onSearch = (newKeyword) => {
	if (newKeyword) keyword.value = newKeyword
	console.log(keyword.value)
}
</script>

<template>
	<view class="container">
		<CommonNavBar title="搜索" titleColor="#ffffff"></CommonNavBar>
		<CommonSearch
			v-model="keyword"
			placeholder="请输入商品名称"
			@search="(newKeyword) => onSearch(newKeyword)"
		></CommonSearch>
		<view class="wrapper">
			<view class="search-list">
				<GoodsInfoCard v-for="item in 7"></GoodsInfoCard>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	padding: 32rpx;

	.search-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(316rpx, 1fr));
		gap: 30rpx;
	}
}
</style>
