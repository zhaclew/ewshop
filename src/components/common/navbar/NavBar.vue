<template>
  <div class="nav-bar">
    <!-- <div class="left" @click="goback"><i class="icon icon-arrow-left"></i></div> -->
    <van-icon name="arrow-left" class="left" @click="goback" />
    <div class="center"><slot>EWShop</slot></div>
    <div class="right"></div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    function goback() {
      router.go(-1);
    }

    return { goback };
  },
};
</script>

<style lang="scss" scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: white;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
  line-height: 45px;
  height: 45px;
  text-align: center;
  box-shadow: 0 2px 0 rgba($color: gray, $alpha: 0.1);
  .center {
    display: inline-block;
    padding-right: 60px;
  }
  .left,
  .right {
    width: 60px;
    line-height: 45px;
  }
}
</style>
