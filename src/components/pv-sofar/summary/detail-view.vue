<template>
  <div>
    <b-container fluid>
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
      <b-form-group>
        <h6>
          <strong>{{$t('datepick.viewstatic')}}</strong>
        </h6>
        <b-form-radio-group id="radio-group" v-model="selectedRadio" @change="handleRadioChange"
          name="radio-component">
          <b-row>
            <b-col sm="3" v-if="Serial != 'tong-hop'">
              <b-form-radio value="detail">{{$t('datepick.viewdetail')}}</b-form-radio>
            </b-col>
            <b-col sm="3">
              <b-form-radio value="date">{{$t('overviewPVpage.viewbydate')}}</b-form-radio>
            </b-col>
            <b-col sm="3">
              <b-form-radio value="month">{{$t('overviewPVpage.viewbymonth')}}</b-form-radio>
            </b-col>
            <b-col sm="3">
              <b-form-radio value="year">{{$t('datepick.viewbyyear')}}</b-form-radio>
            </b-col>
          </b-row>
        </b-form-radio-group>

        <!-- chonthoigianhienthi_comp -->
        <div id="date-time-picker">
            <DateTimePicker v-show="selectedRadio==='detail'" />
            <DatePicker v-show="selectedRadio==='date'" />
            <SelectMonth v-show="selectedRadio==='month'" />
            <SelectYear v-show="selectedRadio === 'year'" />
        </div>
        <div>
          <b-button v-b-toggle.collapse-3 class="m-1">{{$t('datepick.showhide')}}</b-button>
          <b-collapse visible id="collapse-3">
            <b-card>
              <b-form-checkbox-group
                id="checkbox-group"
                v-model="selectedCheckBox"
                name="checkboxBtn"
              >
                <b-row>
                  <b-col sm="3" v-for="item in selectArr" :key="item.value">
                    <b-form-checkbox :value="item.value">{{item.text}}</b-form-checkbox>
                  </b-col>
                </b-row>
              </b-form-checkbox-group>
            </b-card>
          </b-collapse>
        </div>
        <b-button id="submitbtn" variant="primary" type="submit" @click="handelSubmit">{{$t('datepick.viewstaticbtn')}}</b-button>
      </b-form-group>
      <SpinningGroup v-if="!loaded_selected"/>
      <div id="table" v-if="loaded_selected">

        <a id="exported" @click="onExport">
          <b-img :src="getPicPath('Excel_2007.png')"></b-img>
        </a>
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="table-baocao"
        ></b-pagination>
        <div class='fixed-content'>
        <b-table
          id="table-baocao"
          striped
          hover
          bordered
          head-variant="dark"
          :fields="fields"
          :items="items"
          :per-page="perPage"
          :current-page="currentPage"
        >
        <template v-slot:head(TotalRadiation)="data">
          <span v-html="data.field.label"></span>
        </template>
        <template v-slot:head(Radiation)="data">
          <span v-html="data.field.label"></span>
        </template>
        <template v-slot:cell(SessionID)="row">
        <b-button size="sm" @click="handle(row)" class="mr-2">
          {{ row.detailsShowing ? 'Hide' : 'Show'}}
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <div v-if="row.detailLoaded = true"  style="max-height:350px; overflow-y: auto;">
        <b-table
        id="table-detail"
        hover
        bordered
        header
        head-variant="light"
        :fields="fieldsDetail"
        :items="row.item.detail"
        >
        </b-table>
        </div>
      </template>
        </b-table>
        </div>
        <p id="total-record">
          <strong>{{$t('table.totallabel')}}:</strong>
          {{rows}}
          <i>{{$t('table.record')}}</i>
        </p>
      </div>
      <b-modal id="bv-modal-example" ref="bvmodalexample" hide-footer>
      <template v-slot:modal-title>
        <code>{{$t('warningmodal.warningtitle')}}</code>
      </template>
      <div class="d-block text-center">
        <h6>{{$t('warningmodal.warningselect')}}</h6>
      </div>
    </b-modal>
    </b-container>
  </div>
</template>

<script>
import SpinningGroup from '../../spinning.vue'
import DateTimePicker from './datetime-picker-detail.vue'
import DatePicker from './date-picker.vue'
import SelectMonth from './select-month.vue'
import SelectYear from './select-year.vue'
import {store} from '../../../store.js'
import XLSX from 'xlsx'

