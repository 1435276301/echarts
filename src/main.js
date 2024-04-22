import { createApp } from 'vue'
import App from './App.vue'
// echarts
import 'echarts'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart, LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import {
	TitleComponent,
	TooltipComponent,
	LegendComponent
} from 'echarts/components'

use([
	TitleComponent,
	TooltipComponent,
	LegendComponent,
	PieChart,
	LineChart,
	CanvasRenderer
])

const app = createApp(App)
app.component('v-chart', ECharts)
app.mount('#app')
