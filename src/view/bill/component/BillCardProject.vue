<template>
  <ai-cell-swiper
    :options="swiperOptions"
    :enable="swiperEnable"
    @delete="onDelete"
    @action="onAction"
  >
    <bill-card :enableRight="false">
      <template slot="left-title">
        <div class="header">
          <span>{{ project.title }}</span>
          <i
            v-if="project.is_enabled_balance"
            class="iconfont icon-recharge balance"
          />
        </div>
      </template>
      <template slot="left-remark">
        {{ project.channel.title }}
      </template>
    </bill-card>
  </ai-cell-swiper>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import BillCard from "./BillCard.vue";
import AiCellSwiper from "@/view/component/AiCellSwiper.vue";

@Component({
  components: {
    BillCard,
    AiCellSwiper,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object }) project: any;
  @Prop({ type: String, default: "" }) outerTag: string;
  @Prop({ type: Boolean, default: true }) swiperEnable: boolean;
  @Prop({ type: Object, default: () => ({}) }) swiperOptions: any;

  onDelete() {
    this.store = "billProject";
    this.id = this.project.id;
    this.tag = this.outerTag;
    this.deleteEntity({
      res: { id: this.id },
    });
  }

  onAction(event) {
    this.$emit(event, this.project, this.outerTag);
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;

  .balance {
    font-size: 24px;
    color: #ff8306;
    margin-left: 10px;
  }
}
</style>
