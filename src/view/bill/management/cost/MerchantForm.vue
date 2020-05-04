<template>
  <div class="merchant-form">
    <h1 class="field">创建学校</h1>
    <ai-input v-model="form.name" placeholder="学校名称" class="field" />
    <ai-input v-model="form.phone" placeholder="校长手机号码" class="field" />
    <div class="actions field">
      <hui-button class="cancel" type="error" @click.native="$emit('cancel')"
        >取消
      </hui-button>
      <hui-button class="submit" @click.native="submit">确认 </hui-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiInput from "@/view/component/AiInput.vue";

import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiInput,
  },
})
export default class Home extends Mixins(SyncMixin) {
  form: any = {
    name: "",
    phone: "",
    remark: "来自收款服务",
  };

  submit() {
    if (isEmpty(this.form.name) || isEmpty(this.form.phone)) {
      this.$hui.toast.info("学校名称与校长手机号码不能为空");
      return;
    }
    this.store = "merchant";
    this.saveEntity({
      res: this.form,
      success: (resp) => {
        this.$nextTick(() => {
          this.$emit("success", resp.data);
        });
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.merchant-form {
  padding: 15px;
  text-align: center;

  .field {
    margin: 10px 0px;
  }
}
</style>
