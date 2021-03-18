<template>
  <div class="wrapper notice-target-cell">
    <ai-cell>
      <template v-slot:cover>
        <i class="iconfont icon-laoshi" />
      </template>
      <template v-slot:title>
        <span class="title"> {{ title }} </span>
      </template>
      <template v-slot:subtitle v-if="isMerchant || isGroup || isTag">
        <div class="roles">
          <ai-input-check
            v-if="isMerchant || isTag || isGroup"
            :value="isStudentIn"
            :disabled="!isEditing"
            @input="(v) => updateRole(v, PersonRole.student)"
          >
            学生
          </ai-input-check>
          <ai-input-check
            v-if="isMerchant || isTag || isGroup"
            :value="isTeacherIn"
            :disabled="!isEditing"
            @input="(v) => updateRole(v, PersonRole.teacher)"
          >
            老师
          </ai-input-check>
          <ai-input-check
            v-if="isMerchant"
            :value="isAssistantIn"
            :disabled="!isEditing"
            @input="(v) => updateRole(v, PersonRole.assistant)"
          >
            教务
          </ai-input-check>
          <ai-input-check
            v-if="isMerchant"
            :value="isMasterIn"
            :disabled="!isEditing"
            @input="(v) => updateRole(v, PersonRole.master)"
          >
            校长
          </ai-input-check>
        </div>
      </template>
      <template v-slot:subtitle v-else>
        <ai-input-switch
          class="trigger"
          label="是否发送"
          :disabled="!isEditing"
          :value="!target.is_blocked"
          @input="updateBlocked"
        />
      </template>
      <template v-slot:right>
        <slot name="right" />
      </template>
    </ai-cell>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import AiInputCheck from "@/view/component/AiInputCheck.vue";
import AiInputSwitch from "@/view/component/AiInputSwitch.vue";

import { PersonRole } from "@/enum/person_role";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCell,
    AiInputCheck,
    AiInputSwitch,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) target: any;
  @Prop({ type: Boolean, default: false }) isEditing: boolean;

  PersonRole = PersonRole;

  get isMerchant() {
    return _get(this.target, "target_class") === "Merchant";
  }

  get isTag() {
    return (
      _get(this.target, "target_id") === 0 &&
      !isEmpty(_get(this.target, "target_class"))
    );
  }

  get isGroup() {
    return _get(this.target, "target_class") === "Group";
  }

  get title() {
    if (this.isMerchant) return "全校";
    if (this.isTag) return this.target.target_class;
    if (this.isGroup) return this.target.target.name;
    return _get(this.target, "target.realname");
  }

  get role() {
    return _get(this.target, "role", 0);
  }

  get isStudent() {
    return this.role && this.role & PersonRole.student.value;
  }

  get isAssistantIn() {
    return (this.role & PersonRole.assistant.value) > 0;
  }

  get isMasterIn() {
    return (this.role & PersonRole.master.value) > 0;
  }

  get isTeacherIn() {
    return (this.role & PersonRole.teacher.value) > 0;
  }

  get isStudentIn() {
    return (this.role & PersonRole.student.value) > 0;
  }

  updateBlocked(v) {
    console.log(v);
    this.$emit("updateBlocked", !v);
  }
  updateRole(flag, personRole) {
    const role = flag
      ? this.role | personRole.value
      : this.role & ~personRole.value;
    this.$emit("updateRole", role);
  }
}
</script>
<style lang="scss" scoped>
.notice-target-cell {
  i {
    font-size: 24px;
    padding: 10px;
  }
  .roles {
    display: flex;
    align-items: center;
  }
  .trigger {
    align-items: center;

    padding: 0px;
    & ::v-deep .ai-input-switch__label {
      font-size: 12px;
    }
  }
}
</style>
