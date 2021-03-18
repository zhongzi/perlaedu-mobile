<template>
  <div class="wrapper status">
    <ai-badge
      content="全部"
      :color="!value || value === '' ? 'red' : 'green'"
      @click.native="saveStatus()"
    />
    <template v-for="(v, n) in noticeStatus">
      <ai-badge
        :key="n"
        :content="v.text"
        :color="value === n ? 'red' : 'green'"
        @click.native="saveStatus(n)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { toOptions } from "@/enum";
import { NoticeStatus } from "@/enum/notice";

import AiBadge from "@/view/component/AiBadge.vue";

@Component({
  components: {
    AiBadge,
  },
})
export default class Home extends Vue {
  @Prop({ type: String, default: "" }) value;

  get noticeStatus() {
    return NoticeStatus;
  }

  saveStatus(status = "") {
    this.$emit("input", status);
  }
}
</script>
<style lang="scss" scoped>
.status {
  display: flex;
  align-items: center;
  justify-content: space-around;

  & ::v-deep .ai-badge span {
    padding: 3px !important;
    font-size: 11px;
  }
}
</style>
