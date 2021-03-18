<template>
  <div class="wrapper targets">
    <notice-targets-picker
      v-if="isEditing"
      @selected="(v) => (newTargets = v)"
    />
    <template v-for="target in innerTargets">
      <notice-target-cell
        :key="target.target_id + target.target_class"
        :isEditing="isEditing"
        :target="target"
        @updateRole="(v) => updateRole(target, v)"
        @updateBlocked="(v) => (target.is_blocked = v)"
      >
        <template v-slot:right>
          <ai-button
            @click.native="remove(target)"
            type="primary"
            v-if="isEditing"
          >
            删除
          </ai-button>
          <ai-button @click.native="openNotices(target)" type="primary" v-else>
            通知圈
          </ai-button>
        </template>
      </notice-target-cell>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import AiButton from "@/view/component/AiButton.vue";

import NoticeTargetsPicker from "./NoticeTargetsPicker.vue";
import NoticeTargetCell from "./NoticeTargetCell.vue";

import find from "lodash/find";
import filter from "lodash/filter";
import concat from "lodash/concat";
import forEach from "lodash/forEach";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";

@Component({
  components: {
    AiButton,
    NoticeTargetCell,
    NoticeTargetsPicker,
  },
})
export default class Home extends Vue {
  @Prop({ type: Array, default: null }) value: any;
  @Prop({ type: Boolean, default: false }) isEditing: boolean;

  newTargets: any = null;
  innerTargets: any = null;

  created() {
    this.resetInnerTarget();
  }

  @Watch("newTargets")
  onNewTargetsChanged() {
    forEach(this.newTargets || [], (newTarget) => {
      if (
        !find(this.innerTargets, (innerTarget) => {
          return (
            newTarget.target_id === innerTarget.target_id &&
            newTarget.target_class === innerTarget.target_class
          );
        })
      ) {
        this.innerTargets = concat(newTarget, this.innerTargets || []);
      }
    });
    console.log(this.newTargets, this.innerTargets);
  }

  @Watch("innerTargets", { deep: true })
  onInnerTargetsChanged() {
    this.$emit("input", cloneDeep(this.innerTargets));
  }

  @Watch("value", { deep: true })
  onValueChanged() {
    if (isEqual(this.value, this.innerTargets)) return;

    this.resetInnerTarget();
  }

  resetInnerTarget() {
    this.innerTargets = cloneDeep(this.value || []);
  }

  openNotices(target) {
    const query: any = {};
    if (target.target_class === "Merchant") {
      query.merchant = target.target_id;
    } else if (target.target_class === "Group") {
      query.group = target.target_id;
    } else if (target.target_class === "Person") {
      query.person = target.target_id;
    } else if (target.target_class === "OAuth") {
      query.user = target.target_id;
    } else {
      query.tag = target.target_class;
    }
    this.$router.push({
      name: "notices",
      query: query,
    });
  }

  updateRole(target, v) {
    if (v === 0) {
      this.$hui.confirm.show({
        title: "通知对象为空提醒",
        message: `取消本类型，将自动移除本通知对象！请确认!`,
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: () => {
          this.remove(target);
        },
        onCancel: () => {},
      });
      return;
    }

    target.role = v;
  }

  remove(target) {
    this.innerTargets = filter(this.innerTargets, (innerTarget) => {
      return (
        target.target_id !== innerTarget.target_id ||
        target.target_class !== innerTarget.target_class
      );
    });
  }
}
</script>
<style lang="scss" scoped>
.targets {
  padding: 10px 10px 0px 0px;
  background: #fff;

  .search {
    margin: 0px 5vw;
  }

  .section {
    margin: 10px;
  }
}
</style>
