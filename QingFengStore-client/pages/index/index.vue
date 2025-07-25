<script setup>
import CommonNavBar from '@/components/CommonNavBar.vue'
import CommonSearch from '@/components/CommonSearch.vue'
</script>

<template>
	<view class="container">
		<CommonNavBar title="首页" titleColor="#ffffff"></CommonNavBar>
		<CommonSearch placeholder="请输入商品名称"></CommonSearch>
		<view class="" v-for="item in 50">
			{{ item }}
		</view>
	</view>
</template>

<style scoped lang="scss"></style>
