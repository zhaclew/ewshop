<template>
  <div>
    <nav-bar>
      <template v-slot:default>新用户注册</template>
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
            v-model="name"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
            v-model="password_confirmation"
            type="password_confirmation"
            name="确认密码"
            label="确认密码"
            placeholder="确认密码"
            :rules="[{ required: true, message: '请填写确认密码' }]"
          />
          <van-field
            v-model="email"
            name="电子邮箱"
            label="电子邮箱"
            placeholder="电子邮箱"
            :rules="[{ required: true, message: '请输入正确的电子邮箱格式' }]"
          />
          <div style="margin: 16px;">
            <p class="login_link" @click="login">已有账号，立即登录</p>
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
import { register } from "network/user";
import { Notify, Toast } from "vant";
import { useRouter } from "vue-router";
export default {
  components: { NavBar },
  setup() {
    let router = useRouter();
    const userinfo = reactive({
      name: "",
      password: "",
      password_confirmation: "",
      email: "",
    });
    const onSubmit = (value) => {
      // 先验证
      if (userinfo.password != userinfo.password_confirmation) {
        Notify("两次密码不一致...");
      } else {
        register(userinfo).then((res) => {
          if (res.status == 201) {
            Toast.success("注册成功");
            setTimeout(() => {
              router.push({ path: "/login" });
            }, 1000);
          }
          userinfo.password_confirmation = "";
          userinfo.password = "";
        });
      }

      // 在提交
    };
    const login = () => {
      router.push({ path: "/login" });
    };
    return { onSubmit, ...toRefs(userinfo), login };
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
