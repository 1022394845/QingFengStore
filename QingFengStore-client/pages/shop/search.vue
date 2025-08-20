<script setup>
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
		<common-nav-bar title="搜索" titleColor="#ffffff"></common-nav-bar>
		<common-search
			v-model.trim="keyword"
			placeholder="请输入商品名称"
			@search="(newKeyword) => onSearch(newKeyword)"
		></common-search>
		<view class="wrapper">
			<view class="search-list">
				<goods-info-card v-for="item in goodsList" :key="item._id" :detail="item"></goods-info-card>
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
