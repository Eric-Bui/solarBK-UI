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
            >{{error}}</b-alert>
            </div>
            <b-container fluid>
                <h5 class="title"><b-icon-window></b-icon-window> {{$t('warrantypage.generalinfo')}}</h5>
                <b-row class="overall-info">
                    <b-col sm="6">
                        <p><strong>{{$t('warrantypage.customername')}}:</strong> {{customerName}}</p>
                        <p> <strong> {{$t('activitymodal.address')}}: </strong> {{customerAddress}}</p>
                        <p><strong>{{$t('warrantypage.warrantyno')}}: </strong> {{warrantyNumber}}</p>
                        <p><strong>{{$t('warrantypage.contractno')}}: </strong> {{contractNumber}}</p>
                    </b-col>
                    <b-col sm="6">
                        <p><strong>{{$t('warrantypage.setupdate')}}:</strong> {{installDate}}</p>
                        <p><strong>{{$t('warrantypage.systemcode')}}:</strong> {{systemCode}}</p>
                        <p><strong>{{$t('warrantypage.providercode')}}:</strong> {{providerName}}</p>
                        <p><strong>{{$t('warrantypage.provideraddress')}}:</strong> {{providerAddress}}</p>
                    </b-col>
                </b-row>
                    <h5><b-icon-tools></b-icon-tools> {{$t('warrantypage.maintaininfo')}}</h5>
                        <p><strong>{{$t('warrantypage.systemcapacity')}}</strong> {{capacity}} kWp</p>
                    <h5><b-icon-wrench></b-icon-wrench> {{$t('warrantypage.maintainperiod')}}</h5>
                    <b-row>
                        <b-table
                        id="table-dc"
                        striped
                        hover
                        borderless
                        table-layout: fixed
                        head-variant="dark"
                        :fields="warrantyLableData"
                        :items="warrantyTableData"
                        >
                            <template v-slot:cell(works)='{item}'>
                                <ul style="text-align:left">
                                    <li v-for="work in item.works" :key="work">{{work}}</li>
                                </ul>
                            </template>
                            <template v-slot:cell(picture)='{item}'>
                                <b-img :src="getPicPath(item.picture)" fluid alt="device_img"></b-img>
                            </template>
                            <template v-slot:cell(cmt_rating)='{item}'>
                                <div>
                                    <p style="text-align:left">{{item.comment}}</p>
                                    <b-form-rating id="rating-inline"
                                    variant="warning"
                                    disabled
                                    inline :value="item.rating"></b-form-rating>
                                </div>
                            </template>
                        </b-table>
                    </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
import SpinningGroup from '../../spinning.vue'

function checkAdminToken () {
  let token,
      pvType,
      device
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
    name: 'maintenanceComponentPV',
    props: {
        msg: String
    },
    components: {
        SpinningGroup
    },
    data() {
        return {
            loaded: false,
            error: null,
            showErrorAlert: false,
            customerName: null,
            customerAddress: null,
            warrantyNumber: null,
            contractNumber: null,
            installDate: null,
            systemCode: null,
            providerName: null,
            providerAddress: null,
            capacity: null,
            warrantyLableData: null,
            warrantyTableData: null
        }
    },
    mounted () {
        this.$http.defaults.headers.common['X-LANGUAGE'] = this.$route.params.lang
        let token = checkAdminToken().token
        this.$http.get(`${this.$store.state.pvSofarApi}/maintenance-info`, {
            headers: { authorization: token }
        }).then(response => {
            let maintenanceInfo = response.data.maintenanceInfo
            let contractInfo = response.data.contractInfo
            let customerInfo = response.data.customerInfo

            this.customerName = customerInfo.Name
            this.customerAddress = customerInfo.Address
            this.warrantyNumber = contractInfo.id
            this.contractNumber = contractInfo.contract_no
            this.installDate = contractInfo.installed_date
            this.systemCode = contractInfo.system_code
            this.providerName = contractInfo.provider_name
            this.providerAddress = contractInfo.provider_address
            this.capacity = contractInfo.system_capacity


            this.warrantyLableData = response.data.labelTable
            this.warrantyTableData = maintenanceInfo
            this.loaded = true
        }).catch(err => {
        if (err.response === undefined) {
          console.log(err)
          this.error = `Can't connect server`
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
        getPicPath: picName => {
            let picPath = require(`../../../assets/images/Sample-img/${picName}`)
            return picPath
        },
    }
}
</script>

<style scoped>
#errorAlert {
  margin-top: 10px;
}

.overall-info {
    margin: 10px 0;
    background-color: #f5f5f5;
    border: 1px solid #ededed;
    padding: 5px 0;
}

.title {
    margin-top: 20px;
}

#table-dc {
    text-align: center;
}
</style>