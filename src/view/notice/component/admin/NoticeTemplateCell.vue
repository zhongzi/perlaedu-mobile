<template>
  <ai-card class="wrapper notice-template-cell">
    <template v-slot:header>
      <div class="cover">
        <template v-if="cover">
          <img :src="cover | alioss({ width: 128 })" />
        </template>
        <template v-else>
          <i class="iconfont icon-notice" />
        </template>
      </div>
    </template>
    <template v-slot:footer>
      <div class="title">{{ title }}</div>
    </template>
  </ai-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCard,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) template: any;

  get cover() {
    const cover = _get(this.template, "cover");
    return isEmpty(cover) ? null : cover;
  }

  get title() {
    return _get(this.template, "title");
  }
}
</script>
<style lang="scss" scoped>
.notice-template-cell {
  .cover {
    width: 60px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 24px;
      color: red;
    }
  }
  .title {
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
