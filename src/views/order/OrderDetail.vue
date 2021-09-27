<template>
  <div class="orderDetail-box">
    <nav-bar>
      <template v-slot:default>订单详情</template>
    </nav-bar>
    <div class="header_detail detail">
      <p><span>订单状态：</span>{{ status == 2 ? "已支付" : "未支付" }}</p>
      <p><span>订单编号：</span>{{ number }}</p>
      <p><span>下单时间：</span>{{ time }}</p>
      <van-button
        v-if="status == 1"
        color="lightseagreen"
        block
        style="margin-bottom: 10px;"
        @click="goPay"
        >去支付</van-button
      >
      <van-button block v-if="status == 2" @click="goCheck"
        >确认订单</van-button
      >
    </div>
    <div class="content_detail detail">
      <p><span>商品金额：￥</span>{{ sum }}</p>
      <p><span>配送方式：</span>普通快递</p>
    </div>
    <div class="foot_detail">
      <van-card
        v-for="(item, index) in goods_list"
        :key="index"
        :num="item.num"
        :price="item.price + '.00'"
        :desc="item.description"
        :title="item.title"
        :thumb="item.cover_url"
      />
    </div>
    <van-popup
      closeable
      close-icon="close"
      :show="showPay"
      position="bottom"
      :style="{ height: '30%' }"
      @click.capture="close"
    >
      <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0' }">
        <van-button
          @click="ok_pay"
          :style="{ marginBottom: '10px' }"
          block
          type="primary"
          >支付宝支付</van-button
        >
        <van-button @click="ok_pay" color="limegreen" block
          >微信支付</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { getOrderDetail } from "network/order";
import { useRoute, useRouter } from "vue-router";
import { reactive, toRefs, onMounted } from "vue";
import { Toast } from "vant";
import { useStore } from "vuex";
export default {
  components: { NavBar },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      goods_list: [],
      user: {},
      number: [],
      time: "",
      status: 1,
      total: [],
      sum: "",
      showPay: false,
    });

    const init = () => {
      getOrderDetail(route.query.order).then((res) => {
        console.log(route.query.payId);
        state.status = route.query.payId;
        state.number = res.order_no;
        state.time = res.created_at;
        state.goods_list = res.goods.data;
        res.orderDetails.data.forEach((item, index) => {
          state.goods_list[index].num = item.num;
        });
        state.goods_list.forEach((item, index) => {
          state.total[index] = item.price * item.num;
        });
        state.sum = state.total.reduce((sum, num) => sum + num);
      });
    };

    onMounted(() => {
      Toast.loading({ message: "加载中", forbidClick: true });
      init();
      Toast.clear();
    });
    const close = () => {
      state.showPay = false;
    };
    const ok_pay = () => {
      Toast("支付成功");
      state.status = 2;
      Toast.clear();
    };
    const goPay = () => {
      state.showPay = true;
    };
    const goCheck = () => {
      router.push({ path: "/order" });
    };
    return { ...toRefs(state), ok_pay, close, goPay, goCheck };
  },
};
</script>

<style lang="scss" scoped>
.orderDetail-box {
  margin-top: 45px;
  background-color: #f9f9f9;
}
.detail {
  padding: 20px;
  text-align: left;
  background-color: #fff;
  span {
    color: gray;
  }
  p {
    margin-bottom: 10px;
  }
}
.content_detail {
  margin: 20px 0;
  padding-bottom: 10px;
}
.foot_detail {
  margin-bottom: 65px;
  text-align: left;
}
</style>
