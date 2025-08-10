<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { DomEditor } from '@wangeditor/editor'
import { FileToUploadObject, uploadImage } from '@/utils/upload'
import { showMsg } from '@/utils/common'
import { ElLoading } from 'element-plus'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const content = defineModel({ type: String, default: '' })

const toolbarConfig = {
	excludeKeys: ['group-video', 'fullScreen']
}
const editorConfig = {
	placeholder: '请输入内容...',
	MENU_CONF: {
		// 上传图片
		uploadImage: {
			// 自定义上传
			async customUpload(file, insertFn) {
				const loading = ElLoading.service({
					lock: true,
					text: '上传中',
					background: 'rgba(0, 0, 0, 0.7)'
				})
				const fileObject = FileToUploadObject(file)
				try {
					await uploadImage(fileObject)
					insertFn(fileObject.cloudUrl, fileObject.url, fileObject.cloudUrl)
				} catch {
					showMsg('上传失败，请稍后再试', 'error')
				} finally {
					loading.close()
				}
			}
		}
	}
}

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
	const editor = editorRef.value
	if (editor == null) return
	editor.destroy()
})

const handleCreated = (editor) => {
	editorRef.value = editor // 记录 editor 实例
}

const mode = 'default' // 编辑器模式
</script>

<template>
	<link rel="stylesheet" href="static/css/rich-text-editor-style.css" />
	<view class="rich-text-editor">
		<div style="border: 1px solid #ccc">
			<Toolbar
				style="border-bottom: 1px solid #ccc"
				:editor="editorRef"
				:defaultConfig="toolbarConfig"
				:mode="mode"
			/>
			<Editor
				style="height: 500px; overflow-y: hidden"
				v-model="content"
				:defaultConfig="editorConfig"
				:mode="mode"
				@onCreated="handleCreated"
			/>
		</div>
		{{ content }}
	</view>
</template>

<style scoped lang="scss"></style>
