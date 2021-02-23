<template>
  <ai-popup
    class="wrapper album-list"
    :value="value"
    :appendToBody="false"
    @input="updateValue"
  >
    <ai-list-stored
      class="albums"
      resource="person"
      scrollHeight="100vh"
      :query="query"
    >
      <template v-slot:header>
        <div class="title">学习风采</div>
      </template>
      <template v-slot:item="{ item }">
        <album-cell :person="item" :key="item.id" />
      </template>
    </ai-list-stored>
  </ai-popup>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiPopup from "@/view/component/AiPopup.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import AlbumCell from "./AlbumCell.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiPopup,
    AiListStored,
    AlbumCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) value: boolean;

  get query() {
    return {
      //      only_student: true,
      filters: JSON.stringify({
        openid: [this.$auth.user.openid],
        openid_second: [this.$auth.user.openid],
      }),
      extras: JSON.stringify({
        Person: ["merchant", "avatar_url", "cover_url"],
        Merchant: ["website"],
      }),
    };
  }

  updateValue(v) {
    this.$emit("input", v);
  }
}
</script>
<style lang="scss" scoped>
.album-list {
  & ::v-deep .h-popup__pannel {
    width: 70%;
    background: #d5d5d5;
  }

  .title {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
