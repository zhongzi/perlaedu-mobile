<template>
  <section class="container">
    <div class="tjsj">
      <div class="ai-row">
        <div class="ai-col flex-4">
          <filed-item
            type="picker"
            label="上课日期"
            placeholder="周五"
            value="周五"
          ></filed-item>
        </div>
        <div class="ai-col flex-5">
          <filed-item
            type="picker"
            label="上课时间"
            placeholder="09:30"
            value="09:30"
          ></filed-item>
        </div>
        <div class="delete">
          <span class="iconfont iconshanchu"></span>
        </div>
      </div>

      <div class="btn">
        添加时间
      </div>
    </div>
  </section>
</template>

<script>
import FiledItem from "~/components/FiledItem.vue";

export default {
  components: {
    /** 表单数据 */
    "filed-item": FiledItem
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
      title: "AI教务"
    };
  }
};
</script>

<style lang="scss">
</style>
