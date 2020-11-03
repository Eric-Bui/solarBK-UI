<template>
  <div id="spinning-group">
    <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
    <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
    <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
    <h5>Loading...</h5>
  </div>
</template>

<script>
export default {
  name: 'SpinningGroup',
  props: {
    msg: String
  }
}
</script>

<style scoped>
#spinning-group {
    text-align: center;
    margin: 100px 0;
}

h5 {
  font-weight: bold;
  color: steelblue;
}

</style>
