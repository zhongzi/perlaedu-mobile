<template>
  <div class="wrapper">
    <ai-list-stored resource="oauthHistory" :query="query" scrollHeight="100vh">
      <template v-slot:item="{ item }">
        <div class="item">
          {{ item.updated_at }} 看了{{ item.agent_id }}的客户 {{ item.name }}
          {{ item.count }} 次
        </div>
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiListStored from "@/view/component/AiListStored.vue";

@Component({
  components: {
    AiListStored,
  },
})
export default class Home extends Vue {
  get openid() {
    return this.$route.query.openid;
  }

  get query() {
    return { openid: this.openid };
  }
}
</script>
<style lang="scss" scoped>
.item {
  width: 100%;
  padding: 10px;
}
</style>
