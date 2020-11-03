<template>
  <div>
  <div v-if="!loaded">
    <SpinningGroup></SpinningGroup>
  </div>
  <div v-if="loaded">
    <div>
      <b-alert
      show
      dismissible
      fade
      variant="danger"
      v-model="showErrorAlert"
      id="errorAlert"
    >
      {{error}}
    </b-alert>
    </div>
    <div id="chart" class="grid grid-1-3">
      <h6>TỔNG LƯỢNG NƯỚC SỬ DỤNG</h6>
      <bar-chart :chartdata="chartDataTLL" :options="chartOptions" :width="300" :height="400"/>
    </div>
    <div id="chart" class="grid grid-1-3">
      <h6>NĂNG LƯỢNG TIẾT KIỆM</h6>
      <bar-chart :chartdata="chartDataNLTK" :options="chartOptions" :width="300" :height="400"/>
    </div>
    <div id="chart" class="grid grid-1-3">
      <h6>TỶ LỆ TIẾT KIỆM ĐIỆN NĂNG THEO NGÀY</h6>
      <bar-chart :chartdata="chartDataTLTK" :options="chartOptions" :width="300" :height="400"/>
    </div>
  </div>
  </div>
</template>

<script>
import barChart from './bar-chart.vue'
import SpinningGroup from '../../spinning.vue'

function checkAdminToken () {
  let token
  if (localStorage.getItem('jwt') != null) {
    token = localStorage.getItem('jwt')
  } else {
    token = sessionStorage.getItem('jwt')
  }
  return token
}

let dataTLL = []
for (let n = 1; n <= 12; n++) {
  dataTLL.push(n)
}

export default {
  name: `summaryChart`,
  components: {
    barChart,
    SpinningGroup
  },
  data: () => {
    return {
      chartDataTLL: null,
      chartDataNLTK: null,
      chartDataTLTK: null,
      chartOptions: null,
      loaded: false,
      error: null,
      showErrorAlert: false
    }
  },

  async mounted () {
    let token = checkAdminToken()
    this.$http
      .post(
        `${this.$store.state.apiURL}/statisticchart`,
        {},
        { headers: { authorization: token } }
      )
      .then(response => {
        console.log(response)
        let arrayTLL = response.data.data.TLL
        let arrayNLTK = response.data.data.NLTK
        let arrayTLTK = response.data.data.TLTK
        let date = arrayTLL.map(items => items.Date)
        let dataTLL = arrayTLL.map(items => items.TongLuuLuong)
        let dataNLTK = arrayNLTK.map(items => items.NangLuongTietKiem)
        let dataTLTK = arrayTLTK.map(items => items.TyLeTietKiem)
        let fontSize;
        let barThickness;
        if(window.innerWidth > 2500 && window.innerWidth < 4500) {
          fontSize = 20;
          barThickness = 40;
        } else if (window.innerWidth > 1400 && window.innerWidth <= 2500) {
          fontSize = 10;
          barThickness = 20;
        } else if (window.innerWidth > 1020 && window.innerWidth <= 1400) {
          fontSize = 9;
          barThickness = 15;
        } else if (window.innerWidth > 750 && window.innerWidth <= 1020) {
          fontSize = 8;
          barThickness = 10;
        } else if (window.innerWidth > 420 && window.innerWidth <= 750) {
          fontSize = 7;
          barThickness = 5;
        } else if (window.innerWidth > 350 && window.innerWidth <= 420) {
          fontSize = 6;
          barThickness = 4;
        } else if (window.innerWidth > 310 && window.innerWidth <= 350) {
          fontSize = 5;
          barThickness = 3;
        }
        this.chartDataTLL = {
          datasets: [
            {
              barPercentage: 1,
              barThickness: barThickness,
              maxBarThickness: barThickness,
              minBarLength: 2,
              data: dataTLL,
              backgroundColor: 'rgb(31, 158, 255)',
              datalabels: {
                align: 'center',
                color: 'black',
                backgroundColor: 'white',
                font: {
                  size: fontSize,
                  weight: 'bold'
                },
                formatter: function(value) {
                  return  value;
                }
              }
            }
          ],
          labels: date
        }
        this.chartDataNLTK = {
          datasets: [
            {
              barPercentage: 1,
              barThickness: barThickness,
              maxBarThickness: barThickness,
              minBarLength: 2,
              data: dataNLTK,
              backgroundColor: 'rgb(31, 158, 255)',
              datalabels: {
                align: 'center',
                color: 'black',
                backgroundColor: 'white',
                font: {
                  size: fontSize,
                  weight: 'bold'
                },
                formatter: function(value) {
                  return  value;
                }
              }
            }
          ],
          labels: date
        }
        this.chartDataTLTK = {
          datasets: [
            {
              barPercentage: 1,
              barThickness: barThickness,
              maxBarThickness: barThickness,
              minBarLength: 2,
              data: dataTLTK,
              backgroundColor: 'rgb(31, 158, 255)',
              datalabels: {
                align: 'center',
                color: 'black',
                backgroundColor: 'white',
                font: {
                  size: fontSize,
                  weight: 'bold'
                },
                formatter: function(value) {
                  return  value + ' %';
                }
              }
            }
          ],
          labels: date
        }

        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  fontSize: fontSize
                },
                gridLines: {
                  display: true
                }
              }
            ],
            xAxes: [
              {
                ticks: {
                  fontSize: fontSize
                },
                gridLines: {
                  display: true
                }
              }
            ]
          }
        }
        this.loaded = true
      })
      .catch(err => {
        if (err.response === undefined) {
          this.error = 'Không thể kết nối tới Server'
          this.showErrorAlert = true
          this.loaded = true
        } else {
          let errMsg = err.response.data.message
          this.error = errMsg
          this.showErrorAlert = true
        }
      })
  },
  methods: {}
}
</script>

<style scoped>
#errorAlert {
  margin-top: 10px;
}

#chart h6 {
  font-weight: bold;
  margin-top: 15px;
}

#chart {
  border-top: 1px solid;
}

</style>
