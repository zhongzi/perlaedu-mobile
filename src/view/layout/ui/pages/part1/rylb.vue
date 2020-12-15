<template>
  <section class="container">
    <div class="rylb">
      <div class="search">
        <div class="ico">
          <span class="iconfont iconsousuo"></span>
        </div>
        <input
          class="search-input"
          type="text"
        >
        <div class="trigger">搜索</div>
      </div>

      <div class="list">
        <div class="item">
          <div class="tag">A</div>
          <div class="cont">
            <user-item></user-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import UserItem from "~/components/UserItem.vue";

export default {
  components: {
    /** 用户 */
    "user-item": UserItem
  },

  data() {
    return {
      list: [
        {
          tag: "A",
          users: [
            {
              name: "全真弃子",
              binded: true,
              status: "已停课"
            }
          ]
        }
      ]
    };
  },

  head() {
    return {
      title: "人员列表"
    };
  }
};
</script>
<style lang="scss">
</style>
