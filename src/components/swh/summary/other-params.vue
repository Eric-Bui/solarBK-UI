<template>
  <div>
    <div id="thongso-hienthi">
      <b-button id="collapse-btn" v-b-toggle.thongso-collapse variant="secondary">Ẩn/Hiện thông số</b-button>
      <b-collapse visible id="thongso-collapse">
        <b-form-group>
          <b-form-checkbox-group id="form-checkbox" v-model="selected_timerun">
            <h6>Thời gian chạy bơm đối lưu</h6>
            <b-row>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_DoiLuu1">Bơm đối lưu 1</b-form-checkbox>
              </b-col>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_DoiLuu2">Bơm đối lưu 2</b-form-checkbox>
              </b-col>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_DoiLuu3">Bơm đối lưu 3</b-form-checkbox>
              </b-col>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_DoiLuu4">Bơm đối lưu 4</b-form-checkbox>
              </b-col>
            </b-row>
            <h6>Thời gian chạy bơm tăng áp</h6>
            <b-row>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_TangAp1">Bơm tăng áp 1</b-form-checkbox>
              </b-col>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_TangAp2">Bơm tăng áp 2</b-form-checkbox>
              </b-col>
              <b-col sm="3">
              </b-col>
              <b-col sm="3">
              </b-col>
            </b-row>
            <h6>Thời gian chạy bơm hơi</h6>
            <b-row>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_BomHoi1">Bơm hơi 1</b-form-checkbox>
              </b-col>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_BomHoi2">Bơm hơi 2</b-form-checkbox>
              </b-col>
              <b-col sm="3">
              </b-col>
              <b-col sm="3">
              </b-col>
            </b-row>
            <h6>Thời gian chạy bơm nhiệt</h6>
            <b-row>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_BomNhiet1">Bơm nhiệt 1</b-form-checkbox>
              </b-col>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_BomNhiet2">Bơm nhiệt 2</b-form-checkbox>
              </b-col>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_BomNhiet3">Bơm nhiệt 3</b-form-checkbox>
              </b-col>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_BomNhiet4">Bơm nhiệt 4</b-form-checkbox>
              </b-col>
            </b-row>
            <h6>Thời gian chạy điện trở</h6>
            <b-row>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_DienTro1">Điện trở 1</b-form-checkbox>
              </b-col>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_DienTro2">Điện trở 2</b-form-checkbox>
              </b-col>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_DienTro3">Điện trở 3</b-form-checkbox>
              </b-col>
              <b-col sm="3">
                <b-form-checkbox value="TimeRun_DienTro4">Điện trở 4</b-form-checkbox>
              </b-col>
            </b-row>
          </b-form-checkbox-group>
        </b-form-group>
      </b-collapse>
    </div>
    <div id="thoigian-hienthi">
      <b-row>
        <b-col sm="1">
          <p>Từ:</p>
        </b-col>
        <b-col sm="4">
          <b-form-datepicker v-model="from_date" required></b-form-datepicker>
        </b-col>
        <b-col sm="1">
          <p>Đến:</p>
        </b-col>
        <b-col sm="4">
          <b-form-datepicker v-model="to_date" required></b-form-datepicker>
        </b-col>
        <b-col sm="2">
          <b-button type="submit" variant="primary" @click="handleSubmit">Xem thống kê</b-button>
        </b-col>
      </b-row>
    </div>
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
    <div v-if="loading_table">
      <SpinningGroup></SpinningGroup>
    </div>
    <div id="table" v-if="loaded">
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
      ></b-table>
      <p id="total-record"><strong>Tổng cộng: </strong>{{rows}} <i>bản ghi</i></p>
    </div>
    <b-modal id="bv-modal-example" ref="bvmodalexample" hide-footer>
      <template v-slot:modal-title>
        <code>Cảnh báo</code>
      </template>
      <div class="d-block text-center">
        <h6>Chọn ít nhất 1 biến</h6>
      </div>
    </b-modal>
  </div>
</template>

