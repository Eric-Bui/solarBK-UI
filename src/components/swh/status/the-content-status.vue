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
    <b-row id="infor-bar">
      <b-col sm="3" id="thoigian-hientai">
        <p>Thời gian hiện tại</p>
        <p>{{ ThoiGianHienTai }}</p>
      </b-col>
      <b-col sm="3" id="luongnuoc-sudung">
        <p>
          Lượng nước sử dụng
        </p>
        <strong>{{LuongNuocSuDung}} m³</strong>
      </b-col>
      <b-col sm="3" id="diennang-tieuthu">
        <p>
          Điện năng tiêu thụ:
        </p>
        <strong>{{DienNangTieuThu}} kWh</strong>
      </b-col>
      <b-col sm="3" id="nangluong-tietkiem">
        <p>
          Năng lượng tiết kiệm:
        </p>
        <strong>{{NangLuongTietKiem}} kWh</strong>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="9">
        <b-table
        head-variant='dark'
        id='table-status'
        striped
        hover
        bordered
        :fields="fields"
        :items='items'></b-table>
      </b-col>
      <b-col sm="3">
        <div id="nhietdo-nuoclanh">
          <h6>Nhiệt độ nước lạnh</h6>
          <h5>{{Temp_Nuoclanh}} &#8451;</h5>
        </div>
        <div id="nhietdo-nuocnong">
          <h6>Nhiệt độ nước nóng</h6>
          <h5>{{Temp_Nuocnong}} &#8451;</h5>
        </div>
      </b-col>
    </b-row>
  </div>
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
  name: `statusComponent`,
  props: {
    msg: String
  },
  components: {
    SpinningGroup
  },
  data () {
    return {
      ThoiGianHienTai: '',
      LuongNuocSuDung: '',
      DienNangTieuThu: '',
      NangLuongTietKiem: '',
      Temp_Nuoclanh: '',
      Temp_Nuocnong: '',
      loaded: false,
      fields: [],
      items: [],
      error: null,
      showErrorAlert: false
    }
  },
  mounted () {
    let token = checkAdminToken()
    this.$http.post(`${this.$store.state.apiURL}/getsystemstatus`,
      {}, { headers: {'authorization': token} })
      .then(response => {
        console.log(response)
        let dataResOverData = response.data.data.dataTotal
        this.ThoiGianHienTai = response.data.data.currentTime
        this.LuongNuocSuDung = dataResOverData.TongLuuLuong
        this.DienNangTieuThu = dataResOverData.DienNangTieuThu
        this.NangLuongTietKiem = dataResOverData.NangLuongTietKiem
        this.Temp_Nuoclanh = dataResOverData.Temp_Nuoclanh
        this.Temp_Nuocnong = dataResOverData.Temp_Nuocnong
        // Ready table data
        this.fields = [{key: 'bien', label: 'Thiết bị'},
          {key: 'thongSo', label: 'Thông số (\u00B0C)'},
          {key: 'trangThai', label: 'Trạng thái (ON/OFF)'}]

        this.items = response.data.data.dataParams
        this.loaded = true
      })
      .catch(err => {
        console.log(err.response)
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
  }
}
</script>

<style scoped>
#table-status {
  text-align: center;
}

#errorAlert {
  margin-top: 10px;
}

#infor-bar {
  margin: 10px 0;
  padding: 10px 0;
  border: 1px solid #b3b3b3;
  border-radius: 15px;
}

#thoigian-hientai,
#luongnuoc-sudung,
#diennang-tieuthu {
  border-right: solid 1px #b3b3b3;
}

#nhietdo-nuocnong,
#nhietdo-nuoclanh {
  text-align: center;
  margin: 20px 0;
  border-right: 1px solid #b3b3b3;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
  border-radius: 15px;
}

#nhietdo-nuocnong h6 {
  background-color: #a32a2a;
}

#nhietdo-nuoclanh h6 {
    background-color: #28799e;
}

#nhietdo-nuocnong h6,
#nhietdo-nuoclanh h6 {
  padding: 10px 0;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  color: white;
}

#nhietdo-nuocnong h5,
#nhietdo-nuoclanh h5 {
    padding: 5px 0;
    font-size: 25px;
    font-weight: bold;
}
</style>
