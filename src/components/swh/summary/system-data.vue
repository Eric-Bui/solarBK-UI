<template>
  <div>
    <b-button v-b-toggle.thongso-collapse class="m-1" variant="secondary">Ẩn/Hiện Thông số</b-button>
    <b-collapse visible id="thongso-collapse">
      <b-form-group>
        <b-form-checkbox-group @change="checkboxClicked" id="form-checkbox" v-model="selected" name="thongso_select">
          <p>Thông số chung</p>
          <b-row id="thongso-chung">
            <b-col sm="3">
              <b-form-checkbox value="A1">
                Nhiệt độ nước lạnh đầu vào
                </b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <b-form-checkbox value="A0">Nhiệt độ nước nóng đầu ra</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <b-form-checkbox value="A3">Lượng nước sử dụng</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <b-form-checkbox value="A2">Điện năng tiêu thụ</b-form-checkbox>
            </b-col>
          </b-row>
          <p>Hệ 1</p>
          <b-row id="nhietdo-tam1">
            <b-col sm="3">
              <b-form-checkbox value="A4">Nhiệt độ trên tấm hệ 1</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <b-form-checkbox value="A12">Nhiệt độ trên bồn Solar 1</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <b-form-checkbox value="A8">Nhiệt độ đáy bồn Solar 1</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <b-form-checkbox value="A18">Trạng thái bơm đối lưu bồn Solar 1</b-form-checkbox>
            </b-col>
          </b-row>
          <div v-if="numGen == 2">
          <p>Hệ 2</p>
          <b-row id="nhietdo-tam2">
            <b-col sm="3">
              <b-form-checkbox value="A5">Nhiệt độ trên tấm hệ 2</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <b-form-checkbox value="A13">Nhiệt độ trên bồn Solar 2</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <b-form-checkbox value="A9">Nhiệt độ đáy bồn Solar 2</b-form-checkbox>
            </b-col>
            <b-col sm="3">
              <b-form-checkbox value="A19">Trạng thái bơm đối lưu bồn Solar 2</b-form-checkbox>
            </b-col>
          </b-row>
          </div>
          <p>Chế độ vận hành các thiết bị khác</p>
          <b-row id="tangap-bomhoi">
            <b-col sm="3" v-for="item in otherOperateParam" :key="item.name">
              <div v-for="(value, name) in item" :key="name">
              <b-form-checkbox :value="name" :key="name">{{value}}</b-form-checkbox>
              </div>
            </b-col>
          </b-row>
        </b-form-checkbox-group>
      </b-form-group>
    </b-collapse>
    <div id="thoigian-hienthi">
      <h6>THỜI GIAN HIỂN THỊ</h6>
      <p>Chọn thời gian hiểu thị:</p>
      <b-row>
        <b-col sm="1">
          <label>Từ:</label>
        </b-col>
        <b-col sm="4">
          <VueCtkDateTimePicker value="null" v-model="from_date"></VueCtkDateTimePicker>
        </b-col>
        <b-col sm="1">
          <label>Đến:</label>
        </b-col>
        <b-col sm="4">
          <VueCtkDateTimePicker value="null" v-model="to_date" required></VueCtkDateTimePicker>
        </b-col>
        <b-col sm="2">
          <b-button type="submit" variant="primary" @click="handleSummary">Xem thống kê</b-button>
        </b-col>
      </b-row>
    </div>
    <div v-if="!loaded">
      <SpinningGroup></SpinningGroup>
    </div>
    <div id="table" v-if="loaded">
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
      <b-row>
        <b-col sm="6">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="table-thongso"
          ></b-pagination>
        </b-col>
        <b-col sm="6" id="export-excel">
          <div v-if='change'>
            <i>Vui lòng bấm "Xem thống kê" sau khi chọn thông số mới</i>
          </div>
          <div v-if='!change'>
          <a @click="onExport">
            <b-img :src="getPicPath('Excel_2003.png')"></b-img>
          </a>
          <a @click="onExport">
            <b-img :src="getPicPath('Excel_2007.png')"></b-img>
          </a>
          </div>
        </b-col>
      </b-row>
      <b-table
        id="table-thongso"
        striped
        hover
        bordered
        head-variant="dark"
        :fields="fields"
        :items="items"
        :per-page="perPage"
        :current-page="currentPage"
      ></b-table>
      <p id="totalRecord"><strong>Tổng cộng:</strong> {{rows}} <i>bản ghi</i></p>
    </div>
    <b-modal id="bv-modal-example" ref="bvmodalexample" hide-footer>
      <template v-slot:modal-title>
        <code>Cảnh báo</code>
      </template>
      <div class="d-block text-center">
        <h6>Chọn ít nhất 1 biến</h6>
      </div>
    </b-modal>
    <b-modal id="bv-modal-example" ref="bvmodalexample_limit" hide-footer>
      <template v-slot:modal-title>
        <code>Cảnh báo</code>
      </template>
      <div class="d-block text-center">
        <h6>Vượt quá số lượng ngày cho phép (trên 100 ngày), vui lòng chọn lại</h6>
      </div>
    </b-modal>
  </div>
</template>

