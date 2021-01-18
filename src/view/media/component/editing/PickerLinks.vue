<template>
  <ai-list-stored
    class="wrapper picker-links"
    resource="mediaLink"
    scrollType=""
    :query="query"
    :refresh="refresh"
    @update:refresh="(v) => $emit('update:refresh', v)"
  >
    <template v-slot:header>
      {{ title }}
    </template>
    <template v-slot:list="{ list }">
      <template v-for="link in list">
        <ai-chip
          class="link"
          :logo="link | safe(logoKey, null)"
          :title="link | safe(titleKey)"
          :enabledIcon="enabledIcon"
          :key="link.id"
          @click:icon="clickIcon(link)"
        />
      </template>
      <span class="link" @click="clickPlus">
        <i class="iconfont icon-plus-circle" />
      </span>
    </template>
  </ai-list-stored>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiChip from "@/view/component/AiChip.vue";
import AiListStored from "@/view/component/AiListStored.vue";

@Component({
  components: {
    AiChip,
    AiListStored,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: String, default: "" }) title: string;
  @Prop({ type: String, default: "logo" }) logoKey: string;
  @Prop({ type: String, default: "title" }) titleKey: string;
  @Prop({ type: Boolean, default: false }) refresh: boolean;
  @Prop({ type: Boolean, default: true }) enabledIcon: boolean;

  clickIcon(link) {
    this.$emit("click:item:delete", link);
  }

  clickPlus() {
    this.$emit("click:item:plus");
  }
}
</script>
<style lang="scss" scoped>
.picker-links {
  .link {
    font-size: 18px;
    margin-left: 10px;
  }
}
</style>
