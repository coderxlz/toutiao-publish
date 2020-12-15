<template>
  <div class="select-image">
    <div v-if="!url">
      <slot><i class="el-icon-plus"></i></slot>
    </div>
    <img :src="url" alt="">
  </div>
</template>

<script>
export default {
  name: 'SelectImage',
  props: {
    url: {
      default() {
        return ""
      }
    }
  }
}
</script>

<style scoped>
.select-image{
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
  font-size: 50px;
  border:1px solid rgba(0, 0, 0, .3);
  margin-right: 5px;
}

.select-image img{
  max-width: 100%;
  max-height: 100%;
}
</style>