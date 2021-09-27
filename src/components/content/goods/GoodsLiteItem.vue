<template>
  <div class="goods-item" @click="getGoodsId(goodsListContent.id)">
    <img v-lazy="goodsListContent.cover_url" alt="" />
    <p>{{ goodsListContent.title }}</p>
    <span class="money"><small>￥</small>{{ goodsListContent.price }}</span>
    <span class="collect icon">{{ goodsListContent.collects_count }}</span>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  props: {
    goodsListContent: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup() {
    const router = useRouter();
    const getGoodsId = (id) => {
      router.push({ path: "/detail", query: { id } });
    };
    return { getGoodsId };
  },
};
</script>

<style lang="scss" scoped>
.goods-item {
  width: 45%;
  padding: 10px 0;
  img {
    width: 100%;
    border-radius: 5px;
  }
  .money {
    color: var(--color-top);
    padding-right: 5px;
  }
  .collect::before {
    content: "\e9d7";
    //e9d9 黑色星星
  }
}
</style>
