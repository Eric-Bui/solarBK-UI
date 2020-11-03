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
    <div id="project-fullname">
      <p>{{projectFullName}}</p>
    </div>
    <b-container fluid>
    <b-row>
      <b-col sm="9">
        <b-row>
          <b-col sm="6">
            <div id="nhietdo-tb">
            <div class="nhietdo-nuoclanh">
              <b-img
                :src="getPicPath('icon-Nuoclanhdauvao.png')"
                alt="icon-nuoc-lanh"
                id="icon-nuoc-lanh"
              ></b-img>
              <p>NHIỆT ĐỘ NƯỚC LẠNH ĐẦU VÀO</p>
              <h5>{{Temp_Nuoclanh}} &#8451;</h5>
            </div>
            <div class="nhietdo-nuocnong">
              <b-img
                :src="getPicPath('icon-Nuocnongdaura.png')"
                alt="icon-nuoc-nong"
                id="icon-nuoc-nong"
              ></b-img>
              <p>NHIỆT ĐỘ NƯỚC NÓNG ĐẦU RA</p>
              <h5>{{Temp_Nuocnong}} &#8451;</h5>
            </div>
            </div>
          </b-col>
          <b-col sm="6">
            <div id="tong-luu-luong">
            <div class="data">
              <b-img
                :src="getPicPath('icon-TongNuocnongSudung.png')"
                alt="icon-tong-luu-luong"
                id="icon-tll"
              ></b-img>
              <p>TỔNG LƯỢNG NƯỚC NÓNG SỬ DỤNG TRONG THÁNG</p>
              <h5>{{TongLuuLuong_TrongThang}} L</h5>
            </div>
            <div class="tong-cong">
              <p>
                TỔNG SỐ:
                <strong id="tong-so-number">{{TongLuuLuong_TongCong}} L</strong>
              </p>
            </div>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="6">
            <div id="nang-luong-tiet-kiem">
            <div class="data">
              <b-img
                :src="getPicPath('icon-TongNangluongtietkiem.png')"
                alt="icon-nang-luong-tk"
                id="icon-nltk"
              ></b-img>
              <p>NĂNG LƯỢNG TIẾT KIỆM TRONG THÁNG</p>
              <h5>{{NangLuongTietKiem_TrongThang}} kWh</h5>
            </div>
            <div class="tong-cong">
              <p>
                TỔNG SỐ:
                <strong id="tong-so-number">{{NangLuongTietKiem_TongCong}} kWh</strong>
              </p>
            </div>
            </div>
          </b-col>
          <b-col sm="6">
            <div id="chi-phi-tiet-kiem">
            <div class="data">
              <b-img
                :src="getPicPath('icon-Chiphitietkiem.png')"
                alt="icon-chi-phi-tk"
                id="icon-cptk"
              ></b-img>
              <p>CHI PHÍ TIẾT KIỆM TRONG THÁNG</p>
              <br />
              <h5>{{ChiPhiTietKiem_TrongThang}} VNĐ</h5>
            </div>
            <div class="tong-cong">
              <p>
                TỔNG SỐ:
                <strong id="tong-so-number">{{ChiPhiTietKiem_TongCong}} VNĐ</strong>
              </p>
            </div>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col sm="3" id="overview-chart">
        <div id="pie-chart">
          <pieChart :chartdata="chartDataTLTK" :options="chartOptions"/>
        </div>
        <div id="ty-le-trong-ngay">
          <p>
            TỶ LỆ TIẾT KIỆM TRONG NGÀY:
            <strong id="tong-so-number">{{TyLeTietKiem_TrongThang}} %</strong>
          </p>
        </div>
      </b-col>
    </b-row>
    </b-container>
  </div>
  </div>
</template>

<script>
import pieChart from './pie-chart'
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

