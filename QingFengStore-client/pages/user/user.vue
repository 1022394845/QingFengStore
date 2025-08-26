<script setup>
import { useUserStore } from '@/store/user.js'
import { routerTo } from '@/utils/router.js'
import { tabBarHeight_px, navBarHeight_px, safeareaHeight_px } from '@/utils/system.js'

const userStore = useUserStore()
userStore.init()

const userMenuList = [
	{
		icon: 'icon-calendar',
		label: '每日签到',
		note: '积分+1'
	},
	{
		icon: 'icon-point',
		label: '我的余额',
		note: '当前3258'
	},
	{
		icon: 'icon-assessed-badge',
		label: '会员认证',
		note: '已完成认证'
	}
]

const orderMenuList = [
	{
		status: 1,
		icon: 'icon-wallet',
		label: '待付款'
	},
	{
		status: 2,
		icon: 'icon-package',
		label: '待发货'
	},
	{
		status: 3,
		icon: 'icon-transportation',
		label: '运输中'
	},
	{
		status: 4,
		icon: 'icon-bag',
		label: '待收货'
	},
	{
		status: 5,
		icon: 'icon-refund-fill',
		label: '售后/退款'
	}
]

const menuList = [
	{
		icon: 'icon-calendar-fill',
		label: '签到记录',
		note: '已签到10天'
	},
	{
		icon: 'icon-safe-fill',
		label: '安全管理',
		note: '修改支付密码',
		click: () => {
			// 前往安全管理页面
			routerTo('/pages/user/safety/safety')
		}
	},
	{
		icon: 'icon-location-fill',
		label: '收货地址',
		note: '管理收货地址',
		click: () => {
			// 前往地址管理页面
			routerTo('/pages/order/address')
		}
	},
	{
		icon: 'icon-reduce-fill',
		label: '退出登录',
		note: '退出当前账号',
		click: () => userStore.logout()
	}
]
</script>

