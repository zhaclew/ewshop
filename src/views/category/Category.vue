<template>
  <div>
    <nav-bar>
      <template v-slot:default>商品分类</template>
    </nav-bar>

    <div id="mainbox">
      <div class="ordertab">
        <van-tabs v-model="active" @click-tab="onClickTab">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评价排序"></van-tab>
        </van-tabs>
      </div>
      <div class="box-content">
        <van-sidebar class="leftmenu" v-model="activeKey">
          <van-collapse v-model="activeNames" accordion>
            <van-collapse-item
              v-for="item in categories.slice(0, 5)"
              :key="item.id"
              :title="item.name"
              :name="item.name"
            >
              <van-sidebar-item
                v-for="sub in item.children"
                :key="sub.id"
                :title="sub.name"
                @click="getGoods(sub.id)"
              />
            </van-collapse-item>
          </van-collapse>
        </van-sidebar>
        <div class="goodslist wrapper">
          <div class="content">
            <van-card
              v-for="item in showGoods"
              :key="item.id"
              :num="item.comments_count"
              :tag="item.comments_count >= 0 ? '流行' : '标签'"
              :price="item.price"
              :desc="item.updated_at.slice(0, 19)"
              :title="item.title"
              :thumb="item.cover_url"
              :lazy-load="true"
              @click="getGoodsId(item.id)"
            />
          </div>
        </div>
      </div>

      <back-top @click="aaa"></back-top>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { ref, reactive, onMounted, computed, nextTick, watchEffect } from "vue";
import { getCateGory, getCategoryGoods } from "network/category";
import BetterScroll from "better-scroll";
import BackTop from "components/common/backtop/BackTop.vue";
import { useRouter } from "vue-router";
export default {
  components: { NavBar, BackTop },
  setup(props, context) {
    let activeKey = ref(0);
    let categories = ref([]);
    let activeNames = ref(1);
    let active = ref(0);
    // 路由器
    const router = useRouter();
    // 页面滚动
    let bscroll = reactive({});
    // 当前的排序条件
    let currentOrder = ref("sales");
    // 当前的分类ID
    let currentCid = ref(0);

    // 数据模型
    const goods = reactive({
      sales: { page: 0, list: [] },
      price: { page: 0, list: [] },
      comments_count: { page: 0, list: [] },
    });
    const showGoods = computed(() => {
      return goods[currentOrder.value].list;
    });

    const init = () => {
      getCategoryGoods("sales", currentCid.value).then((res) => {
        goods.sales.list = res.goods.data;
      });
      getCategoryGoods("price", currentCid.value).then((res) => {
        goods.price.list = res.goods.data;
      });
      getCategoryGoods("comments_count", currentCid.value).then((res) => {
        goods.comments_count.list = res.goods.data;
      });
    };

    onMounted(() => {
      getCateGory().then((res) => {
        categories.value = res.categories;
      });
      init();
      // 创建 BetterSroll 对象
      bscroll = new BetterScroll(document.querySelector(".wrapper"), {
        probeType: 3,
        click: true,
        pullUpLoad: true, //上拉加载更多
      });
      // 上拉加载数据，触发 pullingUp
      bscroll.on("pullingUp", () => {
        const page = goods[currentOrder.value].page + 1;
        getCategoryGoods(currentOrder.value, currentCid.value, page).then(
          (res) => {
            goods[currentOrder.value].list.push(...res.goods.data);
            goods[currentOrder.value].page += 1;
          }
        );
        // 完成上拉，等数据请求完成，将新数据展示出来
        bscroll.finishPullUp();
        // 重新计算高度
        bscroll.refresh();
        console.log(document.querySelector(".content").clientHeight);
        console.log("当前类型：" + currentOrder.value + ",当前页：" + page);
      });
    });
    // 排序选项卡
    const onClickTab = (index) => {
      let orders = ["sales", "price", "comments_count"];
      currentOrder.value = orders[index.name];
      console.log(currentOrder.value);
      getCategoryGoods(currentOrder.value, currentCid.value).then((res) => {
        goods[currentOrder.value].list = res.goods.data;
        nextTick(() => {
          // 重新计算高度
          bscroll && bscroll.refresh();
        });
      });
    };
    // 通过分类 get 商品
    const getGoods = (cid) => {
      currentCid.value = cid;
      init();
      console.log(cid);
      console.log(currentOrder.value);
    };
    // 监听 任何一个变量有变量
    watchEffect(() => {
      nextTick(() => {
        // 重新计算高度
        bscroll && bscroll.refresh();
      });
    });
    const aaa = () => {
      bscroll.scrollTo(0, 0, 300);
    };
    const getGoodsId = (id) => {
      console.log(id);
      router.push({ path: "/detail", query: { id } });
    };
    return {
      activeKey,
      categories,
      activeNames,
      active,
      onClickTab,
      currentOrder,
      currentCid,
      getGoods,
      showGoods,
      init,
      bscroll,
      aaa,
      getGoodsId,
    };
  },
};
</script>

<style lang="scss" scoped>
#mainbox {
  margin-top: 45px;
  .ordertab {
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: sticky;
    top: 44px;
    z-index: 1;
    &::before {
      content: "";
      width: 125px;
      height: 100%;
      float: left;
    }
  }
  .box-content {
    display: flex;
    padding-left: 150px;
    position: relative;

    .leftmenu {
      width: 150px;
      position: fixed;
      top: 90px;
      left: 0;
    }
    .goodslist {
      flex: 1;
      height: 100vh;
    }
  }
}
</style>
