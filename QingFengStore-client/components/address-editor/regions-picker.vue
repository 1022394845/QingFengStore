<script setup>
import { computed, onMounted, ref } from 'vue'
import regions from './regions.json'
import { showMsg, throttle } from '@/utils/common.js'

const provinces = ref([]) // 省
const citys = ref([]) // 市
const areas = ref([]) // 区
const pickerValue = ref([0, 0, 0])
const defaultValue = [3442, 1, 2]
const pickerRef = ref(null)

const regionsList = computed(() => {
	return [provinces.value, citys.value, areas.value]
})

// 设置默认地区
const handlePickValueDefault = () => {
	if (!pickerRef.value) return

	// 设置省
	pickerValue.value[0] = provinces.value.findIndex((item) => Number(item.id) === defaultValue[0])

	// 设置市
	citys.value = provinces.value[pickerValue.value[0]]?.children || []
	pickerValue.value[1] = citys.value.findIndex((item) => Number(item.id) === defaultValue[1])

	// 设置区
	areas.value = citys.value[pickerValue.value[1]]?.children || []
	pickerValue.value[2] = areas.value.findIndex((item) => Number(item.id) === defaultValue[2])

	// 重置地区
	pickerRef.value.setIndexs(
		[pickerValue.value[0], pickerValue.value[1], pickerValue.value[2]],
		true
	)
}

// 选择改变事件 节流200ms
const change = throttle((e) => {
	const { columnIndex, index, indexs } = e

	// 改变了省
	if (columnIndex === 0) {
		citys.value = provinces.value[index]?.children || []
		areas.value = citys.value[0]?.children || []
		pickerRef.value?.setIndexs([index, 0, 0], true)
	}
	// 改变了市
	else if (columnIndex === 1) {
		areas.value = citys.value[index]?.children || []
		pickerRef.value?.setIndexs(indexs, true)
	}
}, 200)

// 初始化数据
const init = () => {
	provinces.value = regions.sort((left, right) => (Number(left.code) > Number(right.code) ? 1 : -1))
	handlePickValueDefault()
}
init()

// 打开选择器
const open = () => {
	if (!pickerRef.value) return showMsg('未知错误，请稍后再试')
	pickerRef.value.open()
	handlePickValueDefault()
}
defineExpose({ open })

// 确认选择
const emits = defineEmits(['confirm'])
const confirm = (e) => {
	const data = e.value.map((item) => ({ id: item.id, code: item.code, name: item.name }))
	emits('confirm', data)
}
</script>

<template>
	<uv-picker
		ref="pickerRef"
		:columns="regionsList"
		keyName="name"
		title="选择地区"
		confirmColor="#bdaf8d"
		@change="change"
		@confirm="confirm"
	></uv-picker>
</template>

<style scoped lang="scss"></style>
