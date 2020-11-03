<script>
import { Line } from 'vue-chartjs'
import zoom from 'chartjs-plugin-zoom'

export default {
  name: `lineProductionChart`,
  extends: Line,
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
    this.renderChart(this.chartdata, this.options)
  }
}
</script>

<style scoped>
</style>