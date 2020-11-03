<template>
  <div>
      <div>
        <b-alert
          show
          dismissible
          fade
          variant="danger"
          v-model="showErrorAlert"
          id="errorAlert"
        >{{error}}</b-alert>
      </div>
      <div id="project-fullname">
        <p>{{projectFullName}}</p>
      </div>
      <b-container fluid>
        <b-overlay
        :show="thongso_overlay"
        rounded="sm">
        <template v-slot:overlay>
            <spinning-group></spinning-group>
        </template>
        <b-container fluid>
        <b-row>
          <b-col sm="8">
            <b-row>
              <b-col sm="6">
                <div class="fixed-content">
                <div id="tong-luu-luong">
                  <div class="data-congsuat">
                    <b-img
                      fluid
                      :src="getPicPath('icon-CongsuatPV.png')"
                      alt="icon-cong-suat-tuc-thoi"
                      id="icon-tll"
                    ></b-img>
                    <p>{{$t('overviewPVpage.pvpowerwidget')}}</p>
                    <h5>{{TongCSTT}} kW</h5>
                  </div>
                  <div class='fixed-content1'>
                    <b-container fluid>
                    <b-row>
                    <b-col sm="6" class="tong-cong" v-for="item in inverter" :key="item.Module">
                      <p><b-icon-house-door-fill></b-icon-house-door-fill>
                        <strong id="tong-so-number">{{item.Module}}: {{item.CSTT}} kW</strong>
                      </p>
                      <ul>
                        <li v-for="inv in item.Inverter" :key="inv.id">
                          <strong>{{inv.id}}: {{inv.data}} kW</strong>
                        </li>
                      </ul>
                    </b-col>
                    </b-row>
                    </b-container>
                  </div>
                  <div id="cong-suat-tai" v-if="deviceType === 'PV-SMA-OffGrid1'">
                      <b-img
                        :src="getPicPath('icon-Congsuattai.png')"
                        alt="icon-cong-suat-tai"
                        id="icon-tll"
                      ></b-img>
                      <p>{{$t('overviewPVpage.pvloadwidget')}}</p>
                      <h5>{{TongCSLOAD}} kW</h5>
                    </div>
                </div>
                </div>
              </b-col>
              <b-col sm="6">
                <div class="fixed-content">
                <div id="nhietdo-tb">
                  <div class="nhietdo-nuoclanh">
                    <b-img
                      :src="getPicPath('icon-TongNangluongtietkiem.png')"
                      alt="icon-nang-luong-tiet-kiem"
                      id="icon-nuoc-lanh"
                    ></b-img>
                    <p>{{$t('overviewPVpage.todayproduction')}}</p>
                    <h5>{{TodayProduction}} kWh</h5>
                  </div>
                  <div class="nhietdo-nuocnong">
                    <b-img
                      :src="getPicPath('icon-DienSXNgay.png')"
                      alt="icon-nang-luong-san-xuat"
                      id="icon-nuoc-nong"
                    ></b-img>
                    <p>{{$t('overviewPVpage.totalproduction')}}</p>
                    <h5>{{TotalProduction}} kWh</h5>
                    
                    <div class="tariff-3-prices" v-if="tariffAvailable">
                      <h6>{{$t('overviewPVpage.tariff3')}}</h6>
                      <ul>
                        <li><b>{{$t('overviewPVpage.highpoint')}}: </b> {{ sumTarifHigh}} kWh</li>
                        <li><b>{{$t('overviewPVpage.mediumpoint')}}: </b> {{ sumTarifNormal }} kWh</li>
                        <li><b>{{$t('overviewPVpage.lowpoint')}}: </b> {{ sumTarifLow }} kWh</li>
                      </ul>
                    </div>
                  </div>
                   <div class="" v-if="deviceType=='Sungrow'">
                    <b-img
                      :src="getPicPath('ratio-icon.png')"
                      alt="icon-pr"
                      id="icon-nuoc-nong"
                    ></b-img>
                    <p>PR</p>
                    <h5>{{prCalculate}} %</h5>
                  </div>
                  <div class="su-dung-trong-ngay" v-if="deviceType === 'MultiPVSofar1'">
                    <b-img
                      :src="getPicPath('icon-Dientieuthu.png')"
                      alt="icon-nang-luong-san-xuat"
                      id="icon-nuoc-nong"
                    ></b-img>
                    <p>{{$t('overviewPVpage.pvloadused')}}</p>
                    <h5>{{smartBuildingData.ToLoadToday}} kWh</h5>
                    <p>{{$t('mostused.total')}} {{$t('overviewPVpage.pvloadused')}}: <strong>{{smartBuildingData.ToLoadTotal}} kWh</strong></p>
                  </div>
                  <div class="su-dung-trong-ngay" v-if="deviceType === 'PV-SMA-OffGrid1'">
                    <p>{{$t('overviewPVpage.pvloadused')}}</p>
                    <p style="display: inline">{{$t('mostused.today')}}:</p><h5 style="display: inline"> {{todayConsump}} kWh</h5><br>
                    <p style="display: inline">{{$t('mostused.total')}}:</p><h5 style="display: inline"> {{totalConsump}} kWh</h5>
                  </div>
                </div>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="6">
                <div class="fixed-content">
                <div id="chi-phi-tiet-kiem">
                  <div class="data-congsuat">
                    <b-img
                      :src="getPicPath('icon-Chiphitietkiem.png')"
                      alt="icon-chi-phi-tk"
                      id="icon-cptk"
                    ></b-img>
                    <p>{{labelTTTK}}</p>
                    <h5 v-if="deviceType === 'Amata'">{{AmataMoney}} VNĐ</h5>
                    <br />
                    <p v-if="deviceType === 'Amata'">{{$t('mostused.total')}} {{$t('overviewPVpage.moneysave')}}: <strong>{{totalSaveMoney}}</strong> VNĐ</p>
                    <h5 v-else>{{totalSaveMoney}} VNĐ</h5>
                  </div>
                  <div class="tong-cong">
                    <p>
                      <i v-if="device === 'hd'">(*) {{$t('overviewPVpage.contractpride')}}: </i>
                      <i v-if="device === 'tk'">(*) {{$t('overviewPVpage.referpride')}}: </i>
                      <strong id="tong-so-number">{{price}} VNĐ</strong>
                      <i v-if="device === 'hd'">{{$t('overviewPVpage.vat')}}</i>
                    </p>
                  </div>
                  <div class="giamthai-co2">
                    <b-img
                      :src="getPicPath('icon-CO2.png')"
                      alt="icon-giam-co2"
                      id='icon-cptk'>
                    </b-img>
                    <p v-html="$t('overviewPVpage.co2reduct')"></p>
                    <br />
                    <h5>{{totalCarbon}} {{$t('overviewPVpage.ton')}}</h5>
                  </div>
                </div>
                </div>
              </b-col>
              <b-col sm="6">
                <div class="fixed-content">
                <div id="nang-luong-tiet-kiem">
                  <div v-if="deviceType === 'SmartBuilding1'">
                    <div id="nangluong-tieuthu">
                    <b-img
                      :src="getPicPath('icon-Congsuattai.png')"
                      alt="icon-tieuthu-trongngay"
                      id='icon-cptk'>
                    </b-img>
                    <p>{{$t('overviewPVpage.todayconsump')}}</p>
                    <br />
                    <h5>{{smartBuildingData.ToLoadToday}} kWh</h5>
                  </div>
                  <div id="cong-suat-tai">
                    <b-img
                      :src="getPicPath('energy-consumption.png')"
                      alt="icon-tong-tieuthu"
                      id='icon-cptk'>
                    </b-img>
                    <p>{{$t('overviewPVpage.totalconsump')}}</p>
                    <br />
                    <h5>{{smartBuildingData.ToLoadTotal}} kWh</h5>
                  </div>
                  </div>
                  <div v-else-if="deviceType === 'PV-SMA-OffGrid1'">
                    <div id="trangthai-mayphat">
                      <b-img
                        :src="getPicPath('icon-MayPhatDien.png')"
                        alt="icon-giam-co2"
                        id='icon-cptk'>
                      </b-img>
                      <p>{{$t('overviewPVpage.generatorstatus')}}</p>
                      <h5>{{generatorStatus}}</h5>
                    </div>
                    <div class='accquy'>
                      <div class="data">
                        <p>{{$t('overviewPVpage.battery')}}</p>
                      </div>
                      <b-table
                      id="table-dc"
                      striped
                      hover
                      bordered
                      small
                      head-variant="dark"
                      :fields="accQuyLabels"
                      :items="accQuyItems"
                      ></b-table>
                    </div>
                  </div>
                  <div class='fixed-content' v-else>
                  <div class="data">
                    <p>{{$t('overviewPVpage.dcvolt')}}</p>
                  </div>
                  <b-table
                    id="table-dc"
                    striped
                    hover
                    bordered
                    head-variant="dark"
                    :fields="fields"
                    :items="items"
                  >
                  <template v-slot:cell(InverterID)="data">
                    <div v-if="data.item.Status === 1">
                    <b style="color: green">{{ data.item.InverterID }}</b> -
                    <b-icon icon="check-circle" animation="fade" variant="success"></b-icon>
                    </div>
                    <div v-if="data.item.Status === 0">
                    <b style="color: red">{{ data.item.InverterID }}</b> -
                    <b-icon icon="exclamation-circle-fill" animation="fade" variant="danger"></b-icon>
                    </div>
                  </template>
                  </b-table>
                </div>
                </div>
                </div>
              </b-col>
            </b-row>
            <b-row v-if="deviceType === 'SmartBuilding1'">
              <b-col sm="6">
              <div id="area-piechart" v-if="loadedPieChart === true">
                <pieChart :chartdata="pieChartData" :options="pieChartOption"/>
              </div>
              </b-col>
              <b-col sm="6">
                <div id="area" style="text-align:center">
                  <div id="pv-area">
                    <b-row>
                      <b-col sm="2"></b-col>
                      <b-col sm="5"><strong>{{$t('mostused.capacity').toUpperCase()}}</strong></b-col>
                      <b-col sm="5"><strong>{{$t('mostused.consume').toUpperCase()}}</strong></b-col>
                    </b-row>
                  </div>
                  <div id="pv-area">
                    <b-row>
                      <b-col sm="2" :style="{'background-image': `url(${getPicPath('icon-PowerFloor.png')})`}">
                        <strong>MG</strong>
                        </b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getPV_MG}} kWh</h5></b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getEnergy_MG}} kWh</h5></b-col>
                    </b-row>
                  </div>
                  <div id="pv-area">
                    <b-row>
                      <b-col sm="2"  :style="{'background-image': `url(${getPicPath('icon-PowerFloor.png')})`}">
                      <strong>1</strong>
                      </b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getPV_1}} kWh</h5></b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getEnergy_1}} kWh</h5></b-col>
                    </b-row>
                  </div>
                  <div id="pv-area">
                    <b-row>
                      <b-col sm="2"  :style="{'background-image': `url(${getPicPath('icon-PowerFloor.png')})`}">
                      <strong>2</strong>
                      </b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getPV_2}} kWh</h5></b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getEnergy_2}} kWh</h5></b-col>
                    </b-row>
                  </div>
                  <div id="pv-area">
                    <b-row>
                      <b-col sm="2"  :style="{'background-image': `url(${getPicPath('icon-PowerFloor.png')})`}">
                      <strong>3</strong>
                      </b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getPV_3}} kWh</h5></b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getEnergy_3}} kWh</h5></b-col>
                    </b-row>
                  </div>
                  <div id="pv-area">
                    <b-row>
                      <b-col sm="2"  :style="{'background-image': `url(${getPicPath('icon-PowerFloor.png')})`}">
                      <strong>4</strong>
                      </b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getPV_4}} kWh</h5></b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getEnergy_4}} kWh</h5></b-col>
                    </b-row>
                  </div>
                  <div id="pv-area">
                    <b-row>
                      <b-col sm="2"><b-img
                        :src="getPicPath('icon-AirConditioner.png')"
                        alt="icon-air-conditioner"
                        id='icon-pv-area'>
                      </b-img></b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getPV_AirConditioner}} kWh</h5></b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getEnergy_AirConditioner}} kWh</h5></b-col>
                    </b-row>
                  </div>
                  <div id="pv-area-last">
                    <b-row>
                      <b-col sm="2"><b-img
                        :src="getPicPath('icon-Elevator.png')"
                        alt="icon-air-conditioner"
                        id='icon-pv-area'>
                      </b-img></b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getPV_Elevator}} kWh</h5></b-col>
                      <b-col sm="5"><h5>{{smartBuildingData.getEnergy_Elevator}} kWh</h5></b-col>
                    </b-row>
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col sm="4" id="overview-chart">
            <div id="bien-so">
              <h6>
                <strong>{{$t('overviewPVpage.variable')}}</strong>
              </h6>
              <b-table
                    v-if="deviceType !== 'PV-SMA-OffGrid1'"
                    id="table-baocao"
                    striped
                    hover
                    bordered
                    head-variant="dark"
                    :fields="fieldsCSTT"
                    :items="itemsCSTT"
              >
              <template v-slot:head(radiationAVG)='data'>
                <span v-html="data.field.label"></span>
              </template>
              </b-table>
              <div v-else>
                <b-card no-body>
                  <b-tabs pills card v-model="tabIndex" @input="tabInvChange()">
                    <b-tab v-for="inv in numberOfNguyenLy" :key="inv.id" :title="inv.text">
                      <b-card-text>
                        <b-table
                          v-if="deviceType === 'PV-SMA-OffGrid1'"
                          id="table-baocao"
                          striped
                          hover
                          small
                          bordered
                          head-variant="dark"
                          :fields="fieldsMechanic"
                          :items="itemsMechanic">
                          <template v-slot:cell(donvi)="data">
                            <span v-html="data.item.donvi"></span>
                          </template>
                        </b-table>
                      </b-card-text>
                    </b-tab>
                  </b-tabs>
                </b-card>
              </div>
            </div>
            <div id="project-info">
              <b-container fluid>
              <b-row>
                <b-col sm="3">
                  <b-img :src="getPicPath('icon-Info.png')" alt="info-img" id="project-info-icon"></b-img>
                </b-col>
                <b-col sm="9" id="text-project-info">
                  <h6>
                    <strong>{{$t('mostused.projectinfo').toUpperCase()}}</strong>
                  </h6>
                  <p v-html="fullName"></p>
                </b-col>
              </b-row>
              </b-container>
            </div>
            <div id="weather">
              <h6>
                <strong>{{$t('mostused.weather').toUpperCase()}}</strong>
              </h6>
              <b-row>
                <b-col sm="6">
                  <h5>
                    <strong>{{Tempature}} &#8451;</strong>
                  </h5>
                  <p>{{Clouds}}</p>
                </b-col>
                <b-col sm="6">
                  <h5>
                    <strong>{{windSpeed}} m/s</strong>
                  </h5>
                </b-col>
              </b-row>
            </div>
            <div id="device-status">
              <h6>
                <strong>{{$t('overviewPVpage.devicestatus')}}</strong>
              </h6>
              <b-row>
                <b-col sm="6" v-for="item in deviceStatus" :key="item.Inverter">
                  <h6>{{item.Inverter}}</h6>
                  <b-img
                    id='status-img'
                    v-if="item.count < 3"
                    :src="getPicPath('status_1_On.png')"
                    alt="status-1-icon"
                  ></b-img>
                  <b-img
                    id='status-img'
                    v-if="item.count === 5"
                    :src="getPicPath('status_3_On.png')"
                    alt="status-3-icon"
                  ></b-img>
                  <b-img
                    id='status-img'
                    v-if="item.count >= 3 && item.count < 5"
                    :src="getPicPath('status_2_On.png')"
                    alt="status-icon-2"
                  ></b-img>
                  <p>{{$t('overviewPVpage.updateat')}}: <br>{{item.lastUpdate}}</p>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
        <b-row id="table-inv-row" v-if="deviceType === 'PV-SMA-OffGrid1'">
          <b-col sm="6" id="table-inv">
            <p>{{$t('overviewPVpage.inverterbattery')}}</p>
            <b-table
                    id="table-dc"
                    striped
                    hover
                    bordered
                    head-variant="dark"
                    :fields="tableInvLabels"
                    :items="tableInvItems2"
                  >
                  <template v-slot:cell(invID)="data">
                    <div v-if="data.item.status === 1">
                    <b style="color: green">{{ data.item.invID }}</b> -
                    <b-icon icon="check-circle" animation="fade" variant="success"></b-icon>
                    </div>
                    <div v-if="data.item.status === 0">
                    <b style="color: red">{{ data.item.invID }}</b> -
                    <b-icon icon="exclamation-circle-fill" animation="fade" variant="danger"></b-icon>
                    </div>
                  </template>
                  </b-table>
          </b-col>
          <b-col sm="6" id="table-inv">
            <p>{{$t('overviewPVpage.invertersolar')}}</p>
            <b-table
                    id="table-dc"
                    striped
                    hover
                    bordered
                    head-variant="dark"
                    :fields="tableInvLabels"
                    :items="tableInvItems1"
                  >
                  <template v-slot:cell(invID)="data">
                    <div v-if="data.item.status === 1">
                    <b style="color: green">{{ data.item.invID }}</b> -
                    <b-icon icon="check-circle" animation="fade" variant="success"></b-icon>
                    </div>
                    <div v-if="data.item.status === 0">
                    <b style="color: red">{{ data.item.invID }}</b> -
                    <b-icon icon="exclamation-circle-fill" animation="fade" variant="danger"></b-icon>
                    </div>
                  </template>
                  </b-table>
          </b-col>
        </b-row>
        </b-container>
        </b-overlay>
        <h6 id="production-chart-title">
          <strong>{{productionChartTitle}}</strong>
        </h6>
        <b-form-select v-if="deviceType !== 'SmartBuilding1'" v-model="productionSelected"
        :options="productionSelect" size="sm" class="mt-3"
        @change="productionOnChange($event)"></b-form-select>
        <div id="production-chart">
          <div id="chart-production-by-day">
            <div v-if="!chartLoaded">
              <SpinningGroup></SpinningGroup>
            </div>
            <productionChart
              :chartdata="chartDataTLTK"
              :options="chartOptions"
              :width="1100"
              :height="400"
              v-if="chartLoaded"
              :key="productionChartKey"
            ></productionChart>
          </div>
        </div>
        <h6 id="title">
          <strong>{{$t('overviewPVpage.todaypvpower')}}</strong>
        </h6>
        <b-form-datepicker v-model="valueSelectDate"
        :max="maxDay" size="sm" class="mt-3" @context="onContext"
        locale="en"></b-form-datepicker>
        <div id="chart-production-by-day">
          <div v-if="!chartLoadedLine">
            <SpinningGroup></SpinningGroup>
          </div>
          <lineProductionChart
            :chartdata="chartDataLine"
            :options="chartOptions_power"
            :width="1100"
            :height="400"
            v-if="chartLoadedLine"
          ></lineProductionChart>
        </div>
        <div v-if="InsuranceStatus === true">
        <h6 id="production-chart-title">
          <strong>{{$t('overviewPVpage.insurancechart')}}</strong>
        </h6>
        <div id="production-chart">
          <div id="chart-production-by-day">
            <div v-if="!chartLoaded">
              <SpinningGroup></SpinningGroup>
            </div>
            <productionChart
              :chartdata="InsuranceChartData"
              :options="chartOptions"
              :width="1100"
              :height="400"
              v-if="chartLoaded"
              :key="productionChartKey"
            ></productionChart>
          </div>
        </div>
        </div>
      </b-container>
    </div>
