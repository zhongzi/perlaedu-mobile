<template>
  <div class="wrapper notice-interaction-cell">
    <ai-cell>
      <template v-slot:cover>
        <img :src="avatar" class="avatar" />
      </template>
      <template v-slot:title>
        <span class="title"> #{{ interaction.id }} </span>
        <span class="title"> {{ createdAt | defaultDate }} </span>
      </template>
      <template v-slot:subtitle>
        <span class="target" v-if="interaction.target_id > 0">
          回复: #{{ interaction.target_id }}
        </span>
        <ai-content-media :content="description" :medias="medias" />
      </template>
      <template v-slot:right>
        <slot name="actions">
          <ai-button> 回复 </ai-button>
          <ai-button> 全部 </ai-button>
        </slot>
      </template>
    </ai-cell>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import AiButton from "@/view/component/AiButton.vue";
import AiContentMedia from "@/view/component/AiContentMedia.vue";

import _get from "lodash/get";
import map from "lodash/map";

@Component({
  components: {
    AiCell,
    AiContentMedia,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) interaction: any;

  get avatar() {
    return _get(this.interaction, "user.avatar");
  }

  get createdAt() {
    return _get(this.interaction, "created_at");
  }

  get description() {
    return _get(this.interaction, "description");
  }

  get medias() {
    return map(_get(this.interaction, "attachments") || [], (attachment) => {
      return attachment.media;
    });
  }
}
</script>
<style lang="scss" scoped>
.notice-interaction-cell {
  width: 100%;
  padding: 5px 0px;

  & ::v-deep .ai-cell {
    align-items: start;
    &__left {
      align-items: start;
    }
  }

  .avatar {
    width: 40px;
    border-radius: 8px;
    margin-right: 5px;
  }
}
</style>