<script>
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
  name: `otherParams`,
  props: {
    
  },
  components: {
    SpinningGroup
  },
  data: () => {
    return {
      perPage: 14,
      currentPage: 1,
      items: [],
      fields: [],
      loaded: false,
      loading_table: false,
      showErrorAlert: false,
      error: null,
      selected_timerun: [],
      from_date: null,
      to_date: null
    }
  },
  mounted () {
    let recentTo = new Date()
    let recentFrom =
      `${recentTo.getFullYear()}-${recentTo.getMonth() + 1}-${recentTo.getDate()}`
    this.from_date = recentFrom
    this.to_date = recentFrom
  },
  computed: {
    rows () {
      return this.items.length
    }
  },
  methods: {
    handleSubmit () {
      let token = checkAdminToken()
      this.loaded = false
      this.loading_table = false
      if (this.selected_timerun.length != 0) {
        this.loading_table = true
        this.loaded = false
        this.$http.post(`${this.$store.state.apiURL}/getotherparam`,
          {
            timeRunArr: JSON.stringify(this.selected_timerun),
            fromDate: this.from_date,
            toDate: this.to_date
          }, { headers: { 'authorization': token } }).then(response => {
          let rebuildArr = [
            {key: 'Date', label: 'Ngày'},
            {key: 'ThoiDiem', label: 'Thời điểm'}
          ]
          let arrLabel = this.selected_timerun
          for (let n = 0; n < arrLabel.length; n++) {
            switch (arrLabel[n]) {
              // Timerun bơm đối lưu
              case 'TimeRun_DoiLuu1': rebuildArr.push({key: 'TimeRun_DoiLuu1', label: 'Bơm đối lưu 1'}); break
              case 'TimeRun_DoiLuu2': rebuildArr.push({key: 'TimeRun_DoiLuu2', label: 'Bơm đối lưu 2'}); break
              case 'TimeRun_DoiLuu3': rebuildArr.push({key: 'TimeRun_DoiLuu3', label: 'Bơm đối lưu 3'}); break
              case 'TimeRun_DoiLuu4': rebuildArr.push({key: 'TimeRun_DoiLuu4', label: 'Bơm đối lưu 4'}); break
              // Timerun bơm tăng áp
              case 'TimeRun_TangAp1': rebuildArr.push({key: 'TimeRun_TangAp1', label: 'Bơm tăng áp 1'}); break
              case 'TimeRun_TangAp2': rebuildArr.push({key: 'TimeRun_TangAp2', label: 'Bơm tăng áp 2'}); break
              // Timerun bơm hơi
              case 'TimeRun_BomHoi1': rebuildArr.push({key: 'TimeRun_BomHoi1', label: 'Bơm hơi 1'}); break
              case 'TimeRun_BomHoi2': rebuildArr.push({key: 'TimeRun_BomHoi2', label: 'Bơm hơi 2'}); break
              // Timerun bơm nhiệt
              case 'TimeRun_BomNhiet1': rebuildArr.push({key: 'TimeRun_BomNhiet1', label: 'Bơm nhiệt 1'}); break
              case 'TimeRun_BomNhiet2': rebuildArr.push({key: 'TimeRun_BomNhiet2', label: 'Bơm nhiệt 2'}); break
              case 'TimeRun_BomNhiet3': rebuildArr.push({key: 'TimeRun_BomNhiet3', label: 'Bơm nhiệt 3'}); break
              case 'TimeRun_BomNhiet4': rebuildArr.push({key: 'TimeRun_BomNhiet4', label: 'Bơm nhiệt 4'}); break
              // Timerun điện trở
              case 'TimeRun_DienTro1': rebuildArr.push({key: 'TimeRun_DienTro1', label: 'Điện trở 1'}); break
              case 'TimeRun_DienTro2': rebuildArr.push({key: 'TimeRun_DienTro2', label: 'Điện trở 2'}); break
            }
          }
          this.fields = rebuildArr
          this.items = response.data.data
          this.loading_table = false
          this.loaded = true
          console.log(response)
        }).catch(err => { 
          if (err.response === undefined) {
            this.error = 'Không thể kết nối tới Server'
            this.showErrorAlert = true
            this.loaded = true
            this.loading_table = false
          } else {
            let errMsg = err.response.data.message
            this.error = errMsg
            this.showErrorAlert = true
            this.loaded = true
            this.loading_table = false
          }  
        })
      } else {
        this.$refs.bvmodalexample.show()
        this.loading_table = false
        this.loaded = true
      }
    }
  }
}
</script>

<style scoped>
#table-baocao {
  text-align: center;
}
#total-record{
  text-align: right;
}

#thongso-collapse {
  margin-bottom: 10px;
  border: 1px solid #dbdbdb;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
  padding: 15px 10px;
}

#thongso-collapse h6 {
  color: #0064de;
  font-weight: bold;
  text-decoration: underline;
}

#thongso-collapse .row {
  margin: 5px 0 10px 0;
  border-bottom: 1px solid #dbdbdb;
}

#table {
  margin: 10px 0;
}

#collapse-btn {
  margin: 15px 0;
}

</style>
