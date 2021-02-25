<template>
  <div class="wrapper merchant-cell">
    <ai-cell
      v-if="merchant"
      class="merchant"
      :title="merchant.name"
      :showBottomLine="false"
      :remark="'共' + (merchant.count_persons || 0) + '人正在关注'"
    >
      <template v-slot:cover>
        <div class="cover">
          <img
            :src="
              merchant.cover_url
                | alioss({ width: 150, height: 100, mode: 'fill' })
            "
          />
        </div>
      </template>
      <template v-slot:right>
        <hui-button @click.native="openWebsiteMerchant" class="button">
          进入门户
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
  @Prop({ type: Object, default: null }) merchant: any;

  openWebsiteMerchant() {
    this.$router.push({
      name: "websiteMerchant",
      params: {
        merchantId: this.merchant.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.merchant-cell {
  background: #fff;
  padding: 6px;

  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;

  .merchant {
    min-height: 68px;

    .cover {
      width: 86px;
      min-width: 86px;
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 5px;

      img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 4px;
      }
    }

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
