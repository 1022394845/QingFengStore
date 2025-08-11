<script setup>
import { nextTick, onBeforeMount, ref } from 'vue'
import { getFileSuffix, isHttpUrl, showMsg, urlToBlob } from '@/utils/common.js'
import { uploadImage } from '@/utils/upload'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

const props = defineProps({
	// 图片宽度
	width: {
		type: String,
		default: '200px'
	},
	// 图片长宽比
	ratio: {
		type: String,
		default: '1 / 1'
	},
	// 单次上传数量限制
	limit: {
		type: Number,
		default: 9
	}
})

const emits = defineEmits(['remove'])

const fileList = defineModel()
const uploadRef = ref(null)

// 移除图片
const onRemove = (file) => {
	if (!fileList.value) return showMsg('未知错误，请刷新页面重试', 'error')
	uploadRef.value.handleRemove(file)
	emits('remove')
}
// 上传图片
const upload = () => {
	const result = fileList.value.map((file, index) => {
		if (file.status === 'success') {
			// 已经成功上传，无需再传
			return Promise.resolve(file)
		}
		return uploadImage(file, index)
	})
	return Promise.all(result)
}
defineExpose({ upload })

// 图片裁剪
const showModal = ref(false)
const cropper = ref(null)
const currentFile = ref(null)
const currentImage = ref(null)
const openCropper = async (file) => {
	if (!file.url) return showMsg('未知错误，请稍后再试', 'error')
	file.type = getFileSuffix(file.raw || file.url) // 获取文件后缀
	currentFile.value = file
	currentImage.value = file.url

	try {
		if (isHttpUrl(file.url)) {
			// 网络地址避免跨域
			const blob = await urlToBlob(file.url)
			currentImage.value = URL.createObjectURL(blob)
		}
	} catch {
		return showMsg('获取图片失败，请刷新重试', 'error')
	}

	nextTick(() => {
		showModal.value = true
		if (props.ratio) {
			// 设置截图框默认比例
			currentCropOp.value = cropOpList.find((item) => item.content === props.ratio)?.id || 1
			setCropRatio(props.ratio)
			nextTick(() => {
				cropper.value.goAutoCrop()
			})
		}
	})
}
const closeCropper = () => {
	showModal.value = false
}

// 确认裁剪
const onCrop = async () => {
	await cropper.value.getCropBlob((blob) => {
		if (!currentFile.value.uid) return showMsg('未知错误，请稍后再试', 'error')
		// 将裁剪数据附加到原对象的属性crop上
		const uid = currentFile.value.uid
		const target = fileList.value.find((item) => item.uid === uid)
		if (!target) return showMsg('未知错误，请稍后再试', 'error')
		target.cropType = getFileSuffix(blob.type)
		target.cropUrl = URL.createObjectURL(blob)
		// 重置文件状态
		if (target.exist) delete target.exist
		target.status = 'ready'
	})
	closeCropper()
}

// 裁剪操作
const currentCropOp = ref(1)
const cropOpList = [
	{ id: 1, type: 'icon', icon: 'FullScreen', content: '' },
	{ id: 2, type: 'text', content: '1 / 1' },
	{ id: 3, type: 'text', content: '9 / 16' },
	{ id: 4, type: 'text', content: '4 / 3' },
	{ id: 5, type: 'text', content: '16 / 9' },
	{ id: 6, type: 'icon', icon: 'RefreshLeft', content: '', immediate: true }
]
const cropperConfig = ref({
	fixed: false, // 是否开启截图框宽高固定比例
	fixedNumber: [1, 1] // 截图框的宽高比例
})
// 设置截图框宽高比
const setCropRatio = (ratio) => {
	if (!ratio) cropperConfig.value.fixed = false
	else {
		cropperConfig.value.fixed = true
		const parts = ratio.split('/')
		// 处理两边的空格并转换为数字
		if (parts.length === 2) {
			const width = parseInt(parts[0].trim())
			const height = parseInt(parts[1].trim())
			cropperConfig.value.fixedNumber = [width, height]
		} else return showMsg('未知错误，请稍后再试', 'error')
	}
}
const onCropOp = (id) => {
	const target = cropOpList.find((item) => item.id === id)
	// crop操作
	if (id < 6) {
		// 截图框宽高比设置
		setCropRatio(target.content)
		nextTick(() => {
			cropper.value.goAutoCrop()
		})
	} else if (id === 6) {
		// 图片左旋
		cropper.value.rotateLeft()
	}
	// 更改currentCropOp
	if (target.immediate) return
	currentCropOp.value = id
}
</script>

