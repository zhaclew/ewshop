<template>
  <div id="box">
    <nav-bar class="nav-bar">
      <template v-slot:default>个人中心</template>
    </nav-bar>

    <div class="user-box">
      <div class="user-info">
        <div class="info">
          <img :src="user.avatar_url" alt="" />
          <div class="user-desc">
            <span>昵称：{{ user.name }}</span>
            <span>登录名：{{ user.email }}</span>
            <span class="name">个性签名：这个家伙很懒，什么也没留下...</span>
          </div>
        </div>
      </div>
    </div>

    <div class="main">
      <van-cell title="我的收藏" is-link @click="goToast('未开放区域')" />
      <van-cell title="我的订单" is-link @click="goTo('/order')" />
      <van-cell title="账号管理" is-link @click="goToast('未开放区域')" />
      <van-cell title="地址管理" is-link @click="goTo('/address')" />
      <van-cell title="关于我们" is-link @click="goToast('制作者：渣线团')" />
    </div>

    <div>
      <van-button
        round
        color="var(--color-tint)"
        @click="tologouot"
        style="width:94%;"
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { logout, getUser } from "network/user";
import { Toast } from "vant";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { onMounted, reactive, toRefs } from "vue";
export default {
  components: { NavBar },
  setup() {
    const router = useRouter();
    const store = useStore();

    // 用户的数据模型
    const state = reactive({
      user: {},
    });

    onMounted(() => {
      getUser().then((res) => {
        state.user = res;
      });
    });
    const tologouot = () => {
      logout().then((res) => {
        if (res.status == "204") {
          Toast.success("退出成功");
          // 清除token window.LocalStroage
          window.localStorage.removeItem("token");
          setTimeout(() => {
            router.push({ path: "/login" });
          }, 500);
        }
      });
    };

    // 跳转页面
    const goTo = (path, query) => {
      router.push({ path, query: query || {} });
    };
    // 跳转轻提示
    const goToast = (str) => {
      Toast(str);
    };
    return { tologouot, goToast, ...toRefs(state), goTo };
  },
};
</script>

<style lang="scss" scoped>
#box {
  background: #fcfcfc;
}
.user-box {
  margin-top: 65px;
  .user-info {
    width: 94%;
    margin: 10px auto;
    height: 115px;
    background: linear-gradient(90deg, #31c7a7, #a1c7c7);
    box-shadow: 0 2px 5px #269090;
    border-radius: 6px;
    margin-top: 50px;
    text-align: left;
    .info {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      padding: 25px 20px;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-top: 4px;
      }
      .user-desc {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        line-height: 20px;
        font-size: 14px;
        color: #fff;
        span {
          color: #fff;
          font-size: 14px;
          padding: 2px 0;
        }
      }
    }
  }
}
.main {
  text-align: left;
  margin: 15px 0 10px 0;
}
</style>
