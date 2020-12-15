<template>
  <section class="container">
    <div class="bjdmxq">
      <div class="title">武当一班</div>

      <div class="filed-list">
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              type="text"
              label="科目"
              value="武当派 真武七截阵"
            ></filed-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              type="number"
              label="变动数"
              value="-1"
            ></filed-item>
          </div>
          <div class="ai-col flex-1">
            <filed-item
              type="text"
              label="已到"
              value="7人"
            ></filed-item>
          </div>
          <div class="ai-col flex-1">
            <filed-item
              type="text"
              label="未到"
              value="0人"
            ></filed-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <arrow-item
              label="点名时间"
              value="2019-11-15 16:50:39"
            ></arrow-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <arrow-item
              label="点名时上课老师"
              value="张真人"
            ></arrow-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <arrow-item
              label="点名时第二上课老师"
              value="张真人"
            ></arrow-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <arrow-item
              label="申请撤销本次点名"
              value="3天内可操作"
            ></arrow-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import FiledItem from "~/components/FiledItem.vue";
import ArrowItem from "~/components/ArrowItem.vue";

export default {
  components: {
    /** 用户 */
    "filed-item": FiledItem,
    "arrow-item": ArrowItem
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