<template>
	<view class="container">
		<common-nav-bar title="我的" titleColor="#ffffff"></common-nav-bar>
		<view class="wrapper">
			<view class="user">
				<view class="user_info">
					<view class="user_info_avatar">
						<image
							class="image"
							:src="
								userStore.userInfo.avatar_file
									? userStore.userInfo.avatar_file
									: '/static/defAvatar.png'
							"
							mode="aspectFill"
						></image>
					</view>
					<view class="user_info_text">
						<view class="user_info_text_name">
							<view class="user_info_text_name_nickname ellipsis">
								{{ userStore.userInfo.nickname }}
							</view>
							<view class="user_info_text_name_tag vip" v-if="true">高级会员</view>
							<view class="user_info_text_name_tag normal" v-else>普通用户</view>
						</view>
						<view class="user_info_text_id">ID: {{ userStore.userInfo._id }}</view>
					</view>
				</view>
				<view class="user_menu">
					<view class="user_menu_item" v-for="item in userMenuList" :key="item.status">
						<view class="user_menu_item_icon icon-container">
							<view class="iconfont" :class="item.icon"></view>
						</view>
						<view class="user_menu_item_label">{{ item.label }}</view>
						<view class="user_menu_item_note">{{ item.note }}</view>
					</view>
				</view>
			</view>
			<view class="order">
				<view class="order_header">
					<view class="order_header_text">我的订单</view>
					<view class="order_header_note" @click="routerTo('/pages/user/order')">查看全部订单</view>
					<view class="order_header_more iconfont icon-more"></view>
				</view>
				<view class="order_list">
					<view
						class="order_list_item"
						v-for="item in orderMenuList"
						:key="item.label"
						@click="routerTo(`/pages/user/order?status=${item.status}`)"
					>
						<view class="order_list_item_icon">
							<view class="iconfont" :class="item.icon"></view>
							<view class="order_list_item_icon_tag" v-if="userStore.orderCount[item.status]">
								{{ userStore.orderCount[item.status] }}
							</view>
						</view>
						<view class="order_list_item_label">{{ item.label }}</view>
					</view>
				</view>
			</view>
			<view class="menu">
				<view
					class="menu_item"
					v-for="item in menuList"
					:key="item.label"
					@click="item.click && item.click()"
				>
					<view class="menu_item_icon icon-container">
						<view class="iconfont" :class="item.icon"></view>
					</view>
					<view class="menu_item_label">{{ item.label }}</view>
					<view class="menu_item_note">{{ item.note }}</view>
					<view class="menu_item_more iconfont icon-more"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.wrapper {
	min-height: calc(
		100vh - v-bind(tabBarHeight_px) - v-bind(navBarHeight_px) - v-bind(safeareaHeight_px)
	);
	padding: 26rpx;
	background-color: #f9f9f9;

	.user {
		width: 100%;
		height: 360rpx;
		padding: 40rpx 34rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-radius: 10rpx;
		background-color: #ffffff;

		&_info {
			width: 100%;
			height: 100rpx;
			display: flex;
			gap: 32rpx;
			align-items: center;

			&_avatar {
				flex-shrink: 0;
				height: 100%;
				aspect-ratio: 1 / 1;
				border-radius: 50%;
				overflow: hidden;
			}

			&_text {
				flex: 1 1 0;
				width: 0;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;

				&_name {
					width: 100%;
					height: 48rpx;
					display: flex;
					gap: 20rpx;
					align-items: center;

					&_nickname {
						font-size: 36rpx;
						font-weight: bold;
						line-height: 48rpx;
					}

					&_tag {
						flex-shrink: 0;
						padding: 4rpx 16rpx;
						font-size: 22rpx;
						border-radius: 20rpx;

						&.vip {
							color: #ae6337;
							background-color: #eccc7d;
						}

						&.normal {
							color: #333333;
							background-color: #e3e3e3;
						}
					}
				}

				&_id {
					font-size: 24rpx;
					color: #666666;
				}
			}
		}

		&_menu {
			display: flex;
			justify-content: space-around;

			&_item {
				text-align: center;

				&_icon .iconfont {
					font-size: 50rpx;
					color: $uni-color-primary;
				}

				&_label {
					margin-top: 10rpx;
					font-size: 28rpx;
					font-weight: bold;
				}

				&_note {
					font-size: 20rpx;
					color: #888888;
				}
			}
		}
	}

	.order {
		width: 100%;
		height: 240rpx;
		margin-top: 30rpx;
		background-color: #ffffff;

		&_header {
			height: 80rpx;
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2rpx solid #f4f4f4;

			&_text {
				font-size: 32rpx;
				color: #666666;
			}

			&_note {
				margin-left: auto;
				font-size: 28rpx;
				color: #999999;
			}

			&_more {
				font-size: 28rpx;
				color: #999999;
			}
		}

		&_list {
			height: 160rpx;
			padding: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&_item {
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				&_icon {
					position: relative;

					.iconfont {
						font-size: 42rpx;
						color: #000000;
					}

					&_tag {
						position: absolute;
						top: -10%;
						left: 55%;
						min-width: 28rpx;
						height: 28rpx;
						padding: 10rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 18rpx;
						color: #ffffff;
						background-color: $uni-color-primary;
						border-radius: 50%;
					}
				}

				&_label {
					margin-top: 10rpx;
					font-size: 28rpx;
				}
			}
		}
	}

	.menu {
		margin-top: 32rpx;
		background-color: #ffffff;

		&_item {
			height: 90rpx;
			padding: 0 28rpx;
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #f4f4f4;
			&:last-child {
				border-bottom: none;
			}

			&_icon .iconfont {
				font-size: 36rpx;
				color: $uni-color-primary;
			}

			&_label {
				margin-left: 15rpx;
				font-size: 32rpx;
			}

			&_note {
				margin-left: auto;
				font-size: 28rpx;
				color: #999999;
			}

			&_more {
				font-size: 28rpx;
				color: #999999;
			}
		}
	}
}
</style>
