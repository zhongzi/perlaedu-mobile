<template>
  <div class="wrapper crm">
    <div class="menu" @click="$router.push({ name: 'crmZoneList' })">
      机构地图
    </div>

    <div class="menu" @click="$router.push({ name: 'crmCustomerList' })">
      线索跟进
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.crm {
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .menu {
    width: 100%;
    height: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 48px;
    font-weight: 600;
  }

  .menu:nth-child(1) {
    text-shadow: 1px 1px 1px #000, 3px 3px 5px #ff6b00;
    background: #000;
    color: #fff;
  }

  .menu:nth-child(2) {
    text-shadow: 1px 1px 1px #000, 3px 3px 5px #ff6b00;
    background: #019858;
    color: #fff;
  }
}
</style>
