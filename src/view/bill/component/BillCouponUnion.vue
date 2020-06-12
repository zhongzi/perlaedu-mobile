<template>
  <div class="wrapper coupon-union">
    <ai-cell
      v-if="union"
      class="union"
      :cover="union.cover_url | alioss({ width: 240, height: 160 })"
      :title="union.name"
      :showBottomLine="false"
      :remark="'共' + (union.count_merchants || 0) + '家机构'"
    >
      <template v-slot:right>
        <hui-button @click.native="gotoUnion" class="button">
          进入综合体
        </hui-button>
      </template>
    </ai-cell>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) union: any;

  gotoUnion() {
    this.$router.push({
      name: "websiteUnion",
      params: {
        unionId: this.union.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.coupon-union {
  background: #fff;
  padding: 10px;

  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;

  .union {
    padding: 15px 10px;
    height: 68px;

    .button {
      min-width: 90px;
      border: 1px solid rgba(155, 155, 155, 0.3);

      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(74, 74, 74, 1);
      line-height: 18px;
    }
  }
}
</style>
