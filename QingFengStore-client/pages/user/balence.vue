<script setup>
import { ref } from 'vue'
import { showMsg } from '@/utils/common.js'
import dayjs from 'dayjs'

const mock = [
	{
		_id: '1',
		score: 20,
		type: 1,
		comment: '余额充值',
		create_date: '2025-08-26 14:23:00'
	},
	{
		_id: '2',
		score: 5,
		type: 2,
		comment: '商品消费',
		create_date: '2025-08-26 16:58:00'
	},
	{
		_id: '3',
		score: 15,
		type: 2,
		comment: '商品消费',
		create_date: '2025-08-26 22:31:00'
	},
	{
		_id: '4',
		score: 100,
		type: 1,
		comment: '余额充值',
		create_date: '2025-08-27 09:18:00'
	},
	{
		_id: '5',
		score: 30,
		type: 2,
		comment: '商品消费',
		create_date: '2025-08-27 16:11:00'
	}
]
const list = ref([])
const pagingRef = ref(null)
const loadBalenceList = async (page, pageSize) => {
	if (!pagingRef.value) return showMsg('未知错误，请刷新重试')
	try {
		// const { errCode, data, total } = await newsCloudObj.list({ page, pageSize })
		// if (errCode !== 0) throw new Error()
		// pagingRef.value.completeByTotal(data, total)
		setTimeout(() => {
			pagingRef.value.completeByTotal(mock, 15)
		}, 1000)
	} catch {
		pagingRef.value.complete(false)
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
			@query="(page, pageSize) => loadBalenceList(page, pageSize)"
		>
			<template #top>
				<view class="header">
					<view class="total">
						<view class="total_number">
							{{ '9999' }}
						</view>
						<view class="total_text">当前余额</view>
					</view>
					<view class="charge-btn">充值</view>
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
					<view class="list_item_score">
						{{ `${item.type === 1 ? '+' : '-'}${item.score}` }}
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

		&_score {
			flex-shrink: 0;
			font-size: 38rpx;
			color: #333333;
		}
	}
}
</style>
