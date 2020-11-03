<template>
<div>
  <router-view :key="$route.fullPath"></router-view>
</div>
</template>

<script>
export default {
    name: 'allProjects'
}
</script>

<style scoped>

</style>