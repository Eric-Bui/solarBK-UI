<script>
import { Bar } from 'vue-chartjs'
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.plugins.unregister(ChartDataLabels);

export default {
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
    this.addPlugin(ChartDataLabels)
    this.renderChart(this.chartdata, this.options)
  }
}
</script>
