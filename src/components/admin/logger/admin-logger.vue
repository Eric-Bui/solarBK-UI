<template>
    <div>
        <b-container fluid>
            <b-row id="log-custom">
                <b-col sm="8">
                    <b-form-input v-model="serial" placeholder="Nhập số seri"></b-form-input>
                </b-col>
                <b-col sm="1">
                    <b-button v-show="toggleBtn === false || toggleBtn === null" variant="info" @click="loggSerialData(true)">Ghi</b-button>
                    <b-button v-show="toggleBtn === true" variant="warning" @click="loggSerialData(false)">Hủy</b-button>
                </b-col>
                <b-col sm="3">
                    <label>Thời gian đáp ứng:</label>
                    <b-form-input v-model="timestampArr" disabled></b-form-input>
                </b-col>
                <b-col sm="12">
                <h5>Dữ liệu</h5>
                <div id="display-log-data">
                    <b-card v-for="(item, index) in messages" v-bind:key="index">
                        <p>{{item}}</p>
                    </b-card>
                </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
let msgServer;

export default {
    name: 'adminLogger',
    data() {
        return {
            messages: [],
            timestampArr: null,
            serial: null,
            toggleBtn: null
        }
    },
    mounted() {
        
    },
    methods: {
        loggSerialData (status) {
            this.toggleBtn = status
            let es = new EventSource(`${this.$store.state.pvSofarApi}/events?serial=${this.serial}`)
            if (status === true) {
                es.onopen = () => {
                    console.log(`Connection is opened`)
                }

                es.onmessage = (message) => {
                    this.messages.unshift(message.data)
                    this.timestampArr = JSON.parse(message.data).time
                }

            } else {
                window.location.reload()
            }
            es.onerror = () => {
                console.log(`Connection is closed`)
                es.close()
            } 
        },
    },
}
</script>

<style scoped>
#log-custom {
    padding-top: 15px;
}
</style>