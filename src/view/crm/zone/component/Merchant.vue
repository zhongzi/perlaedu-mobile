<template>
  <ai-card class="wrapper merchant">
    <template v-slot:body>
      <img :src="cover" />
      <div class="title">{{ merchant.title }}</div>
    </template>
  </ai-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import _get from "lodash/get";

import AiCard from "@/view/component/AiCard.vue";

@Component({
  components: {
    AiCard,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;

  get cover() {
    return (
      _get(this.merchant, "cover") ||
      require("@/asset/image/default/cover-merchant.png")
    );
  }
}
</script>
<style lang="scss" scoped>
.merchant {
  margin: 5px;
  width: 70px;
  height: 70px;
  box-shadow: 0px 4px 6px 0px rgba(226, 226, 226, 0.27);

  img {
    width: 100%;
  }
  .title {
    text-align: center;
    font-size: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
