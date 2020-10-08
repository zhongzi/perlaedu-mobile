<template>
  <div class="wrapper jobs">
    <ai-list-stored
      class="list"
      resource="crmJob"
      scrollHeight="80vh"
      :limit="100"
      :query="query"
    >
      <template v-slot:item="{ item }">
        <div class="item">
          NO-{{ item.id }} {{ item.title }} ({{ item.duration }}天)
        </div>
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import AiListStored from "@/view/component/AiListStored.vue";

@Component({
  components: {
    AiCell,
    AiListStored,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) customer: any;

  get query() {
    return {
      sort: "id asc",
    };
  }
}
</script>
<style lang="scss" scoped>
.jobs {
  padding: 20px 10px;

  .list {
    & ::v-deep .ai-infinite-scroll__list {
      display: block;
    }

    .item {
      padding: 10px;
      border-radius: 8px;
    }
  }
}
</style>
