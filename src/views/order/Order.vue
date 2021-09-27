<template>
  <div class="order-box">
    <nav-bar>
      <template v-slot:default>订单界面</template>
    </nav-bar>
    <van-tabs @click-tab="onClick">
      <van-tab :title="n" v-for="(n, m) in tab" :key="m">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            :v-model:loadding="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            @offset="10"
          >
            <div
              class="main"
              style="text-align:left;"
              v-for="(item, index) in list"
              :key="index"
              @click="goTo(item.id)"
            >
              <div class="order">
                <p>订单号：{{ item.order_no }}</p>
                <p>创建时间：{{ item.created_at }}</p>
              </div>
              <van-card
                v-for="sub in item.orderDetails.data"
                :key="sub.id"
                :num="sub.num"
                :price="sub.goods.price + '.00'"
                desc="全场包邮"
                :title="sub.goods.title"
                :thumb="sub.goods.cover_url"
              >
              </van-card>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { reactive, ref, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getOrderList } from "network/order";
export default {
  components: { NavBar },
  setup() {
    const route = useRoute();
    const router = useRouter();
    let tabs = ref(0);
    const state = reactive({
      tab: ["全部", "代付款", "已支付", "发货", "交易完成", "过期"],
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      page: 1,
      totalPage: 0,
      atatus: 0,
    });

    onMounted(() => {
      onRefresh();
    });

    const loadData = () => {
      getOrderList({
        page: state.page,
        status: state.status,
        include: "orderDetails.goods",
      }).then((res) => {
        state.list = state.list.concat(res.data);
        state.loading = false;
        state.totalPage = res.meta.pagination.total_pages;
        if (state.page >= state.totalPage) {
          state.finished = true;
        }
      });
    };

    const onLoad = () => {
      if (!state.refreshing && state.page < state.totalPage) {
        state.page = state.page + 1;
      }
      if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
      }
      loadData();
    };

    const onRefresh = () => {
      state.refreshing = true;
      state.finished = false;
      state.loading = true;
      state.page = 1;
      onLoad();
    };
    const onClick = (name) => {
      console.log(name.name);
      state.status = name.name;
      onRefresh();
    };
    const goTo = (order) => {
      router.push({ path: "/orderdetail", query: { order: order, payId: 1 } });
    };
    return { ...toRefs(state), onRefresh, onLoad, tabs, onClick, goTo };
  },
};
</script>

<style lang="scss" scoped>
.order-box {
  margin-top: 50px;
  margin-bottom: 65px;
}

.main {
  background-color: #f9f9f9;
  border: 1px solid var(--color-tint);
  margin-bottom: 10px;
  .order {
    padding: 15px 30px 0;

    p {
      line-height: 25px;
    }
  }
}
</style>