<template>
	<view class="upload-image">
		<!-- 文件容器 -->
		<el-scrollbar class="upload-container" max-height="250px">
			<el-upload
				ref="uploadRef"
				v-model:file-list="fileList"
				list-type="picture-card"
				:limit="limit"
				:auto-upload="false"
				:width="width"
				:ratio="ratio"
				:on-change="(file) => openCropper(file)"
			>
				<el-icon><Plus /></el-icon>
				<template #file="{ file }">
					<div class="image-container">
						<img class="el-upload-list__item-thumbnail" :src="file.cropUrl || file.url" alt="" />
						<span class="el-upload-list__item-actions">
							<span class="el-upload-list__item-delete" @click="openCropper(file)">
								<el-icon><Edit /></el-icon>
							</span>
							<span class="el-upload-list__item-delete" @click="onRemove(file)">
								<el-icon><Delete /></el-icon>
							</span>
						</span>
						<div class="progress" v-if="!file.exist && file.status !== 'ready'">
							<el-progress
								type="circle"
								:percentage="file.percentage"
								:status="['success', 'exception'].includes(file.status) ? file.status : null"
							/>
						</div>
					</div>
				</template>
			</el-upload>
		</el-scrollbar>

		<!-- 图像裁剪 -->
		<transition name="el-fade-in">
			<view class="cropper-modal" v-if="showModal">
				<view class="cropper-container">
					<view class="cropper">
						<vue-cropper
							ref="cropper"
							:img="currentImage"
							:outputSize="1"
							:outputType="'webp'"
							:autoCrop="true"
							:centerBox="true"
							:fixed="cropperConfig.fixed"
							:fixedNumber="cropperConfig.fixedNumber"
							style="width: 100%; height: 100%"
						></vue-cropper>
					</view>
					<view class="op-group">
						<el-button
							v-for="btn in cropOpList"
							:key="btn.id"
							class="op-item"
							:class="{ active: btn.id === currentCropOp }"
							type="primary"
							plain
							@click="onCropOp(btn.id)"
						>
							<el-icon v-if="btn.type === 'icon'">
								<component :is="btn.icon" />
							</el-icon>
							<template v-else>{{ btn.content }}</template>
						</el-button>
					</view>
					<view class="btn-group">
						<el-button @click="closeCropper">取消</el-button>
						<el-button type="primary" @click="onCrop">确认</el-button>
					</view>
				</view>
			</view>
		</transition>
	</view>
</template>

<style scoped lang="scss">
.upload-image {
	width: 100%;
}

.upload-container {
	width: 100%;

	:deep(.el-upload-list__item) {
		width: v-bind('props.width');
		height: auto;
		aspect-ratio: v-bind('props.ratio');

		.image-container {
			position: relative;
			width: 100%;
			height: 100%;

			.progress {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0.7);
				container-type: size;

				.el-progress {
					width: min(80cqw, 80cqh);
					height: min(80cqw, 80cqh);

					.el-progress-circle {
						width: 100% !important;
						height: 100% !important;
					}

					.el-progress__text {
						color: #ffffff;
					}
				}
			}
		}
	}

	:deep(.el-upload--picture-card) {
		width: v-bind('props.width');
		height: auto;
		aspect-ratio: v-bind('props.ratio');
		margin: 0 8px 8px 0;
	}
}

.cropper-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.7);
	z-index: 9999;

	.cropper-container {
		min-width: 30%;
		min-height: 20%;
		max-height: 80%;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		background-color: #ffffff;
		border-radius: 10px;
		overflow: hidden;

		.cropper {
			flex: 1;
			height: 0;
			aspect-ratio: 1 / 1;
		}

		.op-group {
			flex-shrink: 0;
			margin-top: auto;
			display: flex;
			gap: 10px;

			.op-item {
				width: fit-content;
				height: fit-content;
				padding: 10px;

				&.active {
					color: var(--el-color-white);
					background-color: var(--el-color-primary);
					border-color: var(--el-color-primary);
				}
			}
		}

		.btn-group {
			flex-shrink: 0;
			display: flex;
			justify-content: center;
			gap: 20px;
			align-items: center;
		}
	}
}
</style>
