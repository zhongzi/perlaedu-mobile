<template>
  <div class="wrapper phone-verifying-list">
    <ai-search v-model="keyword" class="search" />
    <ai-list-stored
      resource="authorization"
      :query="query"
      :refresh.sync="refresh"
    >
      <template v-slot:item="{ item }">
        <authorization-cell
          :item="item"
          :key="item.id"
          class="item"
          @refresh="refresh = true"
        />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";
import AiSearch from "@/view/component/AiSearch.vue";

import AuthorizationCell from "./component/AuthorizationCell.vue";

import trim from "lodash/trim";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiListStored,
    AiSearch,
    AuthorizationCell,
  },
})
export default class Home extends Vue {
  keyword: string = "";
  refresh: boolean = false;

  get query() {
    const k = trim(this.keyword);
    let query = {
      sort: "updated_at desc",
      extras: JSON.stringify({
        Authorization: ["req_related_persons", "user"],
        OAuth: ["avatar"],
      }),
    };
    if (!isEmpty(k)) {
      query["filters"] = JSON.stringify({
        "openid.OAuth.nickname": [k],
        "openid.OAuth.phone": [k],
      });
    }
    return query;
  }
}
</script>
<style lang="scss" scoped>
.phone-verifying-list {
  padding: 15px;

  .item {
    margin: 10px 0px;
  }
}
</style>
