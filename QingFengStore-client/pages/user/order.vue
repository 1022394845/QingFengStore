<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { defaultNavBarHeight_px } from '@/utils/system.js'
import { debounce, showMsg } from '@/utils/common.js'
const orderCloudObj = uniCloud.importObject('client-order', { customUI: true })

const currentNav = ref(0)
const navList = [
	{
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
const reload = () => {
	if (pagingRef.value) pagingRef.value.reload()
}
// 切换tab时重新加载数据 防抖500ms
const onChangeNav = debounce((item) => {
	currentNav.value = item.index
	reload()
}, 500)

// 订单列表
const pagingRef = ref(null)
const orderList = ref([])
const loadOrderList = async (page, pageSize) => {
	if (!pagingRef.value) return showMsg('未知错误，请刷新重试')

	try {
		const uid = uniCloud.getCurrentUserInfo().uid || null
		const status = navList[currentNav.value]?.status || null
		const { errCode, data, total } = await orderCloudObj.list({ page, pageSize }, uid, status)

		if (errCode !== 0) throw new Error()
		pagingRef.value.completeByTotal(data, total)
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
			:auto-hide-loading-after-first-loaded="false"
			:safe-area-inset-bottom="true"
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
					:itemStyle="{ height: '88rpx' }"
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
					<order-card :detail="item" @success="reload"></order-card>
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

.order-list {
	width: 100%;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	gap: 40rpx;
}
</style>
