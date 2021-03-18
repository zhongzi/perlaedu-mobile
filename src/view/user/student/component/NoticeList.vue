<template>
  <ai-popup
    class="wrapper notice-list"
    :value="value"
    :appendToBody="false"
    @input="updateValue"
  >
    <ai-list-stored
      class="notices"
      resource="noticeRecipient"
      scrollHeight="100vh"
      :query="query"
    >
      <template v-slot:header>
        <div class="title">通知</div>
      </template>
      <template v-slot:item="{ item }">
        <notice-cell :recipient="item" :key="item.id" />
      </template>
    </ai-list-stored>
  </ai-popup>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiPopup from "@/view/component/AiPopup.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import NoticeCell from "./NoticeCell.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiPopup,
    AiListStored,
    NoticeCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) value: boolean;

  get query() {
    return {
      myself: "true",
      extras: JSON.stringify({
        NoticeRecipient: ["target", "merchant", "notice", "source", "name"],
        NoticeTarget: ["target"],
        Notice: ["template"],
        Merchant: ["website", "logo_url"],
      }),
    };
  }

  updateValue(v) {
    this.$emit("input", v);
  }
}
</script>
<style lang="scss" scoped>
.notice-list {
  & ::v-deep .h-popup__pannel {
    width: 70%;
    background: #f5f5f5;
  }

  .notices {
    padding: 0px 5px;
  }

  .title {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
