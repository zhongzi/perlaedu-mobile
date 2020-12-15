<template>
  <section class="container">
    <div class="yypk">
      <div class="hd">给 阳顶天 排课</div>
      <div class="bd">
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              label="排课日期"
              value="周一"
              type="picker"
            ></filed-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              label="从几点"
              value="10点"
              type="picker"
            ></filed-item>
          </div>
          <div class="ai-col flex-1">
            <filed-item
              label="几分开始排"
              value="50分"
              type="picker"
            ></filed-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              label="一节课多久"
              value="10点"
              type="picker"
            ></filed-item>
          </div>
          <div class="ai-col flex-1">
            <filed-item
              label="休息多久"
              value="50分"
              type="picker"
            ></filed-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              label="最多几人"
              value="12人"
              type="picker"
            ></filed-item>
          </div>
          <div class="ai-col flex-1">
            <filed-item
              label="排几节"
              value="1节 "
              type="picker"
            ></filed-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              label="上哪门课程"
              value="周一"
              type="picker"
            ></filed-item>
          </div>
          <div class="ai-col flex-1">
            <filed-item
              label="扣多少课时"
              value="周一"
              type="picker"
            ></filed-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import FiledItem from "~/components/FiledItem.vue";

export default {
  components: {
    "filed-item": FiledItem
  },
  head() {
    return {};
  }
};
</script>
<style lang="scss">
</style>
