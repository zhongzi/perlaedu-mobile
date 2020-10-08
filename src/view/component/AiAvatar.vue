<template>
  <ai-cell :class="b()">
    <template v-slot:cover>
      <slot name="avatar">
        <img :src="avatar" :class="b('avatar')" />
      </slot>
    </template>
    <template v-slot:title>
      <slot name="name">
        {{ name }}
      </slot>
    </template>
    <template v-slot:subtitle>
      <div class="remark">
        <slot name="remark">
          {{ remark }}
        </slot>
      </div>
    </template>
    <template v-slot:right>
      <slot name="right" />
    </template>
  </ai-cell>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "./AiCell.vue";

@Component({
  name: "ai-avatar",
  components: {
    AiCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: "" }) avatar: string;
  @Prop({ type: String, default: "" }) name: string;
  @Prop({ type: String, default: "" }) remark: string;
}
</script>
<style lang="scss" scoped>
.ai-avatar {
  &__avatar {
    width: 40px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .remark {
    font-size: 12px;
  }
}
</style>
