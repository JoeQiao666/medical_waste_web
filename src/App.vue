<template>
  <div id="app">
    <router-view  v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    .flex{
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        align-items: center;
    }
    .noWrap{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .el-date-editor{
      background: #69B2DB;
    }
    .el-date-editor .el-range-input{
      background: #69B2DB;
      color: #fff;
    }
    .el-date-editor .el-icon-date,.el-date-editor .el-range-separator{
      color: #fff;
    }

</style>
