<template>
  <div class="wrapper switch-merchant">
    <ai-selection-stored
      resource="merchant"
      labelKey="name"
      :value="$auth.user.curr_merch_id"
      :query="query"
      @input="updateCurrMerchId"
    >
      <template v-slot:left>
        <i class="iconfont icon-switch" />
      </template>
    </ai-selection-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiSelectionStored from "@/view/component/AiSelectionStored.vue";

@Component({
  components: {
    AiSelectionStored,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get query() {
    return {
      require_manager: true,
    };
  }

  created() {
    this.store = "oauth";
  }

  updateCurrMerchId(merchantId) {
    this.id = this.$auth.user.id;

    this.saveEntity({
      res: {
        id: this.id,
        curr_merch_id: merchantId,
      },
      success: () => {
        this.$nextTick(() => {
          this.$emit("changed", merchantId);
          this.$auth.fetchLoggedUser();
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.switch-merchant {
  width: 100%;
  height: 100%;

  & ::v-deep .ai-select__input {
    height: 40px;
    background: rgba(229, 103, 24, 1);
    border-radius: 10px;

    i {
      margin: 0px 10px;
      color: #fff;
    }
  }

  & ::v-deep .ai-select__select {
    background: rgba(229, 103, 24, 1);

    color: #fff;
  }
}
</style>
