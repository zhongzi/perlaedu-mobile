<template>
  <div class="wrapper picker-items">
    <div class="title">
      {{ title }}
    </div>

    <div class="items">
      <template v-for="item in items">
        <ai-chip
          class="item"
          :key="getValue(item)"
          :logo="getLogo(item)"
          :title="getLabel(item)"
          :enabledIcon="true"
          @click:icon="clickChipIcon(item)"
        />
      </template>
      <span class="item" @click="clickPlus">
        <i class="iconfont icon-plus-circle" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiChip from "@/view/component/AiChip.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiChip,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: null }) items: any;
  @Prop({ type: String, default: "" }) title: string;
  @Prop({ type: String, default: "logo" }) logoKey: string;
  @Prop({ type: String, default: "title" }) labelKey: string;
  @Prop({ type: String, default: "id" }) valueKey: string;

  clickChipIcon(item) {
    this.$emit("icon:delete:clicked", item);
  }

  clickPlus() {
    this.$emit("icon:plus:clicked");
  }

  getLogo(item) {
    return _get(item, this.logoKey);
  }

  getLabel(item) {
    return isEmpty(this.labelKey) ? item : _get(item, this.labelKey);
  }

  getValue(item) {
    return isEmpty(this.valueKey) ? item : _get(item, this.valueKey);
  }
}
</script>
<style lang="scss" scoped>
.picker-items {
  .title {
    margin-top: 10px;
    font-size: 1.4rem;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #545454;
    letter-spacing: 0.1rem;
    line-height: 2;
  }

  .item {
    font-size: 18px;
    margin-left: 10px;
  }
}
</style>
