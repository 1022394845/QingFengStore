<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { defaultNavBarHeight_px } from '@/utils/system.js'
const orderCloudObj = uniCloud.importObject('client-order', { customUI: true })

const currentNav = ref(0)
const navList = [
	{
		status: [-2, -1, 1, 2, 3, 4, 5, 6],
		name: '全部'
	},
	{
		status: [1],
		name: '待付款'
	},
	{
		status: [2],
		name: '待发货'
	},
	{
		status: [3],
		name: '运输中'
	},
	{
		status: [4],
		name: '待收货'
	},
	{
		status: [-2, 5, 6],
		name: '售后/退款'
	}
]
// 初始化标签栏
onLoad((e) => {
	if (e.status) {
		const target = Number(e.status)
		const index = navList.findIndex((item, index) => index > 0 && item.status.includes(target)) || 0
		currentNav.value = index
	}
})
const onChangeNav = (item) => {
	console.log(item.index)
	currentNav.value = item.index
}

// 订单列表
const pagingRef = ref(null)
const orderList = ref([])
const loadOrderList = async (page, pageSize) => {
	try {
		const uid = uniCloud.getCurrentUserInfo().uid || null
		const status = navList[currentNav.value]?.status || null
		const { errCode, data } = await orderCloudObj.list({ page, pageSize }, uid, status)

		if (errCode !== 0) throw new Error()
		pagingRef.value.complete(data)
	} catch {
		pagingRef.value.complete(false)
	}
}
</script>

<template>
	<view class="container">
		<z-paging
			ref="pagingRef"
			v-model="orderList"
			:default-page-size="6"
			@query="(page, pageSize) => loadOrderList(page, pageSize)"
		>
			<template #top>
				<uv-tabs
					:current="currentNav"
					:list="navList"
					:inactiveStyle="{ fontSize: '28rpx' }"
					:activeStyle="{ fontSize: '32rpx', color: '#bdaf8d' }"
					lineColor="#bdaf8d"
					lineWidth="40rpx"
					lineHeight="4rpx"
					@change="(item) => onChangeNav(item)"
				></uv-tabs>
			</template>

			<template #loading>
				<view class="loading" style="margin: 100rpx auto">
					<dot-loading>加载中</dot-loading>
				</view>
			</template>

			<view class="order-list">
				<view class="order-list_item" v-for="item in orderList" :key="item._id">
					{{ item._id }}
				</view>
			</view>
		</z-paging>
	</view>
</template>

<style scoped lang="scss">
.container {
	min-height: calc(100vh - v-bind(defaultNavBarHeight_px));
	background-color: #f9f9f9;
}
</style>
