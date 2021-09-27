<template>
  <div class="home">
    <nav-bar>
      <template v-slot:default>图书商店</template>
    </nav-bar>
    <tab-control
      v-show="isTabFixed"
      class="abc"
      @indexClick="indexClick"
      :titles="titles"
      @click="bTop"
    ></tab-control>

    <div class="wrapper">
      <div class="content">
        <div ref="banref">
          <home-swiper :banners="banners"></home-swiper>
          <recommend-view></recommend-view>
        </div>
        <tab-control
          v-show="!isTabFixed"
          class="abc"
          @indexClick="indexClick"
          :titles="titles"
        ></tab-control>

        <goods-list :goods="GoodsId"></goods-list>
      </div>
    </div>
    <footer></footer>
  </div>
</template>

<script>
import {
  ref,
  onMounted,
  provide,
  reactive,
  computed,
  watchEffect,
  nextTick,
} from "vue";
import { getHomeAllData, getHomeGoods } from "network/home";
import NavBar from "components/common/navbar/NavBar";
import RecommendView from "views/home/ChildComps/RecommendView";
import TabControl from "components/content/tabControl/TabControl.vue";
import GoodsList from "components/content/goods/GoodsList";
import BScroll from "better-scroll";
import HomeSwiper from "views/home/ChildComps/HomeSwiper";
export default {
  components: { NavBar, RecommendView, TabControl, GoodsList, HomeSwiper },
  setup() {
    let titles = ref(["畅销", "新书", "精选"]);
    let tempId = ref(0);
    const banner = ref([]);
    const banners = ref([]);
    let isTabFixed = ref(false);
    let banref = ref(null);
    // 商品列表数据模型
    const goods = reactive({
      sales: { page: 1, list: [] },
      recommend: { page: 1, list: [] },
      new: { page: 1, list: [] },
    });

    let goodsName = ref(["sales", "new", "recommend"]);
    let goodsNameNow = ref("");

    const GoodsId = computed(() => {
      goodsNameNow = goodsName.value[tempId.value];
      nextTick(() => {
        // 重新计算高度
        bscroll && bscroll.refresh();
      });
      return goods[goodsNameNow].list;
    });

    let bscroll = reactive({});
    onMounted(() => {
      getHomeAllData()
        .then((res) => {
          banners.value = res.slides;
          banner.value = res.goods.data;
        })
        .catch((err) => {
          console.log(err);
        });

      getHomeGoods("sales").then((res) => {
        goods.sales.list = res.goods.data;
      });
      getHomeGoods("recommend").then((res) => {
        goods.recommend.list = res.goods.data;
      });
      getHomeGoods("new").then((res) => {
        goods.new.list = res.goods.data;
      });

      // 创建 BetterSroll 对象
      bscroll = new BScroll(document.querySelector(".wrapper"), {
        probeType: 3,
        click: true,
        pullUpLoad: true, //上拉加载更多
      });

      // 触发滚动事件
      bscroll.on("scroll", (position) => {
        // console.log(position.y);
        console.log(banref.value.offsetHeight);

        isTabFixed.value = -position.y > Number(banref.value.offsetHeight);
      });
      // 上拉加载数据，触发 pullingUp
      bscroll.on("pullingUp", () => {
        console.log("上拉加载更多...");
        const page = goods[goodsNameNow].page + 1;
        getHomeGoods(goodsNameNow, page).then((res) => {
          goods[goodsNameNow].list.push(...res.goods.data);
          goods[goodsNameNow].page += 1;
        });

        // 完成上拉，等数据请求完成，将新数据展示出来
        bscroll.finishPullUp();
        // 重新计算高度
        bscroll.refresh();

        console.log(document.querySelector(".content").clientHeight);
        console.log("当前类型：" + goodsNameNow + ",当前页：" + page);
      });
    });

    const indexClick = (index) => {
      tempId.value = index;
    };

    // 监听 任何一个变量有变量
    watchEffect(() => {
      nextTick(() => {
        // 重新计算高度
        bscroll && bscroll.refresh();
      });
    });

    // backhop 的方法
    const bTop = () => {
      bscroll.scrollTo(0, 0, 1000);
    };
    provide("banner", banner);
    provide("isTabFixed", isTabFixed);
    return {
      banner,
      titles,
      tempId,
      indexClick,
      goods,
      GoodsId,
      isTabFixed,
      banref,
      banners,
      bTop,
    };
  },
};
</script>

<style lang="scss" scoped>
footer {
  height: 60px;
  width: 100%;
}
.banners {
  height: 320px;
  width: 100%;
  img {
    width: 100%;
  }
  @media (min-width: 768px) {
    img {
      transform: translateY(-33%);
    }
  }
}
.abc {
  position: sticky;
  top: 44px;
  z-index: 1;
}
.home {
  position: relative;
  height: 100vh;
}
.wrapper {
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
}
</style>
