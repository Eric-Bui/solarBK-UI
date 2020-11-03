<script>
import { Bar } from 'vue-chartjs'
import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import zoom from 'chartjs-plugin-zoom'
Chart.plugins.unregister(ChartDataLabels)

export default {
  name: `productionChart`,
  extends: Bar,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.addPlugin(zoom)
    this.addPlugin(ChartDataLabels)
    this.renderChart(this.chartdata, this.options)
  }
}
</script>

<style scoped>
</style>
