<template>
  <div class="wrapper">
    <notice-recipients />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import NoticeRecipients from "./component/admin/NoticeRecipients.vue";

@Component({
  components: {
    NoticeRecipients,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped></style>
