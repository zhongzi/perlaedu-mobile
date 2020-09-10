<template>
  <div class="wrapper clue">
    <ai-card>
      <template v-slot:header>
        <div class="header">
          <ai-badge color="#F5A623" :content="'编号:' + clue.id" />
          <div class="update">
            <span class="label">创建时间: </span>
            <span class="value">
              {{ clue.created_at | date("MM-dd HH:mm") }}
            </span>
          </div>
        </div>
      </template>
      <template v-slot:body>
        <div class="body">
          <div class="section channel">
            <div class="field">
              <span class="label">来源渠道: </span>
              <span class="value">{{ clue | safe("channel.title") }} </span>
            </div>
            <div class="field">
              <span class="label">来源信息: </span>
              <span class="value"> {{ sourceDetail }} </span>
            </div>
          </div>
          <div class="section detail">
            <div class="field">
              <span class="label">客户名称: </span>
              <span class="value">{{ clue.name || "-" }}</span>
            </div>
            <div class="field">
              <span class="label">客户手机: </span>
              <span class="value">{{ clue.phone || "-" }}</span>
            </div>
            <div class="field">
              <span class="label">客户留言: </span>
              <span class="value">{{ clue.remark || "-" }}</span>
            </div>
          </div>
          <div class="section referrer" v-if="clue.referrer">
            <div class="field">
              <span class="label">推荐人: </span>
              <span class="value">{{ clue | safe("referrer.nickname") }} </span>
            </div>
            <div class="field">
              <span class="label">推荐人手机: </span>
              <span class="value">{{ clue | safe("referrer.phone") }} </span>
            </div>
          </div>
        </div>
      </template>
    </ai-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";
import AiBadge from "@/view/component/AiBadge.vue";
import AiCell from "@/view/component/AiCell.vue";

@Component({
  components: {
    AiCard,
    AiCell,
    AiBadge,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) clue: any;
  @Prop({ type: String, default: "" }) outerTag: string;
  @Prop({ type: Boolean, default: false }) isInDetail: boolean;

  get sourceDetail() {
    if (!this.clue.source) return "-";
    return `(${this.clue.source_class}/${this.clue.source_id})${
      this.clue.source.title || this.clue.source.name
    }`;
  }
}
</script>
<style lang="scss" scoped>
.clue {
  width: 100%;

  .header {
    width: 100%;
    padding: 10px;

    .left {
      display: flex;
      align-items: center;

      .number {
        margin-right: 10px;
        min-width: 50px;
        span {
          font-size: 24px;
          font-weight: 600;
        }
      }

      .cover {
        width: 40px;
        border-radius: 50%;
      }
    }
  }
  .body {
    padding: 10px;

    .section {
      margin: 15px 0px;
      .field {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 0px 10px;

        font-size: 14px;
        color: #4a4a4a;
      }
    }
  }
}
</style>
