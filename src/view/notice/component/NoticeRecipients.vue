<template>
  <div class="wrapper recipients">
    <ai-list-stored
      resource="noticeRecipient"
      scrollType=""
      :limit="24"
      :enableMoreData="true"
      :query="innerQuery"
      @emit-list="setDefaultCurRecipient"
    >
      <template v-slot:list="{ list }">
        <div class="content">
          <template v-for="item in list">
            <student-avatar
              :key="item.id"
              :person="item.target"
              :active="curRecipient === item"
              @click.native="curRecipient = item"
            />
          </template>
        </div>
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

import StudentAvatar from "@/view/layout/component/StudentAvatar.vue";

import _get from "lodash/isEmpty";
import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";
import find from "lodash/find";

@Component({
  components: {
    AiListStored,
    StudentAvatar,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) notice: any;
  @Prop({ type: Object, default: null }) query: any;

  curRecipient: any = null;

  get recipientId() {
    return parseInt(this.$route.query.recipientId as string);
  }

  get innerQuery() {
    return merge(
      {
        notice_id: this.notice.id,
        extras: JSON.stringify({
          NoticeRecipient: ["target"],
          OAuth: ["avatar"],
          Person: ["avatar_url", "user", "user_second"],
        }),
        sort: "id desc",
      },
      this.query || {}
    );
  }

  setDefaultCurRecipient({ list }) {
    this.curRecipient =
      find(list, (recipient) => recipient.id === this.recipientId) || list[0];
    this.$nextTick(() => {
      this.$bus.$emit("infinite:scroll:refresh");
    });
  }

  @Watch("curRecipient", { deep: true })
  onCurRecipientChanged() {
    if (!isEmpty(this.curRecipient)) {
      this.$emit("selected", this.curRecipient);
    }
  }
}
</script>
<style lang="scss" scoped>
.recipients {
  .content {
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(3, 1fr);
  }

  & ::v-deep .ai-list-stored__list-load-more {
    background: #f7f7f7;
    width: 100%;
    margin: 5px 0px;

    color: #b9b8b8;
  }
}
</style>