</template>

<script>
import pieChart from './pie-chart'
import SpinningGroup from '../../spinning.vue'
import productionChart from './production-chart.vue'
import lineProductionChart from './line-chart.vue'

const now = new Date()
const todayYear = now.getFullYear()
const todayMonth = ('0' + (now.getMonth() + 1)).slice(-2)
const todayDate = ('0' + now.getDate()).slice(-2)

const today = `${todayYear}-${todayMonth}-${todayDate}`

function checkAdminToken () {
  let token, pvType, device
  if (localStorage.getItem('jwt') != null) {
    token = localStorage.getItem('jwt')
    pvType = localStorage.getItem('kindProject')
    device = localStorage.getItem('Device')
  } else {
    token = sessionStorage.getItem('jwt')
    pvType = sessionStorage.getItem('kindProject')
    device = sessionStorage.getItem('Device')
  }
  return {
    token: token,
    pvType: pvType,
    device: device
  }
}

export default {
  name: 'overviewComponentPV',
  props: {
    msg: String
  },
  components: {
    SpinningGroup,
    productionChart,
    lineProductionChart,
    pieChart
  },
  data () {
    return {
      loaded: true,
      thongso_overlay: true,
      projectFullName: '',
      error: null,
      showErrorAlert: false,
      fields: [],
      items: [],
      fullName: null,
      inverter: [],
      TodayProduction: null,
      TotalProduction: null,
      Tempature: null,
      Clouds: null,
      windSpeed: null,
      TongCSTT: null,
      TongCSLOAD: null,
      deviceStatus: [],
      chartLoaded: false,
      chartDataTLTK: null,
      chartOptions: null,
      chartOptions_power: null,
      chartDataLine: null,
      chartLoadedLine: false,
      price: 0,
      totalSaveMoney: 0,
      totalCarbon: 0,
      fieldsCSTT: null,
      itemsCSTT: null,
      device: null,
      productionSelect: [
        {value: 'byDay', text: this.$t('overviewPVpage.viewbydate')},
        {value: 'byMonth', text: this.$t('overviewPVpage.viewbymonth')}
      ],
      productionSelected: null,
      productionChartKey: 0,
      maxDay: null,
      valueSelectDate: null,
      labelTTTK: this.$t('overviewPVpage.moneysave'),
      productionChartTitle: null,
      AmataMoney: null,
      deviceType: null,
      numberOfNguyenLy: null,
      tabIndex: 0,
      fieldsMechanic: null,
      itemsMechanic: null,
      todayConsump: null,
      totalConsump: null,
      generatorStatus: null,
      accQuyItems: null,
      accQuyLabels: null,
      tableInvLabels: null,
      tableInvItems1: null,
      tableInvItems2: null,
      smartBuildingData: null,
      pieChartData: null,
      pieChartOption: null,
      loadedPieChart: null,
      InsuranceStatus: null,
      InsuranceChartData: null,
      sumTarifHigh: null,
      sumTarifNormal: null,
      sumTarifLow: null,
      //tarrif 3 gia
      tariffAvailable: false,

      // PR calculate
      prCalculate: null
    }
  },
  mounted () {
    let token = checkAdminToken().token
    let pvType = checkAdminToken().pvType
    let device = checkAdminToken().device
    this.deviceType = device

    this.$http.defaults.headers.common['X-LANGUAGE'] = this.$route.params.lang
            let fontSize
            let barThickness
            if (window.innerWidth > 2500 && window.innerWidth < 4040) {
              fontSize = 20
              barThickness = 40
            } else if (window.innerWidth > 1400 && window.innerWidth <= 2500 ) {
              fontSize = 12
              barThickness = 20
            } else if (window.innerWidth > 1020 && window.innerWidth <= 1400) {
              fontSize = 10
              barThickness = 17
            } else if (window.innerWidth > 750 && window.innerWidth <= 1020) {
              fontSize = 9
              barThickness = 10
            } else if (window.innerWidth > 420 && window.innerWidth <= 750) {
              fontSize = 8
              barThickness = 5
            } else if (window.innerWidth > 350 && window.innerWidth <= 420) {
              fontSize = 6
              barThickness = 4
            }

    if (device === 'PV-SMA-OffGrid1') {
      this.$http.get(`${this.$store.state.pvSofarApi}/table-mechanic`, {
          headers: { authorization: token },
          params: {
            He: this.tabIndex
          }
      }).then(responseMec => {
          let response = responseMec.data
          this.fieldsMechanic = response.labelsMechanic
          this.itemsMechanic = response.itemsMechanic
      })
    }

    this.$http.get(`${this.$store.state.pvSofarApi}/module-info`, {
                headers: { authorization: token }
              }).then(responseModule => {
                let dataRespose = responseModule.data.data
                if (localStorage.getItem('jwt') != null) {
                  localStorage.setItem('projectModule', JSON.stringify(dataRespose))
                  this.$store.commit('loadModule', dataRespose[0])
                } else {
                  sessionStorage.setItem('projectModule', JSON.stringify(dataRespose))
                }
              })

    this.$http
      .post(
        `${this.$store.state.pvSofarApi}/userinfo`,
        {
          pvType: checkAdminToken().pvType,
          device: checkAdminToken().device
        },
        { headers: { authorization: token } }
      )
      .then(async response => {
        let data = response.data.data
        this.price = data.price
        this.totalSaveMoney = data.totalSaveMoney
        this.fullName = data.Fullname
        this.inverter = data.CSTT.CSTTArr
        this.TongCSTT = data.CSTT.TongCSTT
        this.TongCSLOAD = data.CSTT.TongCSLOAD
        this.TotalProduction = data.TotalProduction
        this.TodayProduction = data.TodayProduction
        this.totalCarbon = data.totalCarbon
        this.fieldsCSTT = data.CSTT.fieldsCSTT
        this.itemsCSTT = data.CSTT.itemsCSTT
        this.AmataMoney = data.totalAmataMoney
        this.numberOfNguyenLy = data.numberOfNguyenLy
        this.todayConsump = data.Consumption.todayConsump
        this.totalConsump = data.Consumption.totalConsump

        this.generatorStatus = data.generator.generatorStatus
        this.accQuyLabels = data.generator.accQuyLabels
        this.accQuyItems = data.generator.accQuyItems
        
        this.tableInvLabels = data.tableInv.tableInvLabels
        this.tableInvItems1 = data.tableInv.tableInvItems1
        this.tableInvItems2 = data.tableInv.tableInvItems2

        this.smartBuildingData = data.smartBuildingData
        let smartBuildingChartData = data.smartBuildingParams_pieChart

        this.InsuranceStatus = data.InsuranceInfo.InsuranceStatus
        this.InsuranceChartData = {
              labels: data.InsuranceInfo.InsuranceChart_label,
              datasets: data.InsuranceInfo.InsuranceChart_data
        }
        this.sumTarifHigh = data.Tariff.sumTarifHigh
        this.sumTarifNormal = data.Tariff.sumTarifNormal
        this.sumTarifLow = data.Tariff.sumTarifLow

        this.prCalculate = data.PRCalculate

        this.tariffAvailable = data.tariffAvailable

        this.pieChartData = {
          datasets: [
            {
              data: [smartBuildingChartData.percent_MG, smartBuildingChartData.percent_1,
              smartBuildingChartData.percent_2, smartBuildingChartData.percent_3,
              smartBuildingChartData.percent_4, smartBuildingChartData.percent_AirConditioner,
              smartBuildingChartData.percent_Elevator],
              backgroundColor: ['rgb(181, 47, 47)', 'rgb(48, 171, 77)', 'rgb(237, 245, 20)',
              'rgb(224, 151, 34)', 'rgb(41, 198, 207)', 'rgb(43, 51, 204)', 'rgb(201, 39, 204)'],
              datalabels: {
                align: 'center',
                color: 'white',
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
          labels: ['MG', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor', 'Air Conditioner',
          'Elevator']
        }
        this.pieChartOption = {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: { titleFontSize: fontSize, bodyFontSize: fontSize },
          legend: {
            labels: {
              fontColor: 'black',
              fontSize: fontSize
            }
          }
        }
        this.loadedPieChart = true

        if (device === 'SmartBuilding1') {
          this.productionSelected = 'byDay'
        } else {
          let checkViewProduction = sessionStorage.getItem('checkViewProduction')
          if (checkViewProduction === null || checkViewProduction === '') {
            this.productionSelected = 'byDay'
          } else {
            this.productionSelected = checkViewProduction
          }
        }

        let checkViewPower = sessionStorage.getItem('checkViewPower')
        if (checkViewPower === '' || checkViewPower === null) {
          this.valueSelectDate = today
        } else {
          this.valueSelectDate = checkViewPower
        }

        this.maxDay = today
        if (device === 'SmartBuilding1') {
          this.productionChartTitle = this.$t('overviewPVpage.productionchartbydate')
        } else {
          if (this.productionSelected === 'byDay') {
            this.productionChartTitle = this.$t('overviewPVpage.productionchartbydate')
          } else {
            this.productionChartTitle = this.$t('overviewPVpage.prductionchartbymonth')
          }
        }

        if (pvType === 'SOFAR') {
          if (device === 'MultiPVSofar10') {
            this.device = 'hd'
            this.fields = [
              { key: 'Module', label: 'Hệ' },
              { key: 'InverterID', label: 'Inverter' },
              { key: 'PV1Volt', label: 'PV1(V)' },
              { key: 'PV2Volt', label: 'PV2(V)' },
              { key: 'PV3Volt', label: 'PV3(V)' }
            ]
          }
          else if (device === 'MultiPVSofar1') {
            this.device = 'hd'
            this.fields = [
              { key: 'Module', label: 'Hệ' },
              { key: 'InverterID', label: 'Inverter' },
              { key: 'A6', label: 'PV1(V)' },
              { key: 'A8', label: 'PV2(V)' }
            ]
          }
          else if (device === 'Amata') {
            this.labelTTTK = 'AMATA TIẾT KIỆM'
            this.device = 'hd'
            this.fields = [
              { key: 'Module', label: 'Hệ' },
              { key: 'InverterID', label: 'Inverter' },
              { key: 'A6', label: 'PV1(V)' },
              { key: 'A8', label: 'PV2(V)' }
            ]
          }
          else if (device === 'Sunspec' || device === 'MultiSunspec' || device === 'Sungrow') {
            this.labelTTTK = 'TỔNG CỘNG THÀNH TIỀN'
            this.device = 'hd'
            this.fields = [
              { key: 'Module', label: 'Hệ' },
              { key: 'InverterID', label: 'Inverter' },
              { key: 'Mppt1', label: 'PV1(V)'},
              { key: 'Mppt2', label: 'PV2(V)'},
              { key: 'Mppt3', label: 'PV3(V)'},
              { key: 'Mppt4', label: 'PV4(V)'},
              { key: 'Mppt5', label: 'PV5(V)'},
              { key: 'Mppt6', label: 'PV6(V)'},
              { key: 'Mppt7', label: 'PV7(V)'},
              { key: 'Mppt8', label: 'PV8(V)'},
              { key: 'Mppt9', label: 'PV9(V)'},
              { key: 'Mppt10', label: 'PV10(V)'},
            ]
          } 
          else if (device === 'PVSofarGroupV3') {
            this.device = 'tk',
            this.fields = [
              { key: 'Module', label: 'Hệ' },
              { key: 'InverterID', label: 'Inverter' },
              { key: 'pv1_voltage', label: 'PV1(V)' },
              { key: 'pv2_voltage', label: 'PV2(V)' },
              { key: 'pv3_voltage', label: 'PV3(V)'}
            ]
          }else {
            this.device = 'tk'
            this.fields = [
              { key: 'Module', label: 'Hệ' },
              { key: 'InverterID', label: 'Inverter' },
              { key: 'A6', label: 'PV1(V)' },
              { key: 'A8', label: 'PV2(V)' }
            ]
          }
        } else if (pvType === 'HUAWEI') {
          if (device === 'MultiPVHuawei3') {
              this.device = 'tk'
              this.fields = [
                { key: 'Module', label: 'Hệ' },
                { key: 'InverterID', label: 'Inverter' },
                { key: 'A9', label: 'PV1(V)' },
                { key: 'A13', label: 'PV2(V)' },
                { key: 'A17', label: 'PV3(V)' },
                { key: 'A21', label: 'PV4(V)' },
                { key: 'A25', label: 'PV5(V)' },
                { key: 'A29', label: 'PV6(V)' },
                { key: 'A33', label: 'PV7(V)' },
                { key: 'A37', label: 'PV8(V)' },
                { key: 'A41', label: 'PV9(V)' },
                { key: 'A45', label: 'PV10(V)' }
              ]
          } else {
            this.device = 'tk'
              this.fields = [
                { key: 'Module', label: 'Hệ' },
                { key: 'InverterID', label: 'Inverter' },
                { key: 'A14', label: 'PV1(V)' },
                { key: 'A16', label: 'PV2(V)' }
              ]
          }
        }
        this.items = data.listRecord
        this.deviceStatus = data.status

        let weather = data.weather
        this.Tempature = weather.temp
        this.Clouds = weather.description
        this.windSpeed = weather.windSpeed

        this.$http
          .get(`${this.$store.state.pvSofarApi}/production-chart`, {
            params: {
              pvType: pvType,
              viewMode: this.productionSelected,
              device: device
            },
            headers: { authorization: token }
          })
          .then(res => {
            let dataChart = res.data.data
            let dateLabels
            if (pvType === 'HUAWEI') {
              dateLabels = dataChart.labels
            } else {
              dateLabels = dataChart.labels
            }

            this.chartDataTLTK = {
              labels: dateLabels,
              datasets: dataChart.chartData
            }
            this.chartLoaded = true
            this.$http.get(`${this.$store.state.pvSofarApi}/power-chart`, {
              params: {
                date: this.valueSelectDate,
                device: device,
                pvType: pvType
              },
              headers: { authorization: token }
            }).then(dataRes => {
              let LineLabels = dataRes.data.labels[0]
              let lineData = dataRes.data.dataChart

              this.chartDataLine = {
                labels: LineLabels,
                datasets: lineData
              }
              this.chartLoadedLine = true

            })
            let labelStringProduction
            let labelStringPR
            let labelStringDescript = this.$t('overviewPVpage.chartdescript')
            if (device === 'SmartBuilding1') {
              labelStringProduction = this.$t('overviewPVpage.energyconsume') + ' (kWh)'
            } else {
              labelStringProduction = this.$t('overviewPVpage.labelstrproduced') + ' (kWh)'
              labelStringPR = this.$t('overviewPVpage.labelstrpr') + ' (%)'
            }

            let labelStringPower
            if (device === 'SmartBuilding1') {
              labelStringPower = this.$t('overviewPVpage.todaypvchart') + ' (kW)'
            } else {
              labelStringPower = this.$t('overviewPVpage.labelstrpvpower') + ' (kW)'
            }

            if (device === 'Sungrow') {
              this.chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              tooltips: {
                itemSort: function(a, b) {
                  return b.datasetIndex - a.datasetIndex
                },
                titleFontSize: fontSize, 
                bodyFontSize: fontSize, 
                mode: 'index', 
                intersect: false,
                displayColors: true 
              },
              hover: {
                mode: 'index',
                intersect: false
              },
              plugins: {
                datalabels: {
                  color: 'black',
                  textAlign: 'center',
                  font: {
                    weight: 'bold',
                    size: fontSize
                  },
                  backgroundColor: 'white'
                },
                zoom: {
                  pan: {
                    enabled: true,
                    mode: 'x',
                    speed: 20,
                    threshold: 10,
                    onPan: function({chart}) {},
                    onPanComplete: function({chart}) {}
                  },
                  zoom: {
                    enabled: true,
                    drag: false,
                    mode: 'x',
                    speed: 20,
                    threshold: 2,
                    sensitivity: 0,
                    onZoom: function({chart}) {},
                    onZoomComplete: function({chart}) {}
                  }
                }
              },
              legend: {
                reverse: true,
                labels: {
                    fontColor: 'black',
                    fontSize: fontSize
                    }
                },
              scales: {
                yAxes: [
                  {
                    id: 'A',
                    position: 'right',
                    stacked: false,
                    ticks: {
                      beginAtZero: true,
                      fontSize: fontSize
                    },
                    gridLines: {
                      display: true
                    },
                    scaleLabel: {
                      display: true,
                      labelString: labelStringProduction
                    }
                  },
                  {
                    id: 'B',
                    position: 'left',
                    stacked: false,
                    ticks: {
                      beginAtZero: true,
                      fontSize: fontSize
                    },
                    gridLines: {
                      display: true
                    },
                    scaleLabel: {
                      display: true,
                      labelString: labelStringPR
                    }
                  }
                ],
                xAxes: [
                  {
                    barThickness: barThickness,
                    stacked: false,
                    display: true,
                    ticks: {
                      beginAtZero: true,
                      fontSize: fontSize
                    },
                    scaleLabel: {
                      display: true,
                      labelString: labelStringDescript
                    }
                  }
                ]
              }
            }

            } else {
              this.chartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              tooltips: {
                itemSort: function(a, b) {
                  return b.datasetIndex - a.datasetIndex
                },
                titleFontSize: fontSize, 
                bodyFontSize: fontSize, 
                mode: 'index', 
                intersect: false,
                displayColors: true 
              },
              hover: {
                mode: 'index',
                intersect: false
              },
              plugins: {
                datalabels: {
                  color: 'black',
                  textAlign: 'center',
                  font: {
                    weight: 'bold',
                    size: fontSize
                  },
                  backgroundColor: 'white'
                },
                zoom: {
                  pan: {
                    enabled: true,
                    mode: 'x',
                    speed: 20,
                    threshold: 10,
                    onPan: function({chart}) {},
                    onPanComplete: function({chart}) {}
                  },
                  zoom: {
                    enabled: true,
                    drag: false,
                    mode: 'x',
                    speed: 20,
                    threshold: 2,
                    sensitivity: 0,
                    onZoom: function({chart}) {},
                    onZoomComplete: function({chart}) {}
                  }
                }
              },
              legend: {
                reverse: true,
                labels: {
                    fontColor: 'black',
                    fontSize: fontSize
                    }
                },
              scales: {
                yAxes: [
                  {
                    stacked: true,
                    ticks: {
                      beginAtZero: true,
                      fontSize: fontSize
                    },
                    gridLines: {
                      display: true
                    },
                    scaleLabel: {
                      display: true,
                      labelString: labelStringProduction
                    }
                  }
                ],
                xAxes: [
                  {
                    barThickness: barThickness,
                    stacked: true,
                    display: true,
                    ticks: {
                      beginAtZero: true,
                      fontSize: fontSize
                    },
                    scaleLabel: {
                      display: true,
                      labelString: labelStringDescript
                    }
                  }
                ]
              }
            }
          }


            this.chartOptions_power = {
              responsive: true,
              maintainAspectRatio: false,
              tooltips: { 
                titleFontSize: fontSize, 
                bodyFontSize: fontSize, 
                mode: 'index', 
                intersect: false,
                displayColors: true 
              },
              hover: {
                mode: 'index',
                intersect: false
              },
              plugins: {
                zoom: {
                  pan: {
                    enabled: true,
                    mode: 'x',
                    speed: 20,
                    threshold: 10,
                    onPan: function({chart}) {},
                    onPanComplete: function({chart}) {}
                  },
                  zoom: {
                    enabled: true,
                    drag: false,
                    mode: 'x',
                    speed: 1000,
                    threshold: 0,
                    sensitivity: 0,
                    onZoom: function({chart}) {},
                    onZoomComplete: function({chart}) {}
                  }
                }
              },
              legend: {
                labels: {
                    fontColor: 'black',
                    fontSize: fontSize
                    }
                },
              scales: {
                yAxes: [
                  {
                    stacked: false,
                    ticks: {
                      beginAtZero: true,
                      fontSize: fontSize
                    },
                    gridLines: {
                      display: true
                    },
                    scaleLabel: {
                      display: true,
                      labelString: labelStringPower
                    }
                  }
                ],
                xAxes: [
                  {
                    barThickness: barThickness,
                    stacked: false,
                    display: true,
                    ticks: {
                      beginAtZero: false,
                      fontSize: fontSize
                    },
                    scaleLabel: {
                      display: true,
                      labelString: labelStringDescript
                    }
                  }
                ]
              }
            }
          })

        // this.loaded = true
        this.thongso_overlay = false
      })
      .catch(err => {
        if (err.response === undefined) {
          console.log(err)
          this.error = `Can't connect server`
          this.showErrorAlert = true
          this.thongso_overlay = false
        } else {
          let errMsg = err.response.data.message
          this.error = errMsg
          this.showErrorAlert = true
          this.thongso_overlay = false
        }
      })
  },
  methods: {
    tabInvChange () {
      let token = checkAdminToken().token
      this.$http.get(`${this.$store.state.pvSofarApi}/table-mechanic`, {
          headers: { authorization: token },
          params: {
            He: this.tabIndex
          }
      }).then(responseMec => {
          let response = responseMec.data
          this.fieldsMechanic = response.labelsMechanic
          this.itemsMechanic = response.itemsMechanic
      })
    },
    getPicPath: picName => {
      let picPath = require(`../../../assets/images/${picName}`)
      return picPath
    },
    productionOnChange (event) {
      this.chartLoaded = false
      let token = checkAdminToken().token
      let pvType = checkAdminToken().pvType
      let device = checkAdminToken().device
      if (this.productionSelected === 'byDay') {
          this.productionChartTitle = this.$t('overviewPVpage.productionchartbydate')
        } else {
          this.productionChartTitle = this.$t('overviewPVpage.prductionchartbymonth')
      }
      this.$http
          .get(`${this.$store.state.pvSofarApi}/production-chart`, {
            params: {
              pvType: pvType,
              device: device,
              viewMode: this.productionSelected
            },
            headers: { authorization: token }
          }).then(res => {
            let dataChart = res.data.data
            let dateLabels = dataChart.labels
            this.chartDataTLTK = {
              labels: dateLabels,
              datasets: dataChart.chartData
            }
            this.productionChartKey += 1
            sessionStorage.setItem('checkViewProduction', this.productionSelected)
            this.chartLoaded = true
          })
    },
    onContext (ctx) {
        let token = checkAdminToken().token
        let pvType = checkAdminToken().pvType
        let device = checkAdminToken().device
        if (this.chartLoadedLine === true) {
          this.chartLoadedLine = false
          this.$http.get(`${this.$store.state.pvSofarApi}/power-chart`, {
              params: {
                date: ctx.selectedYMD,
                device: device,
                pvType: pvType
              },
              headers: { authorization: token }
            }).then(dataRes => {
              let LineLabels = dataRes.data.labels[0]
              let lineData = dataRes.data.dataChart

              this.chartDataLine = {
                labels: LineLabels,
                datasets: lineData
              }
              sessionStorage.setItem('checkViewPower', ctx.selectedYMD)
              this.chartLoadedLine = true
            })
        }
    }
  }
}
</script>

<style scoped>

#nangluong-tieuthu {
  padding: 10px 0;
}

