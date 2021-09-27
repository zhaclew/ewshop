<template>
  <div class="goods-list-item">
    <goods-lite-item
      v-for="item in goods"
      :goodsListContent="item"
      :key="item.id"
    ></goods-lite-item>
  </div>
</template>

<script>
import GoodsLiteItem from "./GoodsLiteItem.vue";
export default {
  components: {
    GoodsLiteItem,
  },
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss">
.goods-list-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 5px 20px;
}
</style>