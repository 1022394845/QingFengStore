<script setup>
import { onMounted, ref } from 'vue'
import { showMsg } from '@/utils/common.js'
import dayjs from 'dayjs'
import { useUserStore } from '@/store/user.js'
import { formatPrice } from '@/utils/format.js'

const balanceCloudObj = uniCloud.importObject('client-balance', { customUI: true })

const userStore = useUserStore()
onMounted(() => {
	userStore.getBalance()
})

const list = ref([])
const pagingRef = ref(null)
const loadBalanceList = async (page, pageSize) => {
	if (!pagingRef.value) return showMsg('未知错误，请刷新重试')
	try {
		const uid = uniCloud.getCurrentUserInfo().uid || null
		const { errCode, data, total } = await balanceCloudObj.list({ page, pageSize }, uid)
		if (errCode !== 0) throw new Error()
		pagingRef.value.completeByTotal(data, total)
	} catch {
		pagingRef.value.complete(false)
	}
}

// 充值
const onRecharge = async () => {
	const { cancel, content } = await uni.showModal({
		title: '充值',
		editable: true,
		placeholderText: '请输入兑换码',
		confirmColor: '#bdaf8d'
	})
	if (cancel || !content) return

	try {
		uni.showLoading({
			title: '充值中'
		})
		const { errCode, change } = await userStore.charge(content)
		if (errCode !== 0) throw new Error()

		showMsg(`充值成功：${formatPrice(change)}元`)
	} catch (err) {
		console.log(err)
		showMsg('充值失败')
	} finally {
		uni.hideLoading()
	}
}
</script>

<template>
	<view class="container">
		<z-paging
			ref="pagingRef"
			v-model="list"
			:default-page-size="5"
			:safe-area-inset-bottom="true"
			@query="(page, pageSize) => loadBalanceList(page, pageSize)"
		>
			<template #top>
				<view class="header">
					<view class="total">
						<view class="total_number">
							{{ formatPrice(userStore.userInfo.balance || 0) }}
						</view>
						<view class="total_text">当前余额</view>
					</view>
					<view class="charge-btn" @click="onRecharge">充值</view>
				</view>
			</template>

			<template #loading>
				<view class="loading" style="margin: 100rpx auto">
					<dot-loading>加载中</dot-loading>
				</view>
			</template>

			<view class="list">
				<view class="list_item" v-for="item in list" :key="item._id">
					<view class="list_item_info">
						<view class="list_item_info_type" :class="{ out: item.type === 2 }">
							{{ item.type === 1 ? '收入' : '支出' }}
						</view>
						<view class="list_item_info_text">编号：{{ item._id }}</view>
						<view class="list_item_info_text">
							时间：{{ dayjs(item.create_date).format('YYYY-MM-DD HH:mm:ss') }}
						</view>
						<view class="list_item_info_text ellipsis">备注：{{ item.comment }}</view>
					</view>
					<view class="list_item_change">
						{{ `${item.type === 1 ? '+' : '-'}${formatPrice(item.change)}` }}
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<style scoped lang="scss">
.header {
	position: relative;
	margin: 30rpx;

	.total {
		height: 220rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #ffffff;
		background-color: $uni-color-primary;
		border-radius: 10rpx 10rpx 0 0;
		text-align: center;

		&_number {
			font-size: 68rpx;
			font-weight: bold;
		}

		&_text {
			font-size: 28rpx;
		}
	}

	.charge-btn {
		position: absolute;
		top: 20rpx;
		left: 20rpx;
		color: rgba(#ffffff, 0.8);
		font-size: 32rpx;
	}
}

.list {
	padding: 30rpx;

	&_item {
		width: 100%;
		height: 220rpx;
		padding: 0 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: #efefef solid 4rpx;

		&_info {
			flex: 1;
			width: 0;

			&_type {
				margin-bottom: 10rpx;
				font-size: 42rpx;
				color: #00baad;

				&.out {
					color: #ff8d1a;
				}
			}

			&_text {
				width: 100%;
				font-size: 26rpx;
				color: #666666;
			}
		}

		&_change {
			flex-shrink: 0;
			font-size: 38rpx;
			color: #333333;
		}
	}
}
</style>