.su-dung-trong-ngay {
  background-color: #f2f2f2;
}

#production-chart-title {
  padding-top: 10px;
}

#table-inv-row {
  padding: 10px 0;
  border-top: 1px solid #b3b3b3;
  border-bottom: 1px solid #b3b3b3;
}

#table-inv {
  text-align: center;
}

.card-body {
  padding: 0 !important;
}

#trangthai-mayphat {
  padding: 10px 0;
  border-bottom: 1px solid #b3b3b3;
}

.fixed-content {
    overflow:auto;
    max-height: 100%;
    overflow-y:auto;
    overflow-x:auto;
}

.fixed-content1 {
    overflow:auto;
    max-height: 60%;
    overflow-y:auto;
    overflow-x:auto;
}

.accquy {
  padding: 10px 0;
}

svg {
  font-size: 15px;
}
#project-fullname {
  text-align: right;
  margin: 10px 0;
  border-bottom: 1px solid black;
}

#app table {
  text-align: center;
  height: 150px;
  padding: 0;
}

table thead tr th {
  font-size: 5px !important;
}

#icon-pv-area {
  width: 100%;
}

#pv-area {
  padding: 10px 0;
  border-bottom: 1px solid #b3b3b3;
}

#pv-area-last {
  padding: 10px 0;
}

