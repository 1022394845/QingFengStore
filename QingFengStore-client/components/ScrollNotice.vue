<script setup></script>

<template>
	<view class="scroll-notice">
		<view class="scroll-notice_prefix">
			<image
				class="scroll-notice_prefix_icon"
				src="/static/notic_prefix.png"
				mode="aspectFill"
			></image>
		</view>
		<view class="scroll-notice_list">
			<swiper
				class="scroll-notice_list_swiper"
				vertical
				autoplay
				:interval="5000"
				:duration="1000"
				circular
			>
				<swiper-item class="scroll-notice_list_swiper_item">
					<view class="scroll-notice_list_swiper_item_content ellipsis">公告内容</view>
				</swiper-item>
				<swiper-item class="scroll-notice_list_swiper_item">
					<view class="scroll-notice_list_swiper_item_content ellipsis">
						公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="scroll-notice_suffix">
			<uni-icons type="forward" color="#888888" size="32rpx"></uni-icons>
		</view>
	</view>
</template>

<style scoped lang="scss">
.scroll-notice {
	display: flex;
	align-items: center;

	&_prefix {
		flex-shrink: 0;
		display: flex;
		align-items: center;

		&_icon {
			width: 88rpx;
			height: 40rpx;
			display: block;
		}
	}

	&_list {
		flex: 1;
		margin-left: 20rpx;

		&_swiper {
			height: 40rpx;

			&_item {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;

				&_content {
					width: 100%;
					font-size: 32rpx;
					color: #333333;
				}
			}
		}
	}

	&_subfix {
		flex-shrink: 0;
		width: 80rpx;
	}
}
</style>
