<script setup>
	import { computed, onMounted, reactive, ref, toRef, watch } from 'vue'
	import { debounce } from 'lodash'
	import Dialog from './dialog.vue'
	import Download from './download.vue'
	import { ElMessage } from 'element-plus'
	// import arr from './data'
	let arr = localStorage.getItem('arr')
		? localStorage
				.getItem('arr')
				.split(',')
				.map((item) => parseInt(item))
		: []
	const list = ref([])
	const init = () => {
		list.value = arr
		formInline.endPoint = list.value.length
	}
	const formInline = reactive({
		lineWidth: 2,
		multiple: 1,
		numberMin: 0,
		numberMax: 0,
		operation: '*',
		unit: 1,
		color: '#38b569',
		startPoint: '',
		endPoint: '',
		minPoint: [15, 15],
		maxPoint: [-20, -15]
	})
	// 倍数 默认为1 默认为乘法
	// list.value = multiple(list.value, formInline.multiple, formInline.operation) // 倍数 默认为1 默认为乘法

	// 从哪个数据开始计算
	let markPointMin = Math.min(...list.value)
	let markPointMax = list.value[list.value.length]
	// list.value = compute(0, list.value.length) // 从哪个数据开始计算 默认为0
	// let minPoint = [15, 15] // 最小值数字的位置
	// let maxPoint = [-20, -15] // 最大值数字的位置

	function multiple(data, mu = 1, plication = '*') {
		if (plication === '*') {
			return data.map((item) => item * mu)
		} else if (plication === '/') {
			return data.map((item) => item / mu)
		} else if (plication === '+') {
			return data.map((item) => item + mu)
		} else if (plication === '-') {
			return data.map((item) => item - mu)
		}
	}
	// 是否显示最大与最小值
	function isShow() {
		if (formInline.lineWidth > 2) {
			return false
		} else {
			return true
		}
	}

	function compute(min, max) {
		let newData = arr.slice(min, max)
		if (min || max) {
			markPointMin = Math.min(...newData)
			markPointMax = Math.max(...newData)
		}
		return newData
	}
	const vchat = ref(null)
	onMounted(() => {
		init()
		window.addEventListener('resize', () => {
			vchat.value.resize()
		})
	})
	const operation = ref([
		{
			label: '乘法',
			value: '*'
		},
		{
			label: '除法',
			value: '/'
		},
		{
			label: '加法',
			value: '+'
		},
		{
			label: '减法',
			value: '-'
		}
	])

	const unit = ref([
		{
			label: '$',
			value: 1
		},
		{
			label: '￥',
			value: 0
		}
	])
	const colors = ref([
		{
			label: '红色',
			value: '#f84b73'
		},
		{
			label: '绿色',
			value: '#38b569'
		}
	])
	const options = computed(() => {
		return {
			xAxis: {
				show: false,
				type: 'category'
				// data: ['1', '2', '3', '4', '5', '6', '7', '6', '7']
			},
			yAxis: {
				type: 'value',
				show: false,
				min: markPointMin,
				max: markPointMax
			},
			textStyle: {
				fontFamily: 'HarmonyOS Sans,HarmonyOS Sans SC,PingFang SC',
				fontSize: 16
			},
			tooltip: {
				trigger: 'axis'
			},
			series: [
				{
					data: list.value,
					type: 'line',
					smooth: false,
					symbol: 'circle',
					symbolSize: 10,
					showSymbol: false,
					itemStyle: {
						color: formInline.color
					},
					lineStyle: {
						width: +formInline.lineWidth > 2 ? +formInline.lineWidth : 2
					},
					markPoint: {
						data: [
							{
								type: 'min',
								symbolSize: 0,
								symbolOffset: formInline.minPoint,
								label: {
									color: '#707070',
									show: isShow(),
									formatter: function (params) {
										return (
											(formInline.unit === 1 ? '$' : '{value|￥}') +
											addCommas(
												formInline.numberMin == 0
													? params.value
													: formInline.numberMin
											)
										)
									},
									rich: {
										value: {
											padding: [0, -3]
										}
									}
								}
							},
							{
								type: 'max',
								symbolSize: 0,
								symbolOffset: formInline.maxPoint,
								label: {
									color: '#707070',
									show: isShow(),
									formatter: function (params) {
										return (
											(formInline.unit === 1 ? '$' : '{value|￥}') +
											addCommas(
												formInline.numberMax == 0
													? params.value
													: formInline.numberMax
											)
										)
									},
									rich: {
										value: {
											padding: [0, -3]
										}
									}
								}
							}
						]
					}
				}
			]
		}
	})
	function addCommas(number) {
		let str = number.toString()
		// 将字符串分割为整数部分和小数部分（如果有）
		let parts = str.split('.')
		let integerPart = parts[0]
		let decimalPart =
			parts.length > 1 ? '.' + parts[1].slice(0, 2) : ''.slice(0, 3)

		// 处理整数部分
		let integerArr = integerPart.split('').reverse()
		let result = []

		for (let i = 0; i < integerArr.length; i++) {
			if (i > 0 && i % 3 === 0) {
				result.push(',')
			}
			result.push(integerArr[i])
		}
		// 将整数部分处理结果反转并转换为字符串
		let formattedInteger = result.reverse().join('')
		// 返回处理后的结果（整数部分+小数部分）
		decimalPart =
			parts.length < 3 && parts.length > 2 ? decimalPart + '0' : decimalPart
		return formattedInteger + decimalPart
	}

	watch(formInline, () => {
		vchat.value.resize()
	})
	watch([() => formInline.multiple, () => formInline.operation], (newValue) => {
		list.value = multiple(arr, +newValue[0], newValue[1])
	})
	const dialogRef = ref(null)
	const startPointRef = ref(null)
	const endPoint = ref(null)
	const selectPoint = (potion) => {
		dialogRef.value.open(options.value, potion)
	}
	const closeDialog = (e) => {
		formInline[`${e.pointName}Point`] = e.point
		list.value = compute(formInline.startPoint, formInline.endPoint)
	}
	const changeStartPoint = (e) => {
		if (e && e >= 0) {
			list.value = compute(e, formInline.endPoint)
		}
	}
	const changeEndPoint = (e) => {
		if (e && e >= 0) {
			list.value = compute(formInline.startPoint, e)
		}
	}
	const clearStartPoint = () => {
		formInline.startPoint = 0
		changeStartPoint('0')
	}
	const clearEndPoint = () => {
		formInline.endPoint = arr.length
		changeEndPoint(arr.length + '')
	}

	const text = ref(localStorage.getItem('arr') || [])
	// 防抖
	const changeArr = debounce((e) => {
		let newArr = e.split(',').map((item) => parseInt(item))
		arr = newArr
		init()
	}, 300)
	const downloadRef = ref(null)
	function saveData() {
		const blob = new Blob([text.value], {
			type: 'text/plain;charset=utf-8'
		})
		downloadRef.value.open(blob)
	}
	const readFile = (event) => {
		const file = event.target.files[0]
		if (!file) {
			return
		}

		const reader = new FileReader()
		reader.onload = (e) => {
			let newArr = e.target.result.split(',').map((item) => parseInt(item))
			arr = newArr
			text.value = newArr
			init()
		}
		reader.readAsText(file)
	}

	const confirmSave = (e) => {
		localStorage.setItem('arr', JSON.parse(JSON.stringify(arr)))
	}
