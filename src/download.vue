<template>
	<el-dialog v-model="dialogVisible" title="Tips" width="500">
		<el-form
			:inline="true"
			:model="savaData"
			class="demo-form-inline"
			:rules="dataRulse"
			ref="formRef"
		>
			<el-form-item label="保存名" prop="name">
				<el-input v-model="savaData.name" placeholder="请输入名字"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="confirmSave"> 确定 </el-button>
			</div>
		</template>
	</el-dialog>
</template>
<script setup>
	import { ref } from 'vue'
	const dialogVisible = ref(false)
	const savaData = ref({
		name: ''
	})
	const dataRulse = ref({
		name: [{ required: true, message: '请输入保存名', trigger: 'blur' }]
	})
	const emit = defineEmits(['confirmSave'])
	const file = ref('')
	const open = (blob) => {
		dialogVisible.value = true
		file.value = blob
	}
	const formRef = ref(null)
	const confirmSave = () => {
		formRef.value.validate((valid) => {
			if (valid) {
				const url = URL.createObjectURL(file.value)
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', savaData.value.name)
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				dialogVisible.value = false
				emit('confirmSave', savaData.value.name)
			}
		})
	}
	defineExpose({ open })
</script>

<style lang="scss" scoped></style>
