<template>
	<el-dialog
		v-model="dialogVisible"
		title="请选择点位"
		width="80%"
		@close="close"
	>
		<div style="width: 100%; height: 60vh">
			<v-chart
				ref="chartRef"
				:option="chartData"
				v-if="chartData"
				@click="selectPoint"
			></v-chart>
		</div>
	</el-dialog>
</template>
<script setup>
	import { computed, nextTick, ref } from 'vue'
	const emit = defineEmits(['closeDialog'])
	const dialogVisible = ref(false)
	const chartData = ref('')
	const open = (data, point) => {
		dialogVisible.value = true
		nextTick(() => {
			chartData.value = data
		})
		pointData.value.pointName = point
	}
	const pointData = ref({
		point: '',
		pointName: ''
	})
	const selectPoint = (e) => {
		pointData.value.point = e.dataIndex
		emit('closeDialog', pointData.value)
		dialogVisible.value = false
	}
	const close = () => {
		dialogVisible.value = false
	}
	defineExpose({
		open
	})
</script>

<style lang="scss" scoped></style>
