<template>
  <div class="tab-control">
    <ul class="tab-control-item">
      <li
        v-for="(item, index) in titles"
        :key="index"
        @click="itemClick(index)"
      >
        <span :class="{ active: index == indexs }">{{ item }}</span>
      </li>
    </ul>
    <back-top class="backhop" v-show="isTabFixed" ></back-top>
  </div>
</template>

<script>
import { ref,inject } from "vue";
import BackTop from '../../common/backtop/BackTop.vue';
export default {
  components: { BackTop },
  props: {
    titles: {
      type: Array,
      default: [],
    },
  },
  setup(props,context) {
    const isTabFixed = inject('isTabFixed')
    let indexs = ref(0);
    const itemClick = (index) => {
      indexs.value = index;
    // 发射参数到父组件
      context.emit("indexClick", index);
    };
    return { indexs, itemClick,isTabFixed };
  },
};
</script>

<style lang="scss" scoped>
.tab-control-item {
  display: flex;
  list-style: none;
  padding: 10px 0;
  height: 45px;
  background-color: #fff;
  position: sticky;
  top: 44px;
  li {
    flex: 1;
    span:hover {
      cursor: pointer;
    }
    .active {
      color: var(--color-tint);
      border-bottom: 3px solid var(--color-tint);
      padding: 0 10px 10px;
    }
  }
}
</style>