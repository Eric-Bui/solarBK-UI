<template>
  <div>
    <h6>{{$t('datepick.selecttime')}}</h6>
    <b-container fluid>
    <b-row>
      <b-col sm="1">
        <p>{{$t('datepick.from')}}:</p>
      </b-col>
      <b-col sm="4" id="input-datetime">
        <b-row>
          <b-col sm="8" id="input-field">
            <b-form-input id="from-date" v-model="fromDate" type="text" @input="valueTextChange" placeholder></b-form-input>
          </b-col>
          <b-col sm="4" id="pick-field">
            <b-form-datepicker
              @input="DatePicker"
              v-model="fromDate_date"
              button-only
              right
              locale="en-US"
              aria-controls="example-input"
            ></b-form-datepicker>
            <b-form-timepicker
              @input="DatePicker"
              v-model="fromDate_time"
              button-only
              right
              show-seconds
              locale="en"
              aria-controls="example-input"
            ></b-form-timepicker>
          </b-col>
        </b-row>
      </b-col>
      <b-col sm="1">
        <p>{{$t('datepick.to')}}:</p>
      </b-col>
      <b-col sm="4" id="input-datetime">
        <b-row>
          <b-col sm="8" id="input-field">
            <b-form-input id="to-date" v-model="toDate" type="text" @input="valueTextChange" placeholder></b-form-input>
          </b-col>
          <b-col sm="4" id="pick-field">
            <b-form-datepicker
              @input="DatePicker"
              v-model="toDate_date"
              button-only
              right
              locale="en-US"
              aria-controls="example-input"
            ></b-form-datepicker>
            <b-form-timepicker
              @input="DatePicker"
              v-model="toDate_time"
              button-only
              right
              show-seconds
              locale="en"
              aria-controls="example-input"
            ></b-form-timepicker>
          </b-col>
        </b-row>
      </b-col>
      <b-col sm="2"></b-col>
    </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: `DateTimePicker`,
  props: {},
  data () {
    return {
      fromDate: null,
      fromDate_date: null,
      fromDate_time: '00:00:00',
      toDate: null,
      toDate_date: null,
      toDate_time: null,
    }
  },
  mounted () {
    let newDate = new Date()
    let date = ('0' + newDate.getDate()).slice(-2)
    let month = ('0' + (newDate.getMonth() + 1)).slice(-2)
    let year = newDate.getFullYear()
    let fromDateTime = this.fromDate_time
    let fromDateInput = `${year}-${month}-${date} ${fromDateTime}`

    let hour = newDate.getHours()
    let min = newDate.getMinutes()
    let sec = newDate.getSeconds()
    let ToDateInput = `${year}-${month}-${date} ${hour}:${min}:${sec}`

    this.fromDate = fromDateInput
    this.toDate = ToDateInput

    this.fromDate_date = `${year}-${month}-${date}`
    this.fromDate_time = fromDateTime

    this.toDate_date = `${year}-${month}-${date}`
    this.toDate_time = `${hour}:${min}:${sec}`

    this.$store.commit('addRangeDetail', {fromDate_detail: this.fromDate, toDate_detail: this.toDate})
  },
  methods: {
    DatePicker () {
      this.fromDate = `${this.fromDate_date} ${this.fromDate_time}`
      this.toDate = `${this.toDate_date} ${this.toDate_time}`

      this.$store.commit('addRangeDetail', {fromDate_detail: this.fromDate, toDate_detail: this.toDate})
    },
    valueTextChange() {
      let splitDateTime_from = this.fromDate.split(' ')
      let splitDateTime_to = this.toDate.split(' ')

      this.fromDate_date = splitDateTime_from[0]
      this.fromDate_time = splitDateTime_from[1]

      this.toDate_date = splitDateTime_to[0]
      this.toDate_time = splitDateTime_to[1]

      this.$store.commit('addRangeDetail', {fromDate_detail: this.fromDate, toDate_detail: this.toDate})
    }
  }
}
</script>

<style scoped>
#input-field,
#input-datetime {
  padding: 0;
}

#pick-field {
  padding: 2px 5px;
}
</style>
