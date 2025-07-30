<script setup>
import { computed, ref } from 'vue'
import GoodsCard from '@/components/GoodsCard.vue'
import NumberBox from '@/components/NumberBox.vue'
import { useCartStore } from '@/store/cart'

const props = defineProps({
	detail: {
		type: Object,
		required: true
	}
})
const emits = defineEmits(['close'])

const currentGoodsSkuId = defineModel('currentGoodsSkuId', { type: String, default: '' })
const onChangeSku = (id) => {
	currentGoodsSkuId.value = id
}
const currentSkuInfo = computed(
	() => props.detail.sku?.find((item) => item._id === currentGoodsSkuId.value) || {}
)

// 选择数量
const count = ref(1)

// 创建信息
const createInfo = () => {
	if (!currentGoodsSkuId.value) throw new Error('缺少商品规格参数')
	return {
		...props.detail,
		sku: { ...currentSkuInfo.value },
		count: count.value
	}
}

const cartStore = useCartStore()
// 加入购物车
const onCart = () => {
	const data = createInfo()
	cartStore.addGoods(data)
	emits('close')
}

// 立即购买
const onBuy = () => {
	const res = createInfo()
	console.log(res)
	emits('close')
}
</script>

<template>
	<view class="goods-sku-container">
		<GoodsCard :detail="detail" :sku="currentSkuInfo" :config="1"></GoodsCard>
		<!-- SKU列表 -->
		<view class="goods-sku">
			<view class="goods-sku_label label">规格</view>
			<view class="goods-sku_list">
				<view
					class="goods-sku_list_item"
					v-for="item in detail.sku"
					:key="item._id"
					:class="{ active: item._id === currentGoodsSkuId }"
					@click="onChangeSku(item._id)"
				>
					{{ item.name }}
				</view>
			</view>
		</view>
		<!-- 步进器 -->
		<view class="goods-count">
			<view class="goods-count_label label">数量</view>
			<NumberBox v-model="count"></NumberBox>
		</view>
		<!-- 操作 -->
		<view class="goods-btn-group">
			<view class="goods-btn cart" @click="onCart">加入购物车</view>
			<view class="goods-btn buy" @click="onBuy">立即购买</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.goods-sku-container {
	.label {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}

	.goods-sku {
		margin-top: 44rpx;

		&_list {
			margin-top: 20rpx;
			display: flex;
			flex-wrap: wrap;
			gap: 28rpx;

			&_item {
				width: fit-content;
				height: 40rpx;
				padding: 0 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24rpx;
				color: #666666;
				background-color: #f4f4f4;
				border-radius: 10rpx;

				&.active {
					color: #ffffff;
					background-color: $uni-color-primary;
				}
			}
		}
	}

	.goods-count {
		margin-top: 44rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.goods-btn-group {
		margin-top: 100rpx;
		display: flex;
		align-items: center;

		.goods-btn {
			flex: 1 1 0;
			width: 100%;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			color: #ffffff;

			&.cart {
				background-color: #ff9300;
				border-radius: 40rpx 0 0 40rpx;
			}

			&.buy {
				background-color: #ef5350;
				border-radius: 0 40rpx 40rpx 0;
			}
		}
	}
}
</style>
