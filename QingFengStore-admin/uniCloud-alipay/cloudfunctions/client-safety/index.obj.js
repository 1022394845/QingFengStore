// 安全
let dbJQL = uniCloud.databaseForJQL()
const { result } = require('utils')
const defaultError = result({ errCode: 500, errMsg: 'error', type: '服务器' })

const crypto = require('crypto')
const KEY = 'cWluZ2ZlbmdzdG9yZV8yMDI1dW5pYXBw' // 加密密钥
const IV = KEY.slice(-16)
// 加密
function encrypt(text = '') {
	if (!text) return null

	const cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV)

	const encrypted = Buffer.concat([cipher.update(Buffer.from(text, 'utf-8')), cipher.final()])
	return encrypted.toString('base64')
}
// 解密
function decrypt(text = '') {
	if (!text) return null

	const cipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV)

	const decrypted = Buffer.concat([cipher.update(Buffer.from(text, 'base64')), cipher.final()])
	return decrypted.toString('utf-8')
}

module.exports = {
	// 通用预处理器
	_before: function () {
		// 获取客户端信息
		const clientInfo = this.getClientInfo()
		dbJQL = uniCloud.databaseForJQL({ clientInfo })
	},

	/**
	 * @param {object} data 信息对象
	 * @param {string} user_id 用户id
	 * @param {string} [data.balance_password] 支付密码
	 * @returns {string} id 新增id
	 */
	async add(data) {
		if (!data.user_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '用户id不可为空' })

		try {
			// 对除了user_id之外的所有字段进行加密处理
			const encryptedData = Object.entries(data).reduce((acc, [key, value]) => {
				// 如果是user_id则直接保留，其他字段进行加密
				acc[key] = key === 'user_id' ? value : encrypt(value)
				return acc
			}, {})

			const { errCode, errMsg, id } = await dbJQL
				.collection('QingFengStore-safety')
				.add(encryptedData)

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '新增', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { id }, type: '新增' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 修改用户安全信息
	 * @param {object} data 信息对象
	 * @param {string} data.user_id 用户id
	 * @param {string} [data.balance_password] 支付密码
	 * @returns {number} updated 成功修改个数(无变化为0)
	 */
	async update(data) {
		if (!data.user_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '用户id不可为空' })

		try {
			// 对除了user_id之外的所有字段进行加密处理
			const { user_id, ...args } = Object.entries(data).reduce((acc, [key, value]) => {
				// 如果是user_id则直接保留，其他字段进行加密
				acc[key] = key === 'user_id' ? value : encrypt(value)
				return acc
			}, {})

			const { errCode, errMsg, updated } = await dbJQL
				.collection('QingFengStore-safety')
				.where(`user_id == "${user_id}"`)
				.update({ ...args })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '修改', custom: errMsg })
			return result({ errCode: 0, errMsg: 'success', data: { updated }, type: '修改' })
		} catch {
			return defaultError
		}
	},

	/**
	 * 判断用户是否已存在支付密码
	 * @param {string} user_id 用户id
	 * @returns {boolean} exist 是否存在
	 */
	async existBalancePassword(user_id) {
		if (!user_id)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '用户id不可为空' })

		try {
			const { errCode, errMsg, data } = await dbJQL
				.collection('QingFengStore-safety')
				.where(`user_id == "${user_id}"`)
				.field('balance_password')
				.get({ getOne: true })

			if (errCode !== 0) return result({ errCode, errMsg: 'fail', type: '获取', custom: errMsg })
			return result({
				errCode: 0,
				errMsg: 'success',
				data: { exist: data?.balance_password ? true : false },
				type: '获取'
			})
		} catch {
			return defaultError
		}
	},

	/**
	 * 验证支付密码
	 * @param {string} user_id 用户id
	 * @param {string} password 支付密码
	 * @returns {boolean} result 验证结果
	 */
	async verifyBalancePassword(user_id, password = '') {
		if (!user_id || !password)
			return result({ errCode: 400, errMsg: 'error', type: '请求', custom: '必要参数不可为空' })

		try {
			const { errCode, errMsg, data } = await dbJQL
				.collection('QingFengStore-safety')
				.where(`user_id == "${user_id}"`)
				.field('balance_password')
				.get({ getOne: true })

			if (errCode !== 0 || !data.balance_password)
				return result({ errCode, errMsg: 'fail', type: '验证', custom: errMsg })

			const encrypted = encrypt(password)

			return result({
				errCode: 0,
				errMsg: 'success',
				data: { result: encrypted === data.balance_password },
				type: '验证'
			})
		} catch {
			return defaultError
		}
	}
}
