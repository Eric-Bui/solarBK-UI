<template>
  <div>
    <h6>{{$t('datepick.selectyear')}}</h6>
    <b-row>
      <b-col sm="1">
        <p>{{$t('datepick.from')}}:</p>
      </b-col>
      <b-col sm="4">
        <b-form-select @change="yearChange" v-model="fromYear" :options="yearOpt"></b-form-select>
      </b-col>
      <b-col sm="1">
        <p>{{$t('datepick.to')}}:</p>
      </b-col>
      <b-col sm="4">
        <b-form-select @change="yearChange" v-model="toYear" :options="yearOpt"></b-form-select>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: `SelectYear`,
  props: {
    msg: String,
    Serial: String
  },
  data () {
    return {
      fromYear: null,
      toYear: null,
      yearOpt: []
    }
  },
  mounted () {
    let newDate = new Date;
    let recentYear = newDate.getFullYear()
    let yearCount = newDate.getFullYear()
    
    for (let y = 1; y <= 7; y++) {
      let test = yearCount--
      this.yearOpt.push({value: test, text: test})
    }
    
    let fromYear = `${recentYear}-01-01`
    let toYear = `${recentYear}-12-31`

    this.fromYear = `${recentYear}`
    this.toYear = `${recentYear}`

    this.$store.commit('addRangeYear', {fromYear: fromYear, toYear: toYear})
    
  },
  methods: {
    yearChange () {
      let fromYear = `${this.fromYear}-01-01`
      let toYear = `${this.toYear}-12-31`
      this.$store.commit('addRangeYear', {fromYear: fromYear, toYear: toYear})
    }
  }
}
</script>

<style scoped>
</style>
