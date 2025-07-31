<script>
export default {
	onLaunch: function () {
		console.log('App Launch')
	}
}
</script>

<style>
/*每个页面公共css */
@import url('static/icon-font/iconfont.css');

view {
	box-sizing: border-box;
}

.wrapper {
	width: 100%;
	overflow: hidden;
}

.image {
	display: block;
	width: 100%;
	height: 100%;
}

.icon-container {
	display: flex;
	justify-content: center;
	align-items: center;
}

.ellipsis {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
}

.ellipsis-2 {
	word-break: break-all;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	overflow: hidden;
}
</style>
