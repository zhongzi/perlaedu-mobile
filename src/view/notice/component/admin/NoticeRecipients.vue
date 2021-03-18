<template>
  <div class="wrapper recipients">
    <ly-search v-model="keyword" placeholder="输入学生或者老师姓名" />
    <ai-list-stored
      resource="noticeRecipient"
      scrollHeight="60vh"
      :query="innerQuery"
    >
      <template v-slot:header> </template>
      <template v-slot:item="{ item }">
        <notice-recipient-cell :key="item.id" :recipient="item" />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import LySearch from "@/view/layout/component/Search.vue";
import AiListStored from "@/view/component/AiListStored.vue";

import NoticeRecipientCell from "./NoticeRecipientCell.vue";

import merge from "lodash/merge";

@Component({
  components: {
    LySearch,
    AiListStored,
    NoticeRecipientCell,
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
          NoticeRecipient: ["target", "logs"],
          NoticeRecipientLog: ["user"],
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
