// 钩子函数 hooks/index.js

function beforeRegister({ userRecord, clientInfo } = {}) {
	// 设置默认昵称
	if (!userRecord.nickname)
		userRecord.nickname = '匿名用户' + Math.random().toString(36).substring(3, 9)

	return userRecord // 务必返回处理后的userRecord
}

module.exports = {
	beforeRegister
}
