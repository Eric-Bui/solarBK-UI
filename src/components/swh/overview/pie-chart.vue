<script>
import { Pie } from 'vue-chartjs'
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.plugins.unregister(ChartDataLabels);

export default {
  extends: Pie,
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
    this.addPlugin(ChartDataLabels)
    this.renderChart(this.chartdata, this.options)
  }
}
</script>

<style>
</style>
