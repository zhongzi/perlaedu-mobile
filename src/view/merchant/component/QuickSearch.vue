<template>
  <div class="wrapper quick-search">
    <ai-search v-model="keyword" placeholder="搜索学生/班级" class="input">
      <template v-slot:left> <span /> </template>
      <template v-slot:right>
        <i class="iconfont icon-search" />
      </template>
    </ai-search>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiSearch from "@/view/component/AiSearch.vue";

@Component({
  components: {
    AiSearch,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;

  keyword: string = null;
}
</script>
<style lang="scss" scoped>
.quick-search {
  .input {
    background: #eaeaea;
    border-radius: 8px;
    i {
      color: #5a5a5a;
    }

    & ::v-deep .ai-search__input {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #9b9b9b;
      line-height: 20px;
    }

    & ::v-deep .ai-search__input::placeholder {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #9b9b9b;
      line-height: 20px;
    }
  }
}
</style>
