<template>
  <bill-button
    icon="money"
    label="充值记录"
    @click.native="$router.push({ name: 'billManagementDashboard' })"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import BillButton from "./BillButton.vue";

@Component({
  components: {
    BillButton,
  },
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped></style>
