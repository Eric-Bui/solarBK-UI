<template>
  <div>
    <h6>{{$t('datepick.selectmonth')}}</h6>
    <b-row>
      <b-col sm="1">
        <p>{{$t('datepick.from')}}:</p>
      </b-col>
      <b-col sm="4">
        <b-row>
          <b-col sm="6">
            <b-form-select @change="handleChange" v-model="fromMonth" :options="month" ></b-form-select>
          </b-col>
          <b-col sm="6">
            <b-form-select @change="handleChange" v-model="fromYear" :options="year"></b-form-select>
          </b-col>
        </b-row>
      </b-col>
      <b-col sm="1">
        <p>{{$t('datepick.to')}}:</p>
      </b-col>
      <b-col sm="4">
        <b-row>
          <b-col sm="6">
            <b-form-select @change="handleChange" v-model="toMonth" :options="month"></b-form-select>
          </b-col>
          <b-col sm="6">
            <b-form-select @change="handleChange" v-model="toYear" :options="year"></b-form-select>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {store} from '../../../store.js'
import { Store } from 'vuex';

let newDate = new Date(),
    recentMonth = ('0' + (newDate.getMonth() + 1)).slice(-2),
    recentDate = ('0' + newDate.getDate()).slice(-2),
    recentYear = newDate.getFullYear()

function daysInMonth (month, year) {
  return new Date(year, month, 0).getDate();
}

export default {
  name: `SelectMonth`,
  props: {
    msg: String,
    Serial: String
  },
  data () {
    return {
      fromMonth: 0,
      fromYear: 0,
      toMonth: 0,
      toYear: 0,
      month: [],
      year: []
    }
  },
  mounted () {
    for (let i = 1; i <= 12; i++) {
      this.month.push({value: ('0' + i).slice(-2), text: ('0' + i).slice(-2)})
    }

    let yearCount = newDate.getFullYear()
    
    for (let y = 1; y <= 7; y++) {
      let test = yearCount--
      this.year.push({value: test, text: test})
    }

    let fromMonth = `${recentYear}-${recentMonth}-01`
    let toMonth = `${recentYear}-${recentMonth}-${recentDate}`

    this.fromMonth = this.toMonth = recentMonth
    this.fromYear = this.toYear = recentYear

    store.commit('addRangeMonth', {fromMonth: fromMonth, toMonth: toMonth})
  },
  methods: {
    handleChange () {
      let fromMonth = `${this.fromYear}-${this.fromMonth}-01`
      let days = daysInMonth(this.toMonth, this.toYear)
      let toMonth = `${this.toYear}-${this.toMonth}-${days}`

      store.commit('addRangeMonth', {fromMonth: fromMonth, toMonth: toMonth})
    }
  }
}
</script>

<style scoped>
</style>
