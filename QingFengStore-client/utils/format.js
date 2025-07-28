/**
 * 将分转换为元并格式化为带两位小数的价格
 * @param {number} price - 以分为单位的价格
 * @param {number} digit - 格式化位数，默认为2
 * @returns {string} 格式化后的价格字符串，如 "123.45"
 */
export const formatPrice = (price = 0, digit = 2) => {
	if (typeof price !== 'number') price = parseInt(price)
	if (isNaN(price)) return '暂无价格'
	return (price / 100).toFixed(digit)
}
