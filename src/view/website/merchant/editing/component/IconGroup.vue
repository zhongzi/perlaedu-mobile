<template>
  <div class="wrapper icon-group">
    <ai-line-header class="title">
      {{ group | safe("title") }}
    </ai-line-header>
    <div class="icons">
      <template v-for="icon in icons">
        <ai-state-check
          :checked="icon.url === curIcon"
          @click.native="onUpdate(icon)"
          :key="icon.id"
          class="icon"
          :enableCheck="false"
        >
          <img :src="icon.url" />
        </ai-state-check>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiStateCheck from "@/view/component/AiStateCheck.vue";
import AiLineHeader from "@/view/component/AiLineHeader.vue";

import _get from "lodash/get";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiStateCheck,
    AiLineHeader,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) group: any;
  @Prop({ type: String, default: null }) curIcon: string;

  get icons() {
    return this.list;
  }

  created() {
    const query = {
      group_id: this.group.id,
      limit: 100,
    };

    this.store = "icon";
    this.tag = this.encodeTag(query);
    this.loadList({ query: query });
  }

  onUpdate(icon) {
    this.$emit("selected", icon);
  }
}
</script>
<style lang="scss" scoped>
.icon-group {
  .icons {
    .icon {
      margin: 3px;
      width: 50px;
      height: 50px;
      display: inline-block;

      & ::v-deep .ai-state-check__icon {
        font-size: 10px;
        padding: 2px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
