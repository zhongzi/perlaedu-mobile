<template>
  <div class="wrapper">
    <ai-cell
      v-if="union"
      class="union"
      :showBottomLine="false"
      :remark="'共' + (union.count_merchants || 0) + '家机构'"
    >
      <template v-slot:title>
        <span class="title"> {{ union.name }} </span>
      </template>
      <template v-slot:cover>
        <div class="cover">
          <img
            :src="
              union.cover_url
                | alioss({ width: 150, height: 100, mode: 'fill' })
            "
          />
        </div>
      </template>
      <template v-slot:right>
        <hui-button @click.native="gotoUnion" class="button">
          查看综合体
        </hui-button>
      </template>
    </ai-cell>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) union: any;
  @Prop({ type: Object, default: null }) merchant: any;

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
.wrapper {
  background: #fff;
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 6px 12px 6px 6px;

  .union {
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
    .title {
      font-size: 14px;
      color: rgba(74, 74, 74, 1);
      line-height: 20px;
    }
  }
}
</style>