export default {
  name: 'overviewComponentSWH',
  props: {
    msg: String
  },
  components: {
    pieChart,
    SpinningGroup
  },
  data () {
    return {
      loaded: false,
      Temp_Nuoclanh: 0,
      Temp_Nuocnong: 0,
      TongLuuLuong_TrongThang: 0,
      TongLuuLuong_TongCong: 0,
      NangLuongTietKiem_TrongThang: 0,
      NangLuongTietKiem_TongCong: 0,
      ChiPhiTietKiem_TrongThang: 0,
      ChiPhiTietKiem_TongCong: 0,
      TyLeTietKiem_TrongThang: 0,
      chartDataTLTK: null,
      chartOptions: null,
      projectFullName: '',
      error: null,
      showErrorAlert: false
    }
  },
  mounted () {
    let token = checkAdminToken()
    this.$http.post(`${this.$store.state.apiURL}/getoverview`, {},
      { headers: {'authorization': token} })
      .then(response => {
        let pageData = response.data.data
        this.Temp_Nuoclanh = pageData.A1
        this.Temp_Nuocnong = pageData.A0
        this.TongLuuLuong_TrongThang = pageData.TLL_ByMonth
        this.TongLuuLuong_TongCong = pageData.TLL_ByTotal
        this.NangLuongTietKiem_TrongThang = pageData.NLTK_ByMonth
        this.NangLuongTietKiem_TongCong = pageData.NLTK_ByTotal
        this.ChiPhiTietKiem_TrongThang = pageData.CPTK_ByMonth
        this.ChiPhiTietKiem_TongCong = pageData.CPTK_ByTotal
        this.projectFullName = pageData.FullnameProject
        this.TyLeTietKiem_TrongThang = pageData.TLTK_ByMonth


        let chartFontSize;
        
        if (window.innerWidth > 2500 && window.innerWidth < 4040) {
          chartFontSize = 20
        } else if (window.innerWidth > 1400 && window.innerWidth <= 2500 ) {
          chartFontSize = 12
        } else if (window.innerWidth > 1020 && window.innerWidth <= 1400) {
          chartFontSize = 12
        } else if (window.innerWidth > 750 && window.innerWidth <= 1020) {
          chartFontSize = 10
        }
        this.chartDataTLTK = {
          datasets: [
            {
              data: [100 - pageData.TLTK_ByDay, pageData.TLTK_ByDay],
              backgroundColor: ['rgb(181, 47, 47)', 'rgb(48, 171, 77)'],
              datalabels: {
                align: 'center',
                color: 'white',
                font: {
                  size: chartFontSize,
                  weight: 'bold'
                },
                formatter: function(value) {
                  return  value + ' %';
                }
              }
            }
          ],
          labels: ['#', 'Tỷ lệ tiết kiệm trong tháng']
        }
        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: { titleFontSize: chartFontSize, bodyFontSize: chartFontSize },
          legend: {
            labels: {
              fontColor: 'black',
              fontSize: chartFontSize
            }
          }
        }
        // console.log(response)
        this.loaded = true
      })
      .catch(err => {
        // console.log(err.response)
        if (err.response === undefined) {
          this.error = 'Không thể kết nối tới Server'
          this.showErrorAlert = true
          this.loaded = true
        } else {
          let errMsg = err.response.data.message
          this.error = errMsg
          this.showErrorAlert = true
          this.loaded = true
        }
      })
  },
  methods: {
    getPicPath: (picName) => {
      let picPath = require(`../../../assets/images/${picName}`)
      return picPath
    }
  }
}
</script>

<style scoped>
#project-fullname {
  text-align: right;
  margin: 10px 0;
  border-bottom: 1px solid black;
}

#icon-nuoc-lanh,
#icon-nuoc-nong,
#icon-tll,
#icon-nltk,
#icon-cptk {
  float: left;
  width: 20%;
}

#errorAlert {
  margin-top: 10px;
}

#nhietdo-tb,
#tong-luu-luong,
#nang-luong-tiet-kiem,
#chi-phi-tiet-kiem {
  border: 1px solid #b3b3b3;
  text-align: right;
  border-radius: 15px;
  font-size: 12px;
  width: 100%;
  padding: 10px 10px;
  margin: 10px 0;
  height: 200px;
  background-color: #f2f2f2;
}

.nhietdo-nuoclanh,
.nhietdo-nuocnong,
.data,
.tong-cong {
  margin: 10px 0;
}

h5 {
  font-size: 25px;
  font-weight: bold;
}

.nhietdo-nuoclanh,
.data {
  border-bottom: 1px solid #b3b3b3;
  padding-bottom: 10px;
}

#tong-so-number {
  font-size: 18px;
}

#overview-chart {
  border-radius: 15px;
  border: 1px solid #b3b3b3;
  text-align: center;
  padding: 0 0 !important;
  margin: 10px 0;
  background-color: #f2f2f2;
}

#ty-le-trong-ngay {
    margin-top: 10px;
    background-color: #3489ba;
    color: white;
    width: 100%;
}

#ty-le-trong-ngay p {
    margin-block-start: 0px !important;
    margin-block-end: 0px !important;
    padding: 15px 0;
    font-size: 13px;
}

</style>