<script>
import SpinningGroup from '../../spinning.vue'
import XLSX from 'xlsx'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

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
  name: `systemData`,
  props: {
    from_date: null,
    to_date: null
  },
  components: {
    SpinningGroup,
    VueCtkDateTimePicker
  },
  data () {
    return {
      selected: ['A0', 'A1', 'A2', 'A3'],
      perPage: 14,
      currentPage: 1,
      items: [],
      fields: [],
      loaded: false,
      error: null,
      showErrorAlert: false,
      change: false,
      otherOperateParam: [],
      numGen: null
    }
  },
  mounted () {
    // REQUIRE IMAGES
    let timenow = new Date()
    let timefrom = new Date(`${timenow.getFullYear()}-${timenow.getMonth() + 1}-${timenow.getDate()}
     04:30:00`)
    this.from_date = timefrom
    this.to_date = timenow
    let token = checkAdminToken()
    this.$http.post(`${this.$store.state.apiURL}/getsystemdata`, {
      paramArr: JSON.stringify(['A1', 'A0', 'A3', 'A2']),
      fromDate: timefrom,
      toDate: timenow
    }, { headers: {'authorization': token} }).then(response => {
      console.log(response)
      this.fields = [
        {key: 'CurrentDate', label: 'Ngày'},
        {key: 'A1', label: 'Nước lạnh đầu vào'},
        {key: 'A0', label: 'Nước nóng đầu ra'},
        {key: 'A3', label: 'Tổng lưu lượng'},
        {key: 'A2', label: 'Điện năng tiêu thụ'}
      ]
      this.items = response.data.data
      this.numGen = response.data.user.numberGen
      this.loaded = true
      if (response.data.user.paramArr == null) {
        this.otherOperateParam = this.otherOperateParam =
        [
          {'A22': 'Trạng thái bơm tăng áp 1'}, {'A23': 'Trạng thái bơm tăng áp 2'},
          {'A26': 'Trạng thái bơm nhiệt 1'}, {'A27': 'Trạng thái bơm nhiệt 2'},
          {'A30': 'Trạng thái điện trở 1'}, {'A31': 'Trạng thái điện trở 2'}
        ]
      } else {
        this.otherOperateParam = response.data.user.paramArr
      }
    }).catch(err => {
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
  computed: {
    rows () {
      return this.items.length
    }
  },
  methods: {
    handleSummary () {
      let token = checkAdminToken()
      if (this.selected.length !== 0) {
        this.loaded = false
        let date1 = new Date(this.from_date)
        let date2 = new Date(this.to_date)
        var Difference_In_Time = Math.abs(date2.getTime() - date1.getTime()); 
        var Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));
        console.log(Difference_In_Days)
        if (Difference_In_Days > 100) {
          this.$refs.bvmodalexample_limit.show()
          this.loaded = true
        } else {
          this.$http.post(`${this.$store.state.apiURL}/getsystemdata`, {
            paramArr: JSON.stringify(this.selected),
            fromDate: this.from_date,
            toDate: this.to_date
          }, { headers: {'authorization': token} }).then(response => {
            // let arr = this.selected
            let arrLabel = response.data.tableParams
            this.fields = arrLabel
            this.items = response.data.data
            this.loaded = true
            this.change = false
          }).catch(err => {
            console.log(err.response)
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
        }
      } else {
        this.$refs.bvmodalexample.show()
        this.loaded = true
      }
    },
    onExport () {
      if (this.selected === undefined) {
        this.change = false
        let dataExcel = XLSX.utils.json_to_sheet(this.items, { header: [ 'A1', 'A0', 'A3', 'A2', 'CurrentDate' ] })
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, dataExcel, 'Dữ liệu')
        XLSX.writeFile(wb, 'data.xlsx')
      } else if (this.selected !== undefined) {
        this.change = false
        let dataExcel = XLSX.utils.json_to_sheet(this.items, { header: this.selected.concat(['CurrentDate']) })
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, dataExcel, 'Dữ liệu')
        XLSX.writeFile(wb, 'data.xlsx')
      }
    },
    checkboxClicked () {
      this.change = true
    },
    getPicPath (picName) {
      let picPath = require(`../../../assets/images/${picName}`)
      return picPath
    }
  }
}
</script>

<style scoped>
#thongso-collapse {
  border: 1px solid #dbdbdb;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
}

#totalRecord {
  text-align: right;
}

#thongso-chung,
#nhietdo-tam1,
#nhietdo-tam2,
#tangap-bomhoi,
#trangthai-bomnhiet,
#van {
  margin: 0 0 0 12px;
}

#form-checkbox p {
  margin: 0 12px;
  margin-block-start: 0px;
  margin-block-end: 0px;
  border-top: 1px solid #dbdbdb;
  padding: 10px 0 5px 0;
  font-weight: bold;
  color: #0064de;
  text-decoration: underline;
}

#thoigian-hienthi {
  margin: 10px 0;
  padding: 10px 12px;
}

#thoigian-hienthi h6 {
  font-weight: bold;
  color: #0064de;
}

#thoigian-hienthi p {
  color: #0064de;
}

#table-thongso {
  text-align: center;
}

#export-excel {
    text-align: right;
}

#export-excel a {
    padding-right: 10px;
}

</style>
