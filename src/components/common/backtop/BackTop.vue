<template>
  <div>
    <!-- <i class="icon icon-circle-up backhop" @click="bTop"></i> -->
    <van-icon name="arrow-up" class="backhop" @click="bTop" />
  </div>
</template>

<script>
// import { inject } from "vue";

export default {
  props: {
    bTop: {
      type: Function,
    },
  },
  setup(props, contetx) {
    // const backhop = inject("bTop");
    // return {
    //   backhop,
    // };
  },
};
</script>

<style lang="scss" scoped>
.backhop {
  font-size: 40px;
  position: fixed;
  right: 20px;
  bottom: 80px;
  color: var(--color-top);
  z-index: 1;
  background: rgba($color: white, $alpha: 0.9);
  box-shadow: 3px 3px 7px #888888;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
}
</style>
