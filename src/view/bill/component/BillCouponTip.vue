<template>
  <div class="wrapper tip">
    <ai-line-header title="注意事项" class="header" />
    <div v-if="isStaff">
      点击立即核销，提交核销备注即可。本次核销有可能因为核销码失效而失败，
      请重新刷新用户二维码再次扫码核销
    </div>
    <div v-else>使用时点击立即使用， 出示二维码给机构老师成功使用券即作废</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiLineHeader from "@/view/component/AiLineHeader.vue";

@Component({
  components: {
    AiLineHeader,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) coupon: any;
  @Prop({ type: Boolean, default: false }) isStaff: boolean;
}
</script>
<style lang="scss" scoped>
.tip {
  .header {
  }
  div {
    margin: 10px auto;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(74, 74, 74, 1);
    line-height: 20px;
  }
}
</style>
