<template>
  <div>
    <nav-bar>
      <template v-slot:default>登录界面</template>
    </nav-bar>
    <div style="margin-top:10px;">
      <div style="text-align:center;padding:50px;">
        <van-image
          width="5rem"
          height="5rem"
          fit="contain"
          src="https://img01.yzcdn.cn/vant/logo.png"
        />
        <van-form @submit="onSubmit">
          <van-field
            v-model="email"
            name="电子邮箱"
            label="邮箱"
            placeholder="电子邮箱"
            :rules="[{ required: true, message: '请填写电子邮箱' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />

          <div style="margin: 16px;">
            <p class="login_link" @click="$router.push({ path: '/register' })">
              没有账号，立即注册
            </p>
            <van-button
              round
              block
              type="info"
              color="#44b883"
              native-type="submit"
              >提交</van-button
            >
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { ref, reactive, toRefs } from "vue";
import { login } from "network/user";
import { Notify, Toast } from "vant";
import { useRouter } from "vue-router";
export default {
  components: { NavBar },
  setup() {
    let router = useRouter();
    const userinfo = reactive({
      password: "123123",
      email: "test@a.com",
    });
    const onSubmit = () => {
      login(userinfo).then((res) => {
        // 将 Token 保存到本地 window.LocalStorage  setItem(key, value) getItem(key)
        window.localStorage.setItem("token", res.access_token);

        // 在 vuex isLogin

        Toast.success("登录成功");
        userinfo.email = "";
        userinfo.password = "";

        setTimeout(() => {
          router.push({ path: "/profile" });
        }, 500);
      });
    };

    return { onSubmit, ...toRefs(userinfo) };
  },
};
</script>

<style lang="scss" scoped>
.login_link {
  color: var(--color-tint);
  font-size: 14px;
  margin: 10px 0;
  text-align: left;
}
</style>
