<template>
  <div class="CreateOrder-box">
    <nav-bar>
      <template v-slot:default>订单预览</template>
    </nav-bar>
    <div class="address-wrap">
      <div class="name" @click="goTo" v-show="is_ok">
        {{ address.name }}
        {{ address.phone }}
      </div>
      <div class="address" @click="goTo">
        {{ address.province }}
        {{ address.city }}
        {{ address.county }}
        {{ address.address }}
      </div>
      <van-icon class="arrow" name="arrow" @click="goTo" />
    </div>
    <div class="good">
      <div class="good-item" v-for="(item, index) in cartList" :key="index">
        <div class="good-img">
          <img :src="item.goods.cover_url" alt="" />
        </div>
        <div class="good-desc">
          <div class="good-title">
            <span>{{ item.goods.title }}</span>
            <span>x{{ item.num }}</span>
          </div>
          <div class="good-btn">
            <div class="price">
              <small>￥</small>{{ item.goods.price + ".00" }}
            </div>
          </div>
        </div>
      </div>
      <van-submit-bar
        class="submit-all"
        :price="total * 100"
        button-text="生成订单"
        @submit="handleCreateOrder"
        >商品金额</van-submit-bar
      >
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
        <!-- <van-grid :border="false" :column-num="2">
          <van-grid-item>
            支付宝二维码支付<br />
            <van-image width="150" height="150" :src="aliyun" />
          </van-grid-item>
          <van-grid-item>
            微信二维码支付<br />
            <van-image width="150" height="150" :src="wechat" />
          </van-grid-item>
        </van-grid> -->
      </van-popup>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import {
  getOrderPreview,
  createOrder,
  payOrder,
  payOrderStatus,
} from "network/order";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, reactive, toRefs } from "vue";
import { Toast } from "vant";
import { useStore } from "vuex";
export default {
  components: { NavBar },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      cartList: [],
      address: {},
      is_ok: true,
      showPay: false,
      orderNo: "",
      aliyun: "",
      wechat: "",
    });

    const init = () => {
      Toast.loading({ message: "加载中...", forbidClick: true });
      getOrderPreview().then((res) => {
        let address = res.address.filter((n) => n.is_default == "1");
        if (address.length == 0) {
          state.address = {
            address: "未设置默认地址",
          };
          state.is_ok = !state.is_ok;
        } else {
          state.address = address[0];
        }
        state.cartList = res.carts;
        Toast.clear();
      });
    };

    onMounted(() => {
      init();
    });

    const goTo = () => {
      router.push({ path: "/address" });
    };

    const handleCreateOrder = () => {
      const params = {
        address_id: state.address.id,
      };
      createOrder(params).then((res) => {
        Toast.success("创建订单成功");
        store.dispatch("updateCart");
        state.showPay = true;
        state.orderNo = res.id;
        // 把支付变成二维码的功能代码
        // 订单ID
        // state.orderNo = res.id;
        // console.log(state.orderNo);
        // payOrder(state.orderNo, { type: "aliyun" }).then((res) => {
        //   console.log(res);
        //   state.aliyun = res.qr_code_url;
        //   state.wechat = res.qr_code_url;
        // });
        // // payOrder(state.orderNo, { type: "wechar" }).then((res) => {
        //   console.log(res);
        // });

        // // 轮询查看;
        // const timer = setInterval(() => {
        //   payOrderStatus(state.orderNo).then((res) => {
        //     if (res == "2") {
        //       clearInterval(timer);
        //       router.push({ path: "/order", query: { status: 2 } });
        //     }
        //   });
        // }, 2000);
      });
    };

    const close = () => {
      state.showPay = false;
      router.push({
        path: "/orderdetail",
        query: { order: state.orderNo, payId: 1 },
      });
    };

    const total = computed(() => {
      let sum = 0;
      state.cartList.forEach((item) => {
        sum += parseInt(item.num) * parseFloat(item.goods.price);
      });
      return sum;
    });
    const ok_pay = () => {
      Toast("支付成功");
      router.push({
        path: "/orderdetail",
        query: { order: state.orderNo, payId: 2 },
      });
      Toast.clear();
    };
    return { goTo, handleCreateOrder, close, ...toRefs(state), total, ok_pay };
  },
};
</script>

<style lang="scss" scoped>
.CreateOrder-box {
  background: #f9f9f9;
  margin-top: 50px;
  .address-wrap {
    text-align: left;
    margin-bottom: 20px;
    background: #fff;
    position: relative;
    margin-top: 44px;
    font-size: 14px;
    padding: 15px;
    color: #222333;
    .name,
    .address {
      margin: 10px 0;
    }
    .arrow {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }
    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 5px;
      background-color: #fff;
      background-image: linear-gradient(
        100deg,
        rgba(red, 0.5) 65%,
        transparent 50%
      );
      background-size: 30px 30px;
      transform: skewX(35deg);
      content: "";
    }
  }
  .good {
    margin-bottom: 120px;
  }
  .good-item {
    padding: 10px;
    background: #fff;
    display: flex;
    .good-img {
      img {
        width: 100px;
        height: auto;
      }
    }
    .good-desc {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      padding: 20px;
      .good-title {
        display: flex;
        justify-content: space-between;
      }
      .good-btn {
        display: flex;
        justify-content: space-between;
        .price {
          font-size: 16px;
          color: red;
          line-height: 28px;
        }
        .van-icon-delete {
          font-size: 20px;
          margin-top: 4px;
        }
      }
    }
  }
  .pay-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 10px 0;
    padding-bottom: 50px;
    border-top: 1px solid #e9e9e9;
    > div {
      display: flex;
      justify-content: space-between;
      padding: 0 5%;
      margin: 10px 0;
      font-size: 14px;
      span:nth-child(2) {
        color: red;
        font-size: 18px;
      }
    }
    .pay-btn {
      position: fixed;
      bottom: 7px;
      right: 0;
      left: 0;
      width: 90%;
      margin: 0 auto;
    }
  }
}
.submit-all {
  margin-bottom: 62px;
  z-index: 9 !important;
}
</style>
