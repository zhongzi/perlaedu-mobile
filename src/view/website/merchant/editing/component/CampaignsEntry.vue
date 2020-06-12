<template>
  <ai-cell
    title="最新活动"
    subtitle="自动显示活动招生里正在进行中的活动"
    @click.native="gotoCampaignManager"
    class="wrapper editing-campaigns-entry"
  >
    <template v-slot:title>
      <span class="title">
        最新活动
      </span>
    </template>
    <template v-slot:right>
      <i class="iconfont icon-direction" />
    </template>
  </ai-cell>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  gotoCampaignManager() {
    window.location.href = this.$configs.campaignServiceURL;
    return;
  }
}
</script>
<style lang="scss" scoped>
.editing-campaigns-entry {
  padding-bottom: 10px;
  .title {
    font-size: 14px;
    font-weight: bold;
    color: rgba(84, 84, 84, 1);
    line-height: 19px;
    letter-spacing: 1px;
  }

  i {
    color: rgba(212, 212, 212, 1);
  }
}
</style>
