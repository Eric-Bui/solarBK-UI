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
                    <h5><b-icon-tools></b-icon-tools> {{$t('warrantypage.warrantyinfo')}}</h5>
                    <b-row class="warranty-info">
                        <p><strong>{{$t('warrantypage.systemcapacity')}}</strong> {{capacity}} kWp</p>
                        <b-table
                        id="table-dc"
                        striped
                        hover
                        bordered
                        table-layout: fixed
                        head-variant="dark"
                        :fields="warrantyLableData"
                        :items="warrantyTableData"
                        >
                            <template v-slot:cell(image)='{item}'>
                                <b-img :src="getPicPath(item.image)" fluid alt="device_img"></b-img>
                            </template>
                            <template v-slot:cell(serial)='{item}'>
                                <div style="height: 100px; overflow-y: scroll;">
                                    {{item.serial}}
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
    name: 'warrantyComponentPV',
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
        this.$http.get(`${this.$store.state.pvSofarApi}/warranty-info`, {
            headers: { authorization: token }
        }).then(response => {
            let warrantyData = response.data.warrantyInfo
            let customerInfo = response.data.customerInfo

            this.customerName = customerInfo.Name
            this.customerAddress = customerInfo.Address
            this.warrantyNumber = warrantyData.id
            this.contractNumber = warrantyData.contract_no
            this.installDate = warrantyData.installed_date
            this.systemCode = warrantyData.system_code
            this.providerName = warrantyData.provider_name
            this.providerAddress = warrantyData.provider_address
            this.capacity = warrantyData.system_capacity

            this.warrantyLableData = response.data.labelTable
            this.warrantyTableData = warrantyData.device_list
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
            let picPath = require(`../../../assets/images/Products/${picName}`)
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