#icon-nuoc-lanh,
#icon-nuoc-nong,
#icon-tll,
#icon-nltk,
#icon-cptk {
  float: left;
  width: 15%;
  max-width: 15%;
}

#errorAlert {
  margin-top: 10px;
}

#area-piechart {
  background-color: #f2f2f2;
  border: 1px solid #b3b3b3;
  border-radius: 15px;
  padding: 5px;
}

#area {
  background-color: #f2f2f2;
  border: 1px solid #b3b3b3;
  border-radius: 15px;
  padding: 0 5px;
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
  padding: 5px 10px;
  margin: 10px 0;
  height: 300px;
  background-color: #f2f2f2;
}

#chart-production-by-day {
  width: 100%;
  border-bottom: 1px solid #b3b3b3;
  margin-top: 10px;
}

#cong-suat-tai {
  padding-top: 10px;
  border-top: 1px solid #b3b3b3;
}

#project-info,
.data-congsuat {
  padding: 10px 0;
  border-bottom: 1px solid #b3b3b3;
}

#project-info {
  background-color: seagreen;
  color: white;
}

#weather {
  text-align: center;
  padding: 10px 0;
  border-bottom: 1px solid #b3b3b3;
  background-color: darkgreen;
  color: white;
}

#device-status {
  text-align: center;
  padding: 10px 0;
  border-bottom: 1px solid #b3b3b3;
  background-color: white;
}

#title {
  margin-top: 15px;
}

#bien-so {
  border-bottom: 1px solid #b3b3b3;
}

#text-project-info {
  padding: 0;
}

#project-info-icon {
  width: 100%;
  max-width: 100%;
}

.nhietdo-nuoclanh,
.nhietdo-nuocnong {
  margin: 10px 0;
  border-bottom: 1px solid #b3b3b3;
}

.tong-cong {
  margin: 10px 0;
  border-bottom: 1px solid #b3b3b3;
  padding: 0 !important;
}

.data {
  margin: 0;
  padding: 0;
}

.data p {
  margin: 0;
  padding: 0;
}

h5 {
  font-size: 25px;
  font-weight: bold;
}

.data-congsuat {
  padding-bottom: 10px;
}

.nhietdo-nuoclanh,
.nhietdo-nuocnong
{
  border-bottom: 1px solid #b3b3b3;
  padding-bottom: 10px;
}

#tong-so-number {
  font-size: 14px;
}

#overview-chart {
  border-radius: 15px;
  border: 1px solid #b3b3b3;
  padding: 10px 10px;
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
