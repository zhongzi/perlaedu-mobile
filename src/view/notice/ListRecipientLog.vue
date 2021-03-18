<template>
  <div class="wrapper">
    <notice-recipient-logs />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import NoticeRecipientLogs from "./component/admin/NoticeRecipientLogs.vue";

@Component({
  components: {
    NoticeRecipientLogs,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped></style>
