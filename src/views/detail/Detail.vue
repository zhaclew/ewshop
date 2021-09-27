<template>
  <div>
    <nav-bar>
      <template v-slot:default>商品详情：{{ id }}</template>
    </nav-bar>
    <div class="detail">
      <van-image width="100%" fit="contain" lazy-load :src="detail.cover_url" />
      <div class="detail_content">
        <van-card
          class="detail_buy"
          :num="detail.stock"
          :price="detail.price + '.00'"
          :desc="detail.description"
          :title="detail.title"
        >
          <template #tags>
            <van-tag plain type="danger">推荐</van-tag>
            <van-tag plain type="danger" v-if="detail.is_recommend"
              >新书</van-tag
            >
          </template>
          <template #footer>
            <van-button type="warning" @click="handleAddCart"
              >加入购物车</van-button
            >
            <van-button type="danger" @click="goToCart">立即购买</van-button>
          </template>
        </van-card>
      </div>

      <div class="detail_tab">
        <van-tabs v-model="active">
          <van-tab title="概述">
            <div v-html="detail.details"></div>
          </van-tab>
          <van-tab title="热评">
            <ul class="comment">
              <li v-for="item in detail.comments" :key="item.id">
                <img :src="item.user.avatar_url" alt="" />
                <div>
                  <h3>{{ item.user.name }}</h3>
                  <p>
                    {{ item.content }}
                  </p>
                  <p class="small">{{ item.created_at }}</p>
                </div>
              </li>
            </ul>
          </van-tab>
          <van-tab title="相关图书">
            <goods-list :goods="like_goods"></goods-list>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, reactive, toRefs } from "vue";
import { getDetail } from "network/detail";
import GoodsList from "components/content/goods/GoodsList";
import { addCart } from "network/cart";
import { Toast } from "vant";
import { useStore } from "vuex";
export default {
  components: { NavBar, GoodsList },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    let id = route.query.id;
    const book = reactive({
      detail: {},
      like_goods: [],
    });
    let active = ref(2);
    onMounted(() => {
      getDetail(id).then((res) => {
        book.detail = res.goods;
        book.like_goods = res.like_goods;
      });
    });

    // 添加购物车
    const handleAddCart = () => {
      addCart({ goods_id: book.detail.id, num: 1 }).then((res) => {
        if (res.status == "204" || "201") {
          Toast.success("添加成功");
          // 设置 store 中的 cartCount
          store.dispatch("updateCart");
        }
      });
    };

    // 立即购买
    const goToCart = () => {
      addCart({ goods_id: book.detail.id, num: 1 }).then((res) => {
        if (res.status == "204" || "201") {
          // 设置 store 中的 cartCount
          store.dispatch("updateCart");
          router.push({ path: "/shopcart" });
        }
      });
    };
    return { id, ...toRefs(book), active, handleAddCart, goToCart };
  },
};
</script>

<style lang="scss">
.detail {
  margin-top: 45px;
}
.detail_buy {
  text-align: left;
}
.detail_tab {
  margin-bottom: 45px;
}
img {
  max-width: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
}
.comment {
  margin-bottom: 60px;
  li {
    height: 80px;
    padding: 10px;
    border-bottom: 1px solid gray;
    img {
      float: left;
      width: 60px;
      height: auto;
    }
    h3,
    p {
      text-align: left;
      text-indent: 5px;
      line-height: 20px;
    }
    .small {
      font-size: 12px;
      color: gray;
    }
  }
}
</style>
