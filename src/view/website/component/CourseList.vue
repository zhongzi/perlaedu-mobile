<template>
  <div class="wrapper course">
    <ai-list-stored
      resource="course"
      :query="innerQuery"
      scrollType="none"
      :limit="100"
      :hideIfNoData="true"
    >
      <template v-slot:header>
        <img
          v-if="skin.title"
          :src="skin.title.image"
          :style="skin.title.style"
        />
        <div v-else>{{ title || "热门课程" }}</div>
      </template>
      <template v-slot:item="{ item }">
        <course
          :course="item"
          :key="item.id"
          class="item"
          :style="skin.content"
        />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import Course from "./Course.vue";

import merge from "lodash/merge";
import _get from "lodash/get";

@Component({
  components: {
    AiListStored,
    Course,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Object, default: null }) merchant: any;
  @Prop({ type: String, default: null }) title: string;

  get skin() {
    return _get(this.merchant, "website.skin.course", {});
  }

  get innerQuery() {
    return merge(
      {
        extras: "subject",
      },
      this.query || {}
    );
  }
}
</script>
<style lang="scss" scoped>
.course {
  padding: 0px 20px;

  & ::v-deep .ai-list-stored__list {
    display: flex;
    flex-wrap: wrap;
  }
  .item {
    width: 20%;
    margin: 10px 0px;
  }
}
</style>
