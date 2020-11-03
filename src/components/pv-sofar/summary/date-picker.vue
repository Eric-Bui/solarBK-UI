<template>
  <div>
    <h6>{{$t('datepick.selectdate')}}</h6>
    <b-row>
      <b-col sm="1">
        <p>{{$t('datepick.from')}}:</p>
      </b-col>
      <b-col sm="4">
        <b-input-group class="mb-3">
          <b-form-input id="example-input" v-model="fromDate" type="text" @input="valueTextChange"></b-form-input>
          <b-input-group-append>
            <b-form-datepicker
              @input="dateChange"
              v-model="fromDate_date"
              button-only
              right
              locale="en-US"
              aria-controls="example-input"
            ></b-form-datepicker>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col sm="1">
        <p>{{$t('datepick.to')}}:</p>
      </b-col>
      <b-col sm="4">
        <b-input-group class="mb-3">
          <b-form-input id="example-input" v-model="toDate" type="text" @input="valueTextChange"></b-form-input>
          <b-input-group-append>
            <b-form-datepicker
              @input="dateChange"
              v-model="toDate_date"
              button-only
              right
              locale="en-US"
              aria-controls="example-input"
            ></b-form-datepicker>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { store } from '../../../store';

let newDate = new Date();
let date = ("0" + newDate.getDate()).slice(-2);
let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
let year = newDate.getFullYear();

//DETAIL TIMES
let hours = newDate.getHours();
let min = newDate.getMinutes();
let sec = newDate.getSeconds();

export default {
  name: `DatePicker`,
  props: {
    msg: String
  },
  data() {
    return {
      fromDate: null,
      fromDate_date: null,
      toDate: null,
      toDate_date: null
    };
  },
  mounted() {
    this.fromDate = this.toDate = this.fromDate_date = this.toDate_date = `${year}-${month}-${date}`
    let fromDateTime = `${this.fromDate_date} 00:00:00`
    let toDateTime = `${this.toDate_date} ${hours}:${min}:${sec}`
    this.$store.commit('addRangeDate', {fromDate: fromDateTime, toDate: toDateTime})
  },
  methods: {
    dateChange() {
      this.toDate = this.toDate_date
      this.fromDate = this.fromDate_date

      let fromDateTime = `${this.fromDate_date} 00:00:00`
      let toDateTime = `${this.toDate_date} ${hours}:${min}:${sec}`
      
      this.$store.commit('addRangeDate', {fromDate: fromDateTime, toDate: toDateTime})
    },
    valueTextChange() {
      this.toDate_date = this.toDate
      this.fromDate_date = this.fromDate

      let fromDateTime = `${this.fromDate} 00:00:00`
      let toDateTime = `${this.toDate} ${hours}:${min}:${sec}`
      
      this.$store.commit('addRangeDate', {fromDate: fromDateTime, toDate: toDateTime})
    }
  }
};
</script>

<style scoped>
</style>
