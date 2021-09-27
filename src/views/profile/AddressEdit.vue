<template>
  <div class="box">
    <nav-bar>
      <template v-slot:default>{{ header }}</template>
    </nav-bar>

    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="type == 'edit'"
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { useRoute, useRouter } from "vue-router";
import { reactive, toRefs, onMounted, computed } from "vue";
import { areaList } from "@vant/area-data";
import { getkeyFromvalue } from "utils/SDT";
import {
  addAddress,
  EditAddress,
  DeleteAddress,
  getAddressDetail,
} from "network/address";
import { Toast } from "vant";
export default {
  components: { NavBar },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      areaList: areaList,
      searchResult: [],
      addressInfo: {},
      type: "add",
      addressId: "",
      title: "",
    });
    onMounted(() => {
      // 接受参数
      const { type, addressId } = route.query;
      state.type = type;
      state.addressId = addressId;

      if (type == "edit") {
        let _areaCode = "";
        getAddressDetail(addressId).then((res) => {
          _areaCode = getkeyFromvalue(areaList.county_list, res.county);
          state.addressInfo = {
            name: res.name,
            tel: res.phone,
            province: res.province,
            city: res.city,
            county: res.county,
            areaCode: _areaCode,
            addressDetail: res.address,
            isDefault: !!res.is_default,
          };
        });
      }
    });
    const header = computed(() => {
      return state.type === "add" ? "新增地址" : "编辑地址";
    });
    const onSave = (content) => {
      const params = {
        name: content.name,
        phone: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        address: content.addressDetail,
        is_default: content.isDefault ? 1 : 0,
      };

      if (state.type == "edit") {
        // 修改数据
        EditAddress(state.addressId, params);
      } else if (state.type == "add") {
        // 调用接口添加数据
        addAddress(params);
      }
      Toast.success("保存成功");
      setTimeout(() => {
        router.back();
      }, 1000);
    };
    const onDelete = () => {
      DeleteAddress(state.addressId).then((res) => {
        Toast.success("删除成功");
        setTimeout(() => {
          router.back();
        }, 1500);
      });
    };

    return { ...toRefs(state), onSave, onDelete, header };
  },
};
</script>

<style lang="scss">
.box {
  margin-top: 50px;
}
.van-address-edit__buttons {
  .van-button:nth-child(1) {
    background: var(--color-tint);
    border-color: var(--color-tint);
  }
}
</style>
