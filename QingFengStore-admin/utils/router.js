/**
 * 路由跳转
 * @param {string} url - 跳转地址
 * @param {string} type - 跳转方式
 */
export function routerTo(url, type = 'navigateTo') {
	if (!url) {
		return uni.reLaunch({
			url: '/pages/index/index'
		})
	}
	switch (type) {
		case 'reLaunch':
			uni.reLaunch({
				url
			})
			break
		case 'navigateTo':
			uni.navigateTo({
				url,
				fail: (err) => {
					routerTo(url, 'reLaunch')
				}
			})
			break
		case 'redirectTo':
			uni.redirectTo({
				url,
				fail: (err) => {
					routerTo(url, 'reLaunch')
				}
			})
			break
		default:
			uni.reLaunch({
				url
			})
			break
	}
}

// 路由返回
export function routerBack() {
	uni.navigateBack({
		fail: (err) => {
			routerTo()
		}
	})
}
