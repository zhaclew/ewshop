<template>
  <div>
    <ul class="recommend">
      <li class="recommend-item" v-for="item in books.slice(0,4)" :key="item.id">
        <a href="" @click.prevent="goDetail(item.id)">
          <img v-lazy="item.cover_url" alt="" /><br />
          <span>{{item.title}}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import {ref,inject} from 'vue'
import {useRouter} from 'vue-router'
export default {
  setup() {
    const books = inject('banner')
    const router = useRouter()
    function goDetail(id){
      router.push({path: '/detail',query:{id}})
    }
    return {books,goDetail};
  }
};
</script>

<style lang="scss" scoped>
.recommend {
  display: flex;
  height: 120px;
  list-style: none;
  padding: 10px 0 20px 0;
  border-bottom: 8px solid #eee;
}
.recommend-item {
  flex: 1;
  position: relative;
  img {
    height: 70%;
  }
  span{
      height: 10%;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: 12px;
  }
}
</style>