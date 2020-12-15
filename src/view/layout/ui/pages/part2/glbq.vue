<template>
  <section class="container">
    <div class="glbq">
      <div class="ai-mask">
        <div class="content center">
          <div class="title">
            <span class="iconfont iconyiyoubiaoqian"></span>
            <div class="txt">已有标签</div>
          </div>

          <div class="tag-list">
            <div class="tag-item">已导入</div>
            <div class="tag-item custom">
              <div class="txt">意向A</div>
              <div class="trigger">×</div>
            </div>
          </div>

          <div class="tag-input">
            <input
              class="input"
              type="text"
              placeholder="添加新标签"
            >
            <div class="btn">添加</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  components: {
    Logo
  },
  head() {
    return {
      title: "管理标签"
    };
  }
};
</script>
<style lang="scss">
</style>