function checkAdminToken () {
  let token, pvType, device
  if (localStorage.getItem('jwt') != null) {
    pvType = localStorage.getItem('kindProject')
    token = localStorage.getItem('jwt')
    device = localStorage.getItem('Device')
  } else {
    pvType = sessionStorage.getItem('kindProject')
    token = sessionStorage.getItem('jwt')
    device = sessionStorage.getItem('Device')
  }
  return {
    token: token,
    pvType: pvType,
    device: device
  }
}
function getDateTime() {
    let newDate = new Date()
    let day = ('0' + newDate.getDate()).slice(-2)
    let month = ('0' + (newDate.getMonth() + 1)).slice(-2)
    let year = newDate.getFullYear()

    let hour = newDate.getHours()
    let min = newDate.getMinutes()
    let sec = newDate.getSeconds()

    let fromDate_temp = `${year}-${month}-${day} 00:00:00`
    let toDate_temp = `${year}-${month}-${day} ${hour}:${month}:${day}`
    return {
      fromDate_temp: fromDate_temp,
      toDate_temp: toDate_temp
    }
}
export default {
  name: `detailView`,
  props: {
    Serial: String
  },
  components: {
    DateTimePicker,
    DatePicker,
    SelectMonth,
    SelectYear,
    SpinningGroup
  },
  data () {
    return {
      error: null,
      showErrorAlert: false,
      value: null,
      fields: null,
      items: null,
      itemsDetail: null,
      fieldsDetail: null,
      items: null,
      perPage: 14,
      currentPage: 1,
      loaded_selected: false,
      selectedRadio: 'detail',
      selectedCheckBox: null,
      selectArr: null,
      fromDate_temp: null,
      toDate_temp: null,
      selectArrDetail: [
          {value: 'SumPV', text: this.$t('datepick.sumpv')},
          {value: 'SumPLoad', text: this.$t('datepick.sumload')},
          {value: 'Timer', text: this.$t('datepick.timer')},
          {value: 'TodayProduction', text: this.$t('datepick.todayprod')},
          {value: 'TotalProduction', text: this.$t('datepick.totalprod')},
          {value: 'Radiation', text: this.$t('datepick.radiation')}
      ],
      selectArrDetail_Amata: [
          {value: 'SumPV', text: this.$t('datepick.sumpv')},
          {value: 'SumPLoad', text: this.$t('datepick.sumload')},
          {value: 'Timer', text: this.$t('datepick.timer')},
          {value: 'Production', text: this.$t('datepick.todayprod')},
          {value: 'Radiation', text: this.$t('datepick.radiation')}
      ],
      selectArrDetail_MultiPVSofar10: [
          {value: 'pv_power', text: this.$t('datepick.sumpv')},
          {value: 'inverter_power', text: this.$t('datepick.inverterpower')},
          {value: 'load_power', text: this.$t('datepick.sumload')},
          {value: 'charge_power', text: this.$t('datepick.chargepower')},
          {value: 'today_production', text: this.$t('datepick.todayprod')},
          {value: 'total_production', text: this.$t('datepick.todayprod')}
      ],
      selectArrDetail_Huawei: [
          {value: 'SumPV', text: this.$t('datepick.sumpv')},
          {value: 'Timer', text: this.$t('datepick.timer')},
          {value: 'TodayProduction', text: this.$t('datepick.todayprod')}
      ],
      selectArrDetail_HuaweiRadiation: [
          {value: 'SumPV', text: this.$t('datepick.sumpv')},
          {value: 'Timer', text: this.$t('datepick.timer')},
          {value: 'TodayProduction', text: this.$t('datepick.todayprod')},
          {value: 'Radiation', text: this.$t('datepick.radiation')}
      ],
      selectArrDetail_Sungrow: [
          {value: 'PVPower', text: this.$t('datepick.sumpv')},
          {value: 'Timer', text: this.$t('datepick.timer')},
          {value: 'TodayProduction', text: this.$t('datepick.todayprod')},
          {value: 'TotalProduction', text: this.$t('datepick.todayprod')},
          {value: 'Radiation', text: this.$t('datepick.radiation')}
      ],
      selectArrDetail_Sunspec: [
          {value: 'PVPower', text: this.$t('datepick.sumpv')},
          {value: 'InverterPower', text: this.$t('datepick.inverterpower')},
          {value: 'TodayProduction', text: this.$t('datepick.todayprod')},
          {value: 'TotalProduction', text: this.$t('datepick.todayprod')},
          {value: 'Radiation', text: this.$t('datepick.radiation')}
      ],
      selectArrDate: [
          {value: 'Power', text: this.$t('datepick.sumpv')},
          {value: 'TodayProduction', text: this.$t('datepick.sumpv')},
          {value: 'Money', text: this.$t('datepick.totalmoneysave')}
      ],
      selectArrDate_Radiation: [
          {value: 'Power', text: this.$t('datepick.sumpv')},
          {value: 'TodayProduction', text: this.$t('datepick.sumpv')},
          {value: 'Money', text: this.$t('datepick.totalmoneysave')},
          {value: 'Radiation', text: this.$t('datepick.radiation')},
          {value: 'TotalRadiation', text: this.$t('datepick.totalradiation')}
      ],
      selectArrMonth_Radiation: [
          {value: 'Power', text: this.$t('datepick.sumpv')},
          {value: 'MonthProduction', text: this.$t('datepick.monthprod')},
          {value: 'Money', text: this.$t('datepick.totalmoneysave')},
          {value: 'Radiation', text: this.$t('datepick.totalradiation')}
      ],
      selectArrMonth: [
        {value: 'Power', text: this.$t('datepick.sumpv')},
        {value: 'MonthProduction', text: this.$t('datepick.monthprod')},
        {value: 'Money', text: this.$t('datepick.totalmoneysave')}
      ],
      selectArrYear_Radiation: [
        {value: 'Power', text: this.$t('datepick.sumpv')},
        {value: 'YearProduction', text: this.$t('datepick.yearprod')},
        {value: 'Money', text: this.$t('datepick.totalmoneysave')},
        {value: 'Radiation', text: this.$t('datepick.totalradiation')}
      ],
      selectArrYear: [
        {value: 'Power', text: this.$t('datepick.sumpv')},
        {value: 'YearProduction', text: this.$t('datepick.yearprod')},
        {value: 'Money', text: this.$t('datepick.totalmoneysave')}
      ],
      selectedCheckBoxDetail_Sungrow: ['PVPower', 'Timer', 'TodayProduction', 'TotalProduction'],
      selectedCheckBoxDetail: ['SumPV', 'SumPLoad', 'Timer','TodayProduction'],
      selectedCheckBoxDetail_Amata: ['SumPV', 'SumPLoad', 'Timer','Production'],
      selectCheckBoxDetail_MultiPVSofar10: ['pv_power', 'inverter_power', 'load_power', 'charge_power'],
      selectedCheckBoxDetail_Huawei: ['SumPV', 'Timer','TodayProduction'],
      selectedCheckBoxDetail_Sunspec: ['PVPower', 'InverterPower', 'TodayProduction', 'TotalProduction'],
      selectedCheckBoxDate: ['Power', 'TodayProduction', 'Money'],
      selectedCheckBoxMonth: ['Power', 'MonthProduction', 'Money'],
      selectedCheckBoxYear: ['Power', 'YearProduction', 'Money'],

      //SMART BUILDING SELECT ZONE
      selectArrDetail_Smartbuilding_Comsump_1: [
        {value: 'GetPV_Total', text: this.$t('datepick.totalpv')},
        {value: 'PLoadToday', text: this.$t('datepick.energyconsume')},
        {value: 'PLoadTotal', text: this.$t('datepick.totalenergyconsume')}
      ],
      selectedCheckBox_Smartbuilding_Comsump_1: ['GetPV_Total', 'PLoadToday', 'PLoadTotal'],

      selectArrDetail_Smartbuilding_Comsump_2: [
        {value: 'GetPV_MG', text: this.$t('datepick.pconsump')},
        {value: 'getEnergy_MG', text: this.$t('datepick.energyconsume')},
        {value: 'getPV_BackUpCabine', text: this.$t('datepick.cabinetpower')},
        {value: 'getPV_SuppilerPumpCabinet', text: this.$t('datepick.pumppower')}
      ],
      selectedCheckBox_Smartbuilding_Comsump_2: ['GetPV_MG', 'getEnergy_MG', 
      'getPV_BackUpCabine', 'getPV_SuppilerPumpCabinet'],

      selectArrDetail_Smartbuilding_Comsump_3: [
        {value: 'getPV_1', text: this.$t('datepick.pconsump')},
        {value: 'getEnergy_1', text: this.$t('datepick.energyconsume')}
      ],
      selectedCheckBox_Smartbuilding_Comsump_3: ['getPV_1', 'getEnergy_1'],

      selectArrDetail_Smartbuilding_Comsump_4: [
        {value: 'getPV_3', text: this.$t('datepick.pconsump')},
        {value: 'getEnergy_3', text: this.$t('datepick.energyconsume')},
        {value: 'getPV_PressurePump', text: this.$t('datepick.boosterpower')},
        {value: 'getPV_ServerRoom', text: this.$t('datepick.serverroom')}
      ],
      selectedCheckBox_Smartbuilding_Comsump_4: ['getPV_3', 'getEnergy_3',
      'getPV_PressurePump', 'getPV_ServerRoom'],

      selectArrDetail_Smartbuilding_Comsump_5: [
        {value: 'getPV_4', text: this.$t('datepick.pconsump')},
        {value: 'getEnergy_4', text: this.$t('datepick.energyconsume')},
        {value: 'getPV_Elevator', text: this.$t('datepick.elevator')},
        {value: 'getEnergy_Elevator', text: this.$t('datepick.elevatorene')}
      ],
      selectedCheckBox_Smartbuilding_Comsump_5: ['getPV_4', 'getEnergy_4', 
      'getPV_Elevator', 'getEnergy_Elevator'],

      selectArrDetail_Smartbuilding_Comsump_6: [
        {value: 'getPV_AirConditioner', text: this.$t('datepick.aircon')},
        {value: 'getEnergy_AirConditioner', text: this.$t('datepick.airconene')},
        {value: 'getPV_HotPartCabinet', text: this.$t('datepick.consump')}
      ],
      selectedCheckBox_Smartbuilding_Comsump_6: ['getPV_AirConditioner', 
      'getEnergy_AirConditioner', 'getPV_HotPartCabinet']
      //SMART BUILDING SELECT ZONE
    }
  },
  computed: {
    rows () {
      return this.items.length
    }
  },
  mounted () {
    //Summary by total
    let pvType = checkAdminToken().pvType
    let token = checkAdminToken().token
    let device = checkAdminToken().device
    //intial lang
    this.$http.defaults.headers.common['X-LANGUAGE'] = this.$route.params.lang

    if (this.$props.Serial === 'tong-hop') {
      this.selectedRadio = 'date'
      this.selectedCheckBox = ['TodayProduction', 'totalMoney']
      this.selectArr = [
            {text: this.$t('datepick.todayprod'), value: 'TodayProduction'},
            {text: this.$t('datepick.totalmoneysave'), value: 'totalMoney'}
        ]
      this.$http.post(`${this.$store.state.pvSofarApi}/date-year-total`, {
        fromDate: getDateTime().fromDate_temp,
        toDate: getDateTime().toDate_temp,
        selected: this.selectedCheckBox,
        by: this.selectedRadio,
        pvType: pvType, 
        device: device
      }, { headers: {'authorization': token} }).then(response => {
          let dataRes = response.data.data
          this.fields = dataRes.fields
          this.items = dataRes.dataTable
          this.loaded_selected = true
      }).catch(err => {
        if (err.response === undefined) {
          this.error =  `Can't connect server`
          this.showErrorAlert = true
          this.loaded_selected = true
        } else {
          let errMsg = err.response.data.message
          this.error = errMsg
          this.showErrorAlert = true
          this.loaded_selected = true
        }
      })
    } else {
    //Summary by Module
        if (pvType === 'SOFAR') {
          if (device === 'MultiPVSofar10') {
            this.selectArr = this.selectArrDetail_MultiPVSofar10
            this.selectedCheckBox = this.selectCheckBoxDetail_MultiPVSofar10
          } 
          else if (device === 'Sungrow') {
            this.selectArr = this.selectArrDetail_Sungrow
            this.selectedCheckBox = this.selectedCheckBoxDetail_Sungrow
          }
          else if (device === 'Sunspec' || device === 'MultiSunspec') {
            this.selectArr = this.selectArrDetail_Sunspec
            this.selectedCheckBox = this.selectedCheckBoxDetail_Sunspec
          }
          else if (device === 'Amata' || device === 'PV-SMA-OffGrid1') {
            this.selectArr = this.selectArrDetail_Amata
            this.selectedCheckBox = this.selectedCheckBoxDetail_Amata
          }
          else if (device === 'SmartBuilding1') {
            if (this.$props.Serial === '01-C012-17-0066') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_1
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_1
            }
            else if (this.$props.Serial === '01-C012-0418-0005') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_2
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_2
            }
            else if (this.$props.Serial === '01-C012-17-0059' || 
            this.$props.Serial === '01-C012-0418-0001') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_3
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_3
            }
            else if (this.$props.Serial === '01-C012-0418-0003') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_4
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_4
            }
            else if (this.$props.Serial === '01-C012-0418-0002') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_5
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_5
            }
            else if (this.$props.Serial === '01-C012-1218-0014') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_6
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_6
            }
            else if (this.$props.Serial === '01-C012-2018-0023') {
              this.selectArr = this.selectArrDetail_Sunspec
              this.selectedCheckBox = this.selectedCheckBoxDetail_Sunspec
            }
          }
          else {
            this.selectArr = this.selectArrDetail
            this.selectedCheckBox = this.selectedCheckBoxDetail
          }
        } else if (pvType === 'HUAWEI') {
          if (device === 'MultiPVHuawei1') {
            this.selectArr = this.selectArrDetail_HuaweiRadiation
            this.selectedCheckBox = this.selectedCheckBoxDetail_Huawei
          } else {
            this.selectArr = this.selectArrDetail_Huawei
            this.selectedCheckBox = this.selectedCheckBoxDetail_Huawei
          }
        }
        this.loaded_selected = false
        this.fromDate_temp = getDateTime().fromDate_temp
        this.toDate_temp = getDateTime().toDate_temp
        let Serial = this.$props.Serial
        let selectedCheckBox_temp = this.selectedCheckBox

        this.$http.post(`${this.$store.state.pvSofarApi}/detail-table`, {
          fromDate: this.fromDate_temp,
          toDate: this.toDate_temp,
          serial: Serial,
          selected: selectedCheckBox_temp,
          pvType: pvType,
          device: device
        }, { headers: {'authorization': token} }).then(response => {
          let table = response.data.data
          
          if (device === 'MultiPVSofar10' ||
              device === 'Sunspec' || device === 'MultiSunspec' ||
              device === 'SmartBuilding1' || device === 'Sungrow') {
            
          } else {
            table.fields.push({key: 'SessionID', label: 'Chi tiết'})
          }
          this.fields = table.fields
          this.items = table.tableData
          this.loaded_selected = true
        }).catch(err => {
          if (err.response === undefined) {
          this.error =  `Can't connect server`
          this.showErrorAlert = true
          this.loaded_selected = true
        } else {
          let errMsg = err.response.data.message
          this.error = errMsg
          this.showErrorAlert = true
          this.loaded_selected = true
        }
        })
    }
  },
  methods: {
    handelSubmit () {
      let token = checkAdminToken().token
      let pvType = checkAdminToken().pvType
      let device = checkAdminToken().device
      if (this.$props.Serial === 'tong-hop') {
        if (this.selectedRadio === 'date') {
            this.loaded_selected = false
            let fromDate = this.$store.state.fromDate
            let toDate = this.$store.state.toDate
            if (this.selectedCheckBox.length === 0) {
              this.$refs.bvmodalexample.show()
              this.loaded_selected = true
            } else {
              this.$http.post(`${this.$store.state.pvSofarApi}/date-year-total`, {
                Serial: this.$props.Serial,
                fromDate: fromDate,
                toDate: toDate,
                by: this.selectedRadio,
                selected: this.selectedCheckBox,
                pvType: pvType, 
                device: device
              }, {headers: {authorization: token}}).then(response => {
                let resData = response.data.data
                this.fields = resData.fields
                this.items = resData.dataTable
                this.loaded_selected = true
              }).catch(err => {
                if (err.response === undefined) {
                this.error =  `Can't connect server`
                this.showErrorAlert = true
                this.loaded_selected = true
              } else {
                let errMsg = err.response.data.message
                this.error = errMsg
                this.showErrorAlert = true
                this.loaded_selected = true
              }
              })
            }
        } else if (this.selectedRadio === 'month') {
            this.loaded_selected = false
            this.selectedRadio = 'month'
            let fromDate = this.$store.state.fromMonth
            let toDate = this.$store.state.toMonth
            if (this.selectedCheckBox.length === 0) {
              this.$refs.bvmodalexample.show()
              this.loaded_selected = true
            } else {
              this.$http.post(`${this.$store.state.pvSofarApi}/date-year-total`, {
              Serial: this.$props.Serial,
              fromDate: this.$store.state.fromMonth,
              toDate: this.$store.state.toMonth,
              by: this.selectedRadio,
              selected: this.selectedCheckBox,
              pvType: pvType, 
              device: device
              }, {headers: {authorization: token}}).then(response => {
                let resData = response.data.data
                this.fields = resData.fields
                this.items = resData.dataTable
                this.loaded_selected = true
              }).catch(err => {
                if (err.response === undefined) {
                this.error =  `Can't connect server`
                this.showErrorAlert = true
                this.loaded_selected = true
              } else {
                let errMsg = err.response.data.message
                this.error = errMsg
                this.showErrorAlert = true
                this.loaded_selected = true
              }
              })
            }
        } else if (this.selectedRadio === 'year') {
            this.loaded_selected = false
            this.selectedRadio = 'year'
            let fromDate = this.$store.state.fromYear
            let toDate = this.$store.state.toYear
            if (this.selectedCheckBox.length === 0) {
              this.$refs.bvmodalexample.show()
              this.loaded_selected = true
            } else {
              this.$http.post(`${this.$store.state.pvSofarApi}/date-year-total`, {
              Serial: this.$props.Serial,
              fromDate: fromDate,
              toDate: toDate,
              by: this.selectedRadio,
              selected: this.selectedCheckBox,
              pvType: pvType, 
              device: device
              }, {headers: {authorization: token}}).then(response => {
                let resData = response.data.data
                this.fields = resData.fields
                this.items = resData.dataTable
                this.loaded_selected = true
              }).catch(err => {
                if (err.response === undefined) {
                this.error =  `Can't connect server`
                this.showErrorAlert = true
                this.loaded_selected = true
              } else {
                let errMsg = err.response.data.message
                this.error = errMsg
                this.showErrorAlert = true
                this.loaded_selected = true
              }
              })
            }
          }
      } else {
        if (this.selectedRadio === 'detail') {
            if (this.selectedCheckBox.length === 0) {
              this.$refs.bvmodalexample.show()
              this.loaded_selected = true
            } else {
              this.loaded_selected = false
              let fromDate = this.$store.state.fromDate_detail
              let toDate = this.$store.state.toDate_detail
              let Serial = this.$props.Serial
              let selectedCheckBox = this.selectedCheckBox

              this.$http.post(`${this.$store.state.pvSofarApi}/detail-table`, {
                fromDate: fromDate,
                toDate: toDate,
                serial: Serial,
                selected: selectedCheckBox,
                pvType: pvType,
                device: device
              }, { headers: {'authorization': token} }).then(response => {
                let table = response.data.data
                if (device === 'MultiPVSofar10' ||
                    device === 'Sunspec' || device === 'MultiSunspec' ||
                    device === 'SmartBuilding1' || device === 'Sungrow') {

                } else {
                  let dataField = table.fields.push({key: 'SessionID', label: 'Chi tiết'})
                }
                this.fields = table.fields
                this.items = table.tableData
                this.loaded_selected = true
              }).catch(err => {  
                if (err.response === undefined) {
                this.error =  `Can't connect server`
                this.showErrorAlert = true
                this.loaded_selected = true
              } else {
                let errMsg = err.response.data.message
                this.error = errMsg
                this.showErrorAlert = true
                this.loaded_selected = true
              }
              })
            }
        } else if (this.selectedRadio === 'date') {
            this.loaded_selected = false
            let fromDate = this.$store.state.fromDate
            let toDate = this.$store.state.toDate
            if (this.selectedCheckBox.length === 0) {
              this.$refs.bvmodalexample.show()
              this.loaded_selected = true
            } else {
              this.$http.post(`${this.$store.state.pvSofarApi}/date-year`, {
                Serial: this.$props.Serial,
                fromDate: fromDate,
                toDate: toDate,
                by: this.selectedRadio,
                selected: this.selectedCheckBox,
                pvType: pvType,
                device: device
              }, {headers: {authorization: token}}).then(response => {
                let resData = response.data.data
                this.fields = resData.fields
                this.items = resData.dataTable
                this.loaded_selected = true
              }).catch(err => {
                if (err.response === undefined) {
                this.error =  `Can't connect server`
                this.showErrorAlert = true
                this.loaded_selected = true
              } else {
                let errMsg = err.response.data.message
                this.error = errMsg
                this.showErrorAlert = true
                this.loaded_selected = true
              }
              })
            }
        } else if (this.selectedRadio === 'month') {
            this.loaded_selected = false
            this.selectedRadio = this.selectedRadio
            let fromDate = this.$store.state.fromMonth
            let toDate = this.$store.state.toMonth
            if (this.selectedCheckBox.length === 0) {
              this.$refs.bvmodalexample.show()
              this.loaded_selected = true
            } else {
              this.$http.post(`${this.$store.state.pvSofarApi}/date-year`, {
              Serial: this.$props.Serial,
              fromDate: this.$store.state.fromMonth,
              toDate: this.$store.state.toMonth,
              by: this.selectedRadio,
              selected: this.selectedCheckBox,
              pvType: pvType,
              device:device
              }, {headers: {authorization: token}}).then(response => {
                let resData = response.data.data
                this.fields = resData.fields
                this.items = resData.dataTable
                this.loaded_selected = true
              }).catch(err => {
                if (err.response === undefined) {
                this.error =  `Can't connect server`
                this.showErrorAlert = true
                this.loaded_selected = true
              } else {
                let errMsg = err.response.data.message
                this.error = errMsg
                this.showErrorAlert = true
                this.loaded_selected = true
              }
              })
            }
        } else if (this.selectedRadio === 'year') {
          this.loaded_selected = false
          this.selectedRadio = this.selectedRadio
          let fromDate = this.$store.state.fromYear
          let toDate = this.$store.state.toYear
          if (this.selectedCheckBox === 0) {
            this.$refs.bvmodalexample.show()
              this.loaded_selected = true
          } else {
            this.$http.post(`${this.$store.state.pvSofarApi}/date-year`, {
            Serial: this.$props.Serial,
            fromDate: fromDate,
            toDate: toDate,
            by: this.selectedRadio,
            selected: this.selectedCheckBox,
            pvType: pvType,
            device: device
            }, {headers: {authorization: token}}).then(response => {
              let resData = response.data.data
              this.fields = resData.fields
              this.items = resData.dataTable
              this.loaded_selected = true
            }).catch(err => {
                if (err.response === undefined) {
                this.error =  `Can't connect server`
                this.showErrorAlert = true
                this.loaded_selected = true
              } else {
                let errMsg = err.response.data.message
                this.error = errMsg
                this.showErrorAlert = true
                this.loaded_selected = true
              }
            })
          }
        }
      }
  },
    handle(row) {
      let token = checkAdminToken().token
      let pvType = checkAdminToken().pvType
      let device = checkAdminToken().device
      row.detailLoaded = false
        if (row.item.SessionID) {
          this.$set(row.item, '_showDetails', !row.item._showDetails);
          if (row.item._showDetails == true) {
            this.$http.post(`${this.$store.state.pvSofarApi}/list-detail`, {
              Serial: this.$props.Serial,
              sessionID: row.item.SessionID,
              pvType: pvType,
              device: device
            }, { headers: {'authorization': token} }).then(response => {
              let dataDetail = response.data.data
              this.fieldsDetail = dataDetail.fields
              row.item.detail = dataDetail.dataTable
              row.detailLoaded = true
            })
          } else {

          }
        } else {
          this.$set(row.item, '_showDetails', !row.item._showDetails);
            if (row.item._showDetails == true) {
              this.$http.post(`${this.$store.state.pvSofarApi}/list-detail`, {
                  Serial: this.$props.Serial,
                  sessionID: row.item.CurrentDate,
                  pvType: pvType
              }, { headers: {'authorization': token} }).then(response => {
                  let dataDetail = response.data.data
                  this.fieldsDetail = dataDetail.fields
                  row.item.detail = dataDetail.dataTable
                  row.detailLoaded = true
                })
            } else {

            }
        }
    },
    handleRadioChange (arg) {
      let token = checkAdminToken().token
      let pvType = checkAdminToken().pvType
      let device = checkAdminToken().device
      if (this.$props.Serial === 'tong-hop') {
        if (arg === 'date') {
          this.selectedRadio = 'date'
          this.selectedCheckBox = ['TodayProduction', 'totalMoney']
          this.selectArr = [
                {text: this.$t('datepick.todayprod'), value: 'TodayProduction'},
                {text: this.$t('datepick.totalmoneysave'), value: 'totalMoney'}
            ]
          this.$http.post(`${this.$store.state.pvSofarApi}/date-year-total`, {
            fromDate: getDateTime().fromDate_temp,
            toDate: getDateTime().toDate_temp,
            selected: this.selectedCheckBox,
            by: this.selectedRadio,
            pvType: pvType,
            device: device
          }, { headers: {'authorization': token} }).then(response => {
              let dataRes = response.data.data
              this.fields = dataRes.fields
              this.items = dataRes.dataTable
              this.loaded_selected = true
          }).catch(err => {
              if (err.response === undefined) {
              this.error =  `Can't connect server`
              this.showErrorAlert = true
              this.loaded_selected = true
            } else {
              let errMsg = err.response.data.message
              this.error = errMsg
              this.showErrorAlert = true
              this.loaded_selected = true
            }
          })
        } else if (arg === 'month') {
          this.loaded_selected = false
          this.selectedRadio = 'month'
          this.selectedCheckBox = ['MonthProduction', 'totalMoney']
          this.selectArr = [
                {text: this.$t('datepick.todayprod'), value: 'MonthProduction'},
                {text: this.$t('datepick.totalmoneysave'), value: 'totalMoney'}
            ]
            this.$http.post(`${this.$store.state.pvSofarApi}/date-year-total`, {
            Serial: this.$props.Serial,
            fromDate: this.$store.state.fromMonth,
            toDate: this.$store.state.toMonth,
            by: arg,
            selected: this.selectedCheckBox,
            pvType: pvType, 
            device: device
            }, {headers: {authorization: token}}).then(response => {
              let resData = response.data.data
              this.fields = resData.fields
              this.items = resData.dataTable
              this.loaded_selected = true
            }).catch(err => {
                if (err.response === undefined) {
              this.error =  `Can't connect server`
              this.showErrorAlert = true
              this.loaded_selected = true
            } else {
              let errMsg = err.response.data.message
              this.error = errMsg
              this.showErrorAlert = true
              this.loaded_selected = true
            }
            })
        } else if (arg === 'year') {
          this.loaded_selected = false
          this.selectedRadio = 'month'
          this.selectedCheckBox = ['YearProduction', 'totalMoney']
          this.selectArr = [
                {text: this.$t('datepick.todayprod'), value: 'YearProduction'},
                {text: this.$t('datepick.totalmoneysave'), value: 'totalMoney'}
            ]
            this.$http.post(`${this.$store.state.pvSofarApi}/date-year-total`, {
            Serial: this.$props.Serial,
            fromDate: this.$store.state.fromYear,
            toDate: this.$store.state.toYear,
            by: arg,
            selected: this.selectedCheckBox,
            pvType: pvType, 
            device: device
            }, {headers: {authorization: token}}).then(response => {
              let resData = response.data.data
              this.fields = resData.fields
              this.items = resData.dataTable
              this.loaded_selected = true
            }).catch(err => {
                if (err.response === undefined) {
              this.error =  `Can't connect server`
              this.showErrorAlert = true
              this.loaded_selected = true
            } else {
              let errMsg = err.response.data.message
              this.error = errMsg
              this.showErrorAlert = true
              this.loaded_selected = true
            }
            })
        }
      } else {
        if(arg === 'detail') {
          if (pvType === 'SOFAR') {
            if (device === 'MultiPVSofar10') {
              this.selectArr = this.selectArrDetail_MultiPVSofar10
              this.selectedCheckBox = this.selectCheckBoxDetail_MultiPVSofar10
            } else if (device === 'Sungrow') {
              this.selectArr = this.selectArrDetail_Sungrow
              this.selectedCheckBox = this.selectedCheckBoxDetail_Sungrow
            }
            else if (device === 'Sunspec' || device === 'MultiSunspec') {
              this.selectArr = this.selectArrDetail_Sunspec
              this.selectedCheckBox = this.selectedCheckBoxDetail_Sunspec
            }
            else if (device === 'Amata' || device === 'PV-SMA-OffGrid1') {
              this.selectArr = this.selectArrDetail_Amata
              this.selectedCheckBox = this.selectedCheckBoxDetail_Amata
            }
            else if (device === 'SmartBuilding1') {
              if (this.$props.Serial === '01-C012-17-0066') {
                this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_1
                this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_1
              }
              else if (this.$props.Serial === '01-C012-0418-0005') {
                this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_2
                this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_2
              }
              else if (this.$props.Serial === '01-C012-17-0059' || 
              this.$props.Serial === '01-C012-0418-0001') {
                this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_3
                this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_3
              }
              else if (this.$props.Serial === '01-C012-0418-0003') {
                this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_4
                this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_4
              }
              else if (this.$props.Serial === '01-C012-0418-0002') {
                this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_5
                this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_5
              }
              else if (this.$props.Serial === '01-C012-1218-0014') {
                this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_6
                this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_6
              }
              else if (this.$props.Serial === '01-C012-2018-0023') {
                this.selectArr = this.selectArrDetail_Sunspec
                this.selectedCheckBox = this.selectedCheckBoxDetail_Sunspec
              }
            }
            else {
              this.selectArr = this.selectArrDetail
              this.selectedCheckBox = this.selectedCheckBoxDetail
            }
          } else if (pvType === 'HUAWEI') {
            this.selectArr = this.selectArrDetail_Huawei
            this.selectedCheckBox = this.selectedCheckBoxDetail_Huawei
          }
          this.loaded_selected = false
          this.fromDate_temp = getDateTime().fromDate_temp
          this.toDate_temp = getDateTime().toDate_temp
          let Serial = this.$props.Serial
          let selectedCheckBox_temp = this.selectedCheckBox
          if (this.selectedCheckBox.length === 0) {
            this.$refs.bvmodalexample.show()
              this.loaded_selected = true
          } else {
            this.loaded_selected = false
            let fromDate = this.fromDate_temp
            let toDate = this.toDate_temp
            let Serial = this.$props.Serial
            let selectedCheckBox_temp = this.selectedCheckBox

            this.$http.post(`${this.$store.state.pvSofarApi}/detail-table`, {
              fromDate: fromDate,
              toDate: toDate,
              serial: Serial,
              selected: selectedCheckBox_temp,
              pvType: pvType,
              device: device
            }, { headers: {'authorization': token} }).then(response => {
              let table = response.data.data
              if (device === 'MultiPVSofar10' ||
                  device === 'Sunspec' || device === 'MultiSunspec' ||
                  device === 'SmartBuilding1' || device === 'Sungrow') {

              } else {
                let dataField = table.fields.push({key: 'SessionID', label: 'Chi tiết'})
              }
              this.fields = table.fields
              this.items = table.tableData
              this.loaded_selected = true
            }).catch(err => {
                if (err.response === undefined) {
              this.error =  `Can't connect server`
              this.showErrorAlert = true
              this.loaded_selected = true
            } else {
              let errMsg = err.response.data.message
              this.error = errMsg
              this.showErrorAlert = true
              this.loaded_selected = true
            }
            })
          }
        } else if (arg === 'date') {
          this.loaded_selected = false
          this.selectedRadio = arg
          if (device === 'SmartBuilding1') {
            if (this.$props.Serial === '01-C012-17-0066') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_1
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_1
            }
            else if (this.$props.Serial === '01-C012-0418-0005') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_2
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_2
            }
            else if (this.$props.Serial === '01-C012-17-0059' || 
            this.$props.Serial === '01-C012-0418-0001') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_3
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_3
            }
            else if (this.$props.Serial === '01-C012-0418-0003') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_4
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_4
            }
            else if (this.$props.Serial === '01-C012-0418-0002') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_5
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_5
            }
            else if (this.$props.Serial === '01-C012-1218-0014') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_6
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_6
            }
            else if (this.$props.Serial === '01-C012-2018-0023') {
              this.selectArr = this.selectArrDate_Radiation
              this.selectedCheckBox = this.selectedCheckBoxDate
            }
          } 
          else if (device === 'Sunspec' || device === 'MultiSunspec' || device === 'Amata' || 
            device === 'MultiPVHuawei1') {
            this.selectArr = this.selectArrDate_Radiation
            this.selectedCheckBox = this.selectedCheckBoxDate
          }
          else {
            this.selectArr = this.selectArrDate_Radiation
            this.selectedCheckBox = this.selectedCheckBoxDate
          }
          let fromDate = getDateTime().fromDate_temp
          let toDate = getDateTime().toDate_temp
          if (this.selectedCheckBox.length === 0) {
            this.$refs.bvmodalexample.show()
              this.loaded_selected = true
          } else {
            this.$http.post(`${this.$store.state.pvSofarApi}/date-year`, {
              Serial: this.$props.Serial,
              fromDate: fromDate,
              toDate: toDate,
              by: arg,
              selected: this.selectedCheckBox,
              pvType: pvType,
              device: device
            }, {headers: {authorization: token}}).then(response => {
              let resData = response.data.data
              this.fields = resData.fields
              this.items = resData.dataTable
              this.loaded_selected = true
            }).catch(err => {
                if (err.response === undefined) {
              this.error =  `Can't connect server`
              this.showErrorAlert = true
              this.loaded_selected = true
            } else {
              let errMsg = err.response.data.message
              this.error = errMsg
              this.showErrorAlert = true
              this.loaded_selected = true
            }
            })
          }
        } else if (arg === 'month') {
          this.loaded_selected = false
          this.selectedRadio = arg
          if (device === 'SmartBuilding1') {
            if (this.$props.Serial === '01-C012-17-0066') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_1
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_1
            }
            else if (this.$props.Serial === '01-C012-0418-0005') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_2
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_2
            }
            else if (this.$props.Serial === '01-C012-17-0059' || 
            this.$props.Serial === '01-C012-0418-0001') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_3
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_3
            }
            else if (this.$props.Serial === '01-C012-0418-0003') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_4
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_4
            }
            else if (this.$props.Serial === '01-C012-0418-0002') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_5
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_5
            }
            else if (this.$props.Serial === '01-C012-1218-0014') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_6
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_6
            }
            else if (this.$props.Serial === '01-C012-2018-0023') {
              this.selectArr = this.selectArrMonth_Radiation
              this.selectedCheckBox = this.selectedCheckBoxMonth
            }
          }
          else if (device === 'Sunspec' || device === 'MultiSunspec' || device === 'Amata' ||
            device === 'MultiPVHuawei1') {
            this.selectArr = this.selectArrMonth_Radiation
            this.selectedCheckBox = this.selectedCheckBoxMonth
          }
          else {
            this.selectArr = this.selectArrMonth_Radiation
            this.selectedCheckBox = this.selectedCheckBoxMonth
          }
          let fromDate = this.$store.state.fromMonth
          let toDate = this.$store.state.toMonth
            this.$http.post(`${this.$store.state.pvSofarApi}/date-year`, {
            Serial: this.$props.Serial,
            fromDate: this.$store.state.fromMonth,
            toDate: this.$store.state.toMonth,
            by: arg,
            selected: this.selectedCheckBox,
            pvType: pvType,
            device: device
            }, {headers: {authorization: token}}).then(response => {
              let resData = response.data.data
              this.fields = resData.fields
              this.items = resData.dataTable
              this.loaded_selected = true
            }).catch(err => {
              if (err.response === undefined) {
              this.error =  `Can't connect server`
              this.showErrorAlert = true
              this.loaded_selected = true
            } else {
              let errMsg = err.response.data.message
              this.error = errMsg
              this.showErrorAlert = true
              this.loaded_selected = true
            }
            })
        } else if (arg === 'year') {
          this.loaded_selected = false
          this.selectedRadio = arg
          if (device === 'SmartBuilding1') {
            if (this.$props.Serial === '01-C012-17-0066') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_1
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_1
            }
            else if (this.$props.Serial === '01-C012-0418-0005') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_2
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_2
            }
            else if (this.$props.Serial === '01-C012-17-0059' || 
            this.$props.Serial === '01-C012-0418-0001') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_3
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_3
            }
            else if (this.$props.Serial === '01-C012-0418-0003') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_4
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_4
            }
            else if (this.$props.Serial === '01-C012-0418-0002') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_5
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_5
            }
            else if (this.$props.Serial === '01-C012-1218-0014') {
              this.selectArr = this.selectArrDetail_Smartbuilding_Comsump_6
              this.selectedCheckBox = this.selectedCheckBox_Smartbuilding_Comsump_6
            }
            else if (this.$props.Serial === '01-C012-2018-0023') {
              this.selectArr = this.selectArrYear_Radiation
              this.selectedCheckBox = this.selectedCheckBoxYear
            }
          }
          else if  (device === 'Sunspec' || device === 'MultiSunspec' || device === 'Amata' ||
            device === 'MultiPVHuawei1') {
            this.selectArr = this.selectArrYear_Radiation
            this.selectedCheckBox = this.selectedCheckBoxYear
          }
          else {
            this.selectArr = this.selectArrYear_Radiation
            this.selectedCheckBox = this.selectedCheckBoxYear
          }
          let fromDate = this.$store.state.fromYear
          let toDate = this.$store.state.toYear
            this.$http.post(`${this.$store.state.pvSofarApi}/date-year`, {
            Serial: this.$props.Serial,
            fromDate: fromDate,
            toDate: toDate,
            by: arg,
            selected: this.selectedCheckBox,
            pvType: pvType,
            device: device
            }, {headers: {authorization: token}}).then(response => {
              let resData = response.data.data
              this.fields = resData.fields
              this.items = resData.dataTable
              this.loaded_selected = true
            }).catch(err => {
                if (err.response === undefined) {
              this.error =  `Can't connect server`
              this.showErrorAlert = true
              this.loaded_selected = true
            } else {
              let errMsg = err.response.data.message
              this.error = errMsg
              this.showErrorAlert = true
              this.loaded_selected = true
            }
            })
        }
      }
    },
    getPicPath (picName) {
      let picPath = require(`../../../assets/images/${picName}`)
      return picPath
    },
    onExport () {
      if (this.selectedCheckBox.length === 0) {
        this.$refs.bvmodalexample.show()
              this.loaded_selected = true
      } else {
        let dataExcel = XLSX.utils.json_to_sheet(this.items)
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, dataExcel, 'Dữ liệu')
        XLSX.writeFile(wb, 'data.xlsx')
      }
    },
  },
  watch: {
    Serial: function(newVal, oldVal) {
    }
  }
}
</script>

<style scoped>
#date-time-picker {
    padding: 10px 0;
    border-bottom: 1px solid #b3b3b3;
}

#radio-group {
    border-bottom: 1px solid #b3b3b3;
    padding: 10px 0;
}

table {
  text-align: center;
}

#exported {
  float: right;
}

#submitbtn {
  float: right;
  margin: 10px 0;
}

.fixed-content {
    width: 100%;
    max-height: 100%;
    overflow-y:scroll;
    overflow-x:scroll;
}

</style>
