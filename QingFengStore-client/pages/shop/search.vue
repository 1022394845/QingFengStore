<script setup>
import CommonNavBar from '@/components/CommonNavBar.vue'
import CommonSearch from '@/components/CommonSearch.vue'
import GoodsInfoCard from '@/components/GoodsInfoCard.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { showMsg } from '@/utils/common.js'
const goodsCloudObj = uniCloud.importObject('client-goods', { customUI: true })

const keyword = ref('')
onLoad((e) => {
	if (e.keyword?.trim()) onSearch(e.keyword.trim())
})

const goodsList = ref([])

const onSearch = async (newKeyword) => {
	if (newKeyword) {
		keyword.value = newKeyword
		try {
			const { errCode, data } = await goodsCloudObj.goods({ keyword: newKeyword })
			if (errCode !== 0) throw new Error()
			goodsList.value = data
		} catch {
			return showMsg('获取商品失败')
		}
	}
}
</script>

<template>
	<view class="container">
		<CommonNavBar title="搜索" titleColor="#ffffff"></CommonNavBar>
		<CommonSearch
			v-model.trim="keyword"
			placeholder="请输入商品名称"
			@search="(newKeyword) => onSearch(newKeyword)"
		></CommonSearch>
		<view class="wrapper">
			<view class="search-list">
				<GoodsInfoCard v-for="item in goodsList" :key="item._id" :detail="item"></GoodsInfoCard>
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
