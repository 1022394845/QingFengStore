// 云存储
module.exports = {
	_before: function () {
		// 通用预处理器
	},
	/**
	 * 通过fileIds移除云存储内容
	 * @param {string[]} fileIds 图片云端fileId数组
	 */
	remove: async (fileIds) => {
		return await uniCloud.deleteFile({
			fileList: fileIds
		})
	}
}
