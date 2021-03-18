<template>
  <div class="wrapper notice-recipient-log-cell">
    <ai-cell>
      <template v-slot:cover>
        <i class="iconfont icon-phone" v-if="phone" />
        <i class="iconfont icon-wechat" v-ese />
      </template>
      <template v-slot:title>
        <span class="title"> {{ phone || nickname }} </span>
      </template>
      <template v-slot:subtitle>
        <span class="subtitle"> {{ sentAt | default }} </span>
      </template>
      <template v-slot:remark>
        <span class="content"> {{ batchId }} </span>
      </template>
      <template v-slot:right>
        {{ isSent ? "发送成功" : sentAt ? "发送失败" : "发送中" }}
      </template>
    </ai-cell>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import AiButton from "@/view/component/AiButton.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) log: any;

  get isSent() {
    return _get(this.log, "is_sent");
  }

  get sentAt() {
    return _get(this.log, "sentAt");
  }

  get phone() {
    const phone = _get(this.log, "phone");
    return !isEmpty(phone) && phone;
  }

  get nickname() {
    const nickname = _get(this.log, "user.nickname");
    return !isEmpty(nickname) && nickname;
  }

  get batchId() {
    return _get(this.log, "batch_id");
  }
}
</script>
<style lang="scss" scoped></style>
