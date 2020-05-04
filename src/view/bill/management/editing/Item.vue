<template>
  <div :class="b()">
    <h3 class="field">
      {{ innerItem.id ? "编辑" : "创建" }}
      {{ innerItem.is_welfare ? "福利" : "套餐" }}
    </h3>
    <ai-input v-model="innerItem.title" placeholder="标题" class="field" />
    <ai-input
      v-model.number="innerItem.price"
      :placeholder="innerItem.is_welfare ? '优惠金额' : '金额'"
      class="field"
    />
    <ai-input-date
      v-model="innerItem.start_at"
      label="上架日期"
      class="field"
    />
    <ai-input-date v-model="innerItem.end_at" label="下架日期" class="field" />
    <ai-input
      v-if="innerItem.is_welfare"
      v-model.number="innerItem.duration"
      placeholder="福利领取后有效期(秒),86400秒/天"
      class="field"
    />
    <ai-input
      v-if="innerItem.is_welfare"
      v-model.number="innerItem.min_balance"
      placeholder="福利可用的最低订单总额"
      class="field"
    />
    <ai-input
      v-model="innerItem.description"
      placeholder="说明"
      class="field"
    />
    <ai-input-check
      v-model="innerItem.is_overlay"
      class="field"
      v-if="innerItem.is_welfare"
    >
      是否可叠加使用
    </ai-input-check>
    <div class="actions field">
      <hui-button class="cancel" type="error" @click.native="$router.go(-1)"
        >取消
      </hui-button>
      <hui-button class="submit" @click.native="submit">确认 </hui-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";

import AiInput from "@/view/component/AiInput.vue";
import AiInputCheck from "@/view/component/AiInputCheck.vue";
import AiInputDate from "@/view/component/AiInputDate.vue";

@Component({
  name: "bill-item-form",
  components: {
    AiInput,
    AiInputCheck,
    AiInputDate,
  },
})
export default class Home extends Mixins(SyncMixin) {
  innerItem: any = {
    title: "",
    is_welfare: false,
    is_overlay: true,
    price: null,
    start_at: new Date(),
    end_at: new Date(),
    description: "",
    duration: "",
    min_balance: "",
  };

  get item() {
    return this.entity;
  }

  created() {
    this.store = "billItem";

    this.id = this.$route.params.itemId;
    if (this.id !== "new") {
      this.loadEntity();
    } else {
      this.innerItem.is_welfare = this.$route.query.type === "welfare";
    }
    this.resetInnerItem();
  }

  @Watch("item", { deep: true })
  onItemChanged() {
    this.resetInnerItem();
  }

  resetInnerItem() {
    if (isEqual(this.item, this.innerItem)) return;

    this.innerItem = Object.assign({}, this.innerItem, this.item, {
      start_at: this.item.start_at
        ? this.$options.filters.parseDate(this.item.start_at)
        : new Date(),
      end_at: this.item.end_at
        ? this.$options.filters.parseDate(this.item.end_at)
        : new Date(),
    });
  }

  submit() {
    this.innerItem.project_id = this.$route.params.projectId;
    this.id = this.innerItem.id;

    this.saveEntity({
      res: this.innerItem,
      success: () => {
        this.$hui.toast.info("保存成功");
        this.$router.go(-1);
      },
      failure: (err) => {
        this.$hui.toast.info(err.response.data.message);
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.bill-item-form {
  padding: 0px 20px;

  h3 {
    text-align: center;
    padding: 40px 0px 20px;
  }

  .field {
    margin: 5px 0px;

    & ::v-deep .ai-input-check__vec-fake {
      background: #000;
    }
  }
  .actions {
    display: flex;
    align-items: center;
    justify-content: space-around;

    width: 100%;
    margin: 30px 0px;

    .cancel {
      width: 30%;
    }

    .submit {
      width: 50%;
    }
  }
}
</style>
