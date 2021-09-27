<template>
  <div>
    <nav-bar class="nav-bar">
      <template v-slot:default>购物车 </template>
    </nav-bar>
    <div class="cart-box">
      <div class="cart-body">
        <van-checkbox-group
          ref="checkboxGroup"
          @change="groupChange"
          v-model="result"
        >
          <van-swipe-cell
            :right-width="50"
            v-for="(item, index) in list"
            :key="index"
          >
            <div class="good-item">
              <van-checkbox :name="item.id" />
              <div class="good-img">
                <img :src="item.goods.cover_url" alt="" />
              </div>
              <div class="good-desc">
                <div class="good-title">
                  <span>{{ item.goods.title }}</span>
                </div>
                <div class="good-btn">
                  <div class="price">
                    <small>￥</small>{{ item.goods.price + ".00" }}
                  </div>
                  <van-stepper
                    integer
                    :min="1"
                    :max="item.goods.stock"
                    :model-value="item.num"
                    :name="item.id"
                    async-change
                    @change="onChange"
                  />
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                square
                icon="delete"
                type="danger"
                class="delete-button"
                @click="deleteGood(item.id)"
              />
            </template>
          </van-swipe-cell>
        </van-checkbox-group>
      </div>
      <van-submit-bar class="submit-all" :price="sumPrice" button-text="结算">
        <van-checkbox :checked="checkAll" @click="onCheckAll"
          >全选</van-checkbox
        >
      </van-submit-bar>
      <div class="empty" v-if="!list.length">
        <img
          class="empty-cart"
          src="https://img01.yzcdn.cn/vant/logo.png"
          alt="空购物车"
        />
        <div class="title">购物车空空如也</div>
        <van-button round color="#1baeae" type="primary" block @click="goTo"
          >前往选购</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Toast } from "vant";
import { reactive, ref, toRefs, onMounted, computed } from "vue";
import { getCart, deleteCartItem, checkedCard, modifyCart } from "network/cart";
export default {
  components: { NavBar },
  setup() {
    const router = useRouter();
    const store = useStore();

    // 数据模型，状态
    const state = reactive({
      list: [],
      result: [], //id 数
      checkAll: true,
    });

    // 计算合计价格，总价
    const sumPrice = computed(() => {
      let price = 0;
      state.list
        .filter((item) => {
          return state.result.includes(item.id);
        })
        .forEach((item) => {
          price += item.num * item.goods.price;
        });

      return price * 100;
    });
    // 初始化购物车数据
    const init = () => {
      Toast.loading({ message: "加载中...", forbidClick: true });
      getCart("include=goods").then((res) => {
        state.list = res.data;
        state.result = res.data
          .filter((n) => n.is_checked == 1)
          .map((item) => item.id);
        Toast.clear();
      });
    };
    onMounted(() => {
      init();
      document.querySelector(".van-button").addEventListener("click", onSubmit);
    });

    // 前去购物
    const goTo = () => {
      router.push({ path: "/home" });
    };

    // 复选框改变处理
    const groupChange = (result) => {
      if (result.length == state.list.length) {
        state.checkAll = true;
      } else {
        state.checkAll = false;
      }
      state.result = result;
      checkedCard({ cart_ids: result });
    };
    const onCheckAll = () => {
      if (!state.checkAll) {
        state.result = state.list.map((item) => item.id);
        state.checkAll = true;
      } else {
        state.result = [];
        state.checkAll = false;
      }
    };

    // 异步改变购物车数量
    const onChange = (value, detail) => {
      Toast.loading({ message: "修改中...", forbidClick: true });
      modifyCart(detail.name, { num: value }).then((res) => {
        // 将在 onMounted 中的 List 中的 num 也要改
        state.list.forEach((item) => {
          if (item.id == detail.name) {
            item.num = value;
          }
        });
        Toast.clear();
      });
    };

    // 删除商品
    const deleteGood = (id) => {
      deleteCartItem(id).then((res) => {
        init();
        store.dispatch("updateCart");
      });
    };

    // 创建结算订单
    const onSubmit = () => {
      if (state.result.length == 0) {
        Toast.fail("请选择商品进行结算");
        return;
      } else {
        router.push({ path: "/createorder" });
      }
    };

    return {
      ...toRefs(state),
      goTo,
      onChange,
      groupChange,
      onCheckAll,
      deleteGood,
      sumPrice,
    };
  },
};
</script>
<style lang="scss">
.cart-box {
  .cart-body {
    margin: 60px 0 100px 0;
    padding-left: 10px;
    .good-item {
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
    .delete-button {
      width: 50px;
      height: 100%;
    }
  }
  .empty {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    margin-top: 200px;
    .empty-cart {
      width: 150px;
      margin-bottom: 20px;
    }
    .van-icon-smile-o {
      font-size: 50px;
    }
    .title {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
  .submit-all {
    margin-bottom: 65px;
    .van-checkbox {
      margin-left: 0;
    }
    .van-submit-bar_text {
      margin-right: 10px;
    }
    .van-submit-bar_button {
      background: red;
    }
  }
  .van-checkbox_icon--checked .van-icon {
    background-color: red;
    border-color: red;
  }
}
</style>
