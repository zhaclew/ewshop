<template>
  <div>
    <router-view />
    <div id="nav">
      <router-link to="/" class="nav-bar-item">
        <van-icon name="home-o" size="27" /><br />首页
      </router-link>
      <router-link to="/category" class="nav-bar-item">
        <van-icon name="apps-o" size="27" /><br />分类
      </router-link>
      <router-link to="/shopcart" class="nav-bar-item">
        <van-badge :content="$store.state.cartCount" max="99">
          <van-icon name="shopping-cart-o" size="27" />
          <br />购物车
        </van-badge>
      </router-link>
      <router-link to="/profile" class="nav-bar-item">
        <van-icon name="user-o" size="27" />
        <br />我的
      </router-link>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted } from "vue";
export default {
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch("updateCart");
    });
  },
};
</script>
<style lang="scss">
@import "assets/css/base.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 8px 0;
  background-color: #f6f6f6;
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0 -3px 1px rgba($color: gray, $alpha: 0.1);
  a {
    color: #2c3e50;

    &.router-link-exact-active {
      color: var(--color-high-text);
    }
  }
  .nav-bar-item {
    flex: 1;
  }
  .icon {
    font-size: 25px;
  }
}
</style>
