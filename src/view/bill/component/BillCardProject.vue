<template>
  <ai-cell-swiper
    :options="swiperOptions"
    :enable="swiperEnable"
    @delete="onDelete"
    @action="onAction"
  >
    <bill-card :enableRight="false">
      <template slot="left-title">
        {{ project.title }}
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
