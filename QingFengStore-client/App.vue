<script>
export default {
	onLaunch: function () {
		console.log('App Launch')
	}
}
</script>

<style>
/*每个页面公共css */
view {
	box-sizing: border-box;
}

.wrapper {
	width: 100%;
	padding: 20rpx 32rpx;
}

.ellipsis {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
}
</style>
