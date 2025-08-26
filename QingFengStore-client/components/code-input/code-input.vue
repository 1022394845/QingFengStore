<script setup>
const props = defineProps({
	disabled: {
		type: Boolean,
		default: false
	}
})
const value = defineModel()
const emits = defineEmits(['finish'])
</script>

<template>
	<view class="code-input">
		<uv-code-input
			v-model="value"
			dot
			focus
			size="70rpx"
			space="20rpx"
			borderColor="#bdaf8d"
			:disabledKeyboard="disabled"
			@finish="emits('finish')"
		></uv-code-input>
	</view>
</template>

<style scoped lang="scss">
.code-input {
	display: flex;
	justify-content: center;
}
</style>
