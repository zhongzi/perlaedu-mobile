<template>
  <div class="wrapper notice-recipient-logs">
    <ly-search v-model="keyword" placeholder="输入手机号码或微信昵称" />
    <ai-list-stored
      resource="noticeRecipientLog"
      scrollHeight="60vh"
      :query="innerQuery"
    >
      <template v-slot:item="{ item }">
        <notice-recipient-log-cell :key="item.id" :log="item" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import LySearch from "@/view/layout/component/Search.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import NoticeRecipientLogCell from "./NoticeRecipientLogCell.vue";

import merge from "lodash/merge";

@Component({
  components: {
    LySearch,
    AiListStored,
    NoticeRecipientLogCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;

  keyword: any = "";
  get innerQuery() {
    return merge(
      {
        keyword: this.keyword.trim(),
        extras: JSON.stringify({
          NoticeRecipientLog: ["recipient"],
          NoticeRecipient: ["target"],
          OAuth: ["avatar_url"],
          Person: ["avatar_url", "user", "user_second"],
        }),
        sort: "id desc",
      },
      this.query || {}
    );
  }
}
</script>
<style lang="scss" scoped></style>
