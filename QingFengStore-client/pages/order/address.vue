<script setup>
import { ref } from 'vue'
import { useAddressStore } from '@/store/address.js'

const addressStore = useAddressStore()
addressStore.init()

// 地址编辑框
const addressEditorRef = ref(null)
/**
 * 开启地址编辑框
 * @param {object} [info] 编辑回显数据
 */
const openAddressPop = (info = null) => {
	if (!addressEditorRef.value) return
	addressEditorRef.value.open(info)
}
</script>

<template>
	<view class="container">
		<view class="wrapper">
			<view class="header">
				<view class="header_title">选择地址</view>
				<view class="header_add-address" @click="openAddressPop()">
					<view class="iconfont icon-add"></view>
					<view class="text">新增地址</view>
				</view>
			</view>

			<view class="address-list" v-if="addressStore.addressList.length">
				<view
					class="address-list_item"
					v-for="item in addressStore.addressList"
					:key="item._id"
					:class="{ active: item._id === addressStore.selectedAddress?._id }"
					@click="addressStore.select(item._id)"
				>
					<view class="address-list_item_info">
						<view class="address-list_item_info_base-address">{{ item.region }}</view>
						<view class="address-list_item_info_detail-address">{{ item.detail }}</view>
						<view class="address-list_item_info_note">
							<view class="address-list_item_info_note_contact">
								{{ `${item.name}  ${item.phone}` }}
							</view>
							<view
								class="address-list_item_info_note_tag"
								v-if="addressStore.defaultAddress._id === item._id"
							>
								默认
							</view>
						</view>
					</view>
					<view class="address-list_item_edit" @click.stop="openAddressPop(item)">
						<view class="iconfont icon-edit"></view>
					</view>
				</view>
			</view>

			<view class="empty" v-else>
				<template v-if="addressStore.loading">
					<dot-loading>加载中</dot-loading>
				</template>
				<template v-else>暂无地址</template>
			</view>
		</view>

		<!-- 地址编辑弹出框 -->
		<address-editor ref="addressEditorRef"></address-editor>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	width: 100%;
	min-height: calc(100vh - 44px);
	padding: 40rpx;
	background-color: #f3f4f6;

	.header {
		width: 100%;
		margin-bottom: 40rpx;
		display: flex;
		align-items: center;

		&_title {
			font-size: 32rpx;
			font-weight: bold;
		}

		&_add-address {
			margin-left: auto;
			display: flex;
			gap: 5rpx;
			align-items: center;
			font-size: 32rpx;
			color: $uni-color-primary;
		}
	}

	.address-list {
		width: 100%;

		&_item {
			width: 100%;
			height: fit-content;
			margin-bottom: 40rpx;
			padding: 40rpx;
			display: flex;
			gap: 20rpx;
			align-items: center;
			background-color: #ffffff;
			border-radius: 20rpx;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

			&.active {
				background: linear-gradient(to right, rgba($uni-color-primary, 0.8), #ffffff);
			}

			&_info {
				flex: 1;
				display: flex;
				flex-direction: column;
				gap: 10rpx;

				&_base-address {
					font-size: 28rpx;
					color: #666666;
				}

				&_detail-address {
					font-size: 34rpx;
					color: #000000;
				}

				&_note {
					display: flex;
					gap: 30rpx;
					align-items: center;

					&_contact {
						font-size: 30rpx;
						color: #000000;
					}

					&_tag {
						padding: 2rpx 8rpx;
						font-size: 22rpx;
						color: #ffffff;
						background-color: $uni-color-primary;
						border-radius: 5rpx;
					}
				}
			}

			&_edit {
				flex-shrink: 0;
				font-size: 32rpx;
				color: #333333;
			}
		}
	}
}

.empty {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 32rpx;
	color: #333333;
}
</style>
