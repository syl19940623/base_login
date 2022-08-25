<template>
  <div id="app">
    <transition name="dialog-fade">
      <router-view/>
    </transition>
  </div>
</template>

<style lang="less">
  @import "./assets/css/base.css";
  @import "./assets/css/font-awesome.min.css";
  #nprogress .bar{background: var(--primary) !important;}
</style>
