
<template>
  <div id="baocao-page">
    <h6>CHỌN THỜI GIAN HIỂN THỊ</h6>
    <div v-if="!loaded_select">
      <SpinningGroup></SpinningGroup>
    </div>
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
    <b-form v-if="loaded_select">
    <b-row>
      <b-col sm="1">
        <p>Năm:</p>
      </b-col>
      <b-col sm="4">
        <b-form-select v-model="selected_year" :options="options_year" required @change="handleYear">
        </b-form-select>
      </b-col>
      <b-col sm="1">
        <p>Tháng:</p>
      </b-col>
      <b-col sm="4">
        <b-form-select v-model="selected_month" :options="options_month" required @change="handleYear">
        </b-form-select>
      </b-col>
      <b-col sm="2">
        <b-button variant="primary" @click="exportExcel">Xuất báo cáo</b-button>
      </b-col>
    </b-row>
    </b-form>
    <div v-if="loading_table">
      <SpinningGroup></SpinningGroup>
    </div>
    <div id="table" v-if="loaded_selected">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="table-baocao"
      ></b-pagination>
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
      </b-table>
      <p id="total-record"><strong>Tổng cộng: </strong> {{rows}} <i>bản ghi</i></p>
    </div>
  </div>
</template>

<script>
import SpinningGroup from '../../spinning.vue'
import XLSX from 'xlsx'

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
  name: `report`,
  props: {
    msg: String
  },
  components: {
    SpinningGroup
  },
  data: () => {
    return {
      selected_year: null,
      selected_month: null,
      options_year: [
        { value: null, text: 'Chọn năm' }
      ],
      options_month: [
        { value: null, text: 'Chọn tháng' }
      ],
      perPage: 14,
      currentPage: 1,
      items: [],
      loaded_select: false,
      loaded_selected: false,
      loading_table: false,
      fields: [],
      error: null,
      showErrorAlert: false
    }
  },
  computed: {
    check_empty: () => {
      return this.selected_year && this.selected_month
    },
    rows () {
      return this.items.length
    }
  },
  mounted () {
    let token = checkAdminToken()
    let monthArr = []
    for (let n = 1; n <= 12; n++) {
      monthArr.push(('0' + n).slice(-2))
    }
    this.options_month = this.options_month.concat(monthArr)

    this.$http.post(`${this.$store.state.apiURL}/getfullyear`, {}, { headers: {'authorization': token} })
      .then(response => {
        console.log(response)
        let arr = response.data.data
        let rebuildArr = []
        arr.forEach(e => {
          rebuildArr.push({ value: e.Nam, text: e.Nam })
        })
        console.log(rebuildArr)
        this.options_year = this.options_year.concat(rebuildArr)
        this.loaded_select = true
      })
      .catch(err => {
        console.log(err.response)
        if (err.response === undefined) {
          this.error = 'Không thể kết nối tới Server'
          this.showErrorAlert = true
          this.loaded_select = true
        } else {
          let errMsg = err.response.data.message
          this.error = errMsg
          this.showErrorAlert = true
          this.loaded_select = true
        }
      })
  },
  methods: {
    handleYear () {
      let token = checkAdminToken()
      if (this.selected_year != null && this.selected_month != null) {
        this.loading_table = true
        this.$http.post(`${this.$store.state.apiURL}/getreportbymonth`, {
          Nam: this.selected_year,
          Thang: this.selected_month
        }, { headers: { 'authorization': token } }).then(response => {
          this.fields = [
            {key: 'Date', label: 'Ngày'},
            {key: 'ThoiDiem', label: 'Thời điểm'},
            {key: 'TongLuuLuong', label: 'Tổng lưu lượng'},
            {key: 'Temp_Nuoclanh', label: 'Nhiệt độ nước lạnh đầu vào'},
            {key: 'Temp_Nuocnong', label: 'Nhiệt độ nước nóng đầu ra'},
            {key: 'DienNangTieuThu', label: 'Điện năng tiêu thụ'},
            {key: 'NangLuongTietKiem', label: 'Năng lượng tiết kiệm'}
          ]
          this.items = response.data.data
          this.loaded_selected = true
          this.loading_table = false
          console.log(response)
        }).catch(err => { console.log(err.response) })
      }
    },
    exportExcel () {
      if (this.selected_year != null && this.selected_month != null) {
        let token = checkAdminToken()
        this.$http.get(`${this.$store.state.apiURL}/exportexcel`, {
          params: {
            Nam: this.selected_year,
            Thang: this.selected_month
          },
          responseType: 'blob',
          headers: { 'authorization': token
          } }).then(response => {
          console.log(response)
          var fileURL = window.URL.createObjectURL(new Blob([response.data]))
          var fileLink = document.createElement('a')
          fileLink.href = fileURL
          fileLink.setAttribute('download', `Thong-ke-thang-${this.selected_month}-Nam-${this.selected_year}.xlsx`)
          document.body.appendChild(fileLink)
          fileLink.click()
        }).catch(err => {
          console.log(err.response)
          if (err.response.status === 409) {
            let dataExcel = XLSX.utils.json_to_sheet(this.items)
            let wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, dataExcel, 'Dữ liệu')
            XLSX.writeFile(wb, `report-month-${this.selected_month}-nam-${this.selected_year}.xlsx`)
          } else {
            if (err.response === undefined) {
              this.error = 'Không thể kết nối tới Server'
              this.showErrorAlert = true
              this.loaded = true
            } else {
              let errMsg = err.response.data.message
              this.error = errMsg
              this.showErrorAlert = true
            }
          }
        })
      } else {
        alert('Chọn đầy đủ cả năm và tháng')
      }
    }
  }
}
</script>

<style scoped>
#table-baocao {
  text-align: center;
}

#table {
  margin-top: 15px;
}

#total-record {
  text-align: right;
}

</style>