</script>

<template>
	<div class="common-layout">
		<el-container style="height: 100%">
			<el-header height="150px">
				<el-form :inline="true" :model="formInline" class="demo-form-inline">
					<el-row>
						<el-col>
							<el-form-item label="线宽">
								<el-input
									v-model="formInline.lineWidth"
									type="number"
									placeholder="线宽默认为2"
									clearable
								/>
							</el-form-item>
							<el-form-item label="最小值">
								<el-input
									v-model="formInline.numberMin"
									placeholder="最小值默认为0"
									clearable
								/>
							</el-form-item>
							<el-form-item label="最大值">
								<el-input
									v-model="formInline.numberMax"
									placeholder="最大值默认为0"
									clearable
								/>
							</el-form-item>
							<!-- <el-form-item label="倍数">
								<el-input
									v-model="formInline.multiple"
									placeholder="默认为1"
									type="number"
								/>
								<el-select
									placeholder="默认为乘法"
									v-model="formInline.operation"
								>
									<el-option
										v-for="item in operation"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									></el-option>
								</el-select>
							</el-form-item> -->
							<el-form-item label="单位">
								<el-select
									placeholder="默认为美元"
									v-model="formInline.unit"
									style="width: 100px"
								>
									<el-option
										v-for="item in unit"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="线条颜色">
								<el-select
									v-model="formInline.color"
									style="width: 150px"
									placeholder="默认为绿色"
								>
									<el-option
										v-for="item in colors"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="起点">
								<el-input
									placeholder="请点击曲线选择起点"
									v-model="formInline.startPoint"
									@input="changeStartPoint"
									ref="startPointRef"
									type="number"
									clearable
									@clear="clearStartPoint"
								>
									<template #append>
										<el-button @click="selectPoint('start')"
											>打开点位</el-button
										></template
									></el-input
								>
							</el-form-item>
							<el-form-item label="终点">
								<el-input
									placeholder="请点击曲线选择终点"
									v-model="formInline.endPoint"
									ref="endPointRef"
									type="number"
									@input="changeEndPoint"
									clearable
									@clear="clearEndPoint"
								>
									<template #append>
										<el-button @click="selectPoint('end')">打开点位</el-button>
									</template>
								</el-input>
							</el-form-item>
							<el-row>
								<el-col>
									<el-form-item label="最低值标签位置">
										<el-input
											placeholder="左右"
											v-model="formInline.minPoint[0]"
											ref="endPointRef"
											type="number"
											style="width: 100px"
										>
										</el-input>
										<el-input
											placeholder="上下"
											v-model="formInline.minPoint[1]"
											ref="endPointRef"
											type="number"
											style="width: 100px"
										>
										</el-input>
									</el-form-item>
									<el-form-item label="最高值标签位置">
										<el-input
											placeholder="左右"
											v-model="formInline.maxPoint[0]"
											ref="endPointRef"
											style="width: 100px"
											type="number"
										>
										</el-input>
										<el-input
											placeholder="上下"
											v-model="formInline.maxPoint[1]"
											ref="endPointRef"
											type="number"
											style="width: 100px"
										>
										</el-input>
									</el-form-item>
								</el-col>
							</el-row>
						</el-col>
					</el-row>
				</el-form>
			</el-header>

			<el-container>
				<el-aside width="40%">
					<input type="file" @change="readFile" />
					<el-input
						v-model="text"
						style="width: 100%,height:100%"
						type="textarea"
						placeholder="请输入数据"
						@input="changeArr"
					/>
					<el-row>
						<el-col>
							<el-button type="primary" @click="saveData">保存数据</el-button>
						</el-col>
					</el-row>
				</el-aside>
				<el-main style="height: 100%; width: 60%">
					<v-chart :option="options" ref="vchat"></v-chart>
				</el-main>
			</el-container>
		</el-container>
		<Dialog ref="dialogRef" @closeDialog="closeDialog" />
		<Download ref="downloadRef" @confirmSave="confirmSave" />
	</div>
</template>

<style scoped lang="scss">
	.common-layout {
		width: 100%;
		height: 90vh;
		margin: 0 auto;
		text-align: center;
		:deep(.el-textarea) {
			height: 80%;
			.el-textarea__inner {
				height: 100%;
			}
		}
	}
</style>
