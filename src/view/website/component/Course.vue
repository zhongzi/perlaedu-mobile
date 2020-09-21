<template>
  <div class="wrapper">
    <template v-if="course">
      <div class="course" @click="openCourse">
        <slot :courseIcon="courseIcon">
          <img :src="customeIcon" class="icon" v-if="isCustomedIcon" />
          <i :class="['iconfont', 'icon-' + courseIcon]" v-else />
        </slot>
        <span> {{ course.title }} </span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) course: any;
  @Prop({ type: String, default: "websiteMerchantCourse" }) routeName: string;

  get courseIcon() {
    return _get(this.course, "subject.icon", "course");
  }

  get isCustomedIcon() {
    return !isEmpty(this.customeIcon);
  }

  get customeIcon() {
    return this.course.subject_icon;
  }

  openCourse() {
    this.$router.push({
      name: this.routeName,
      params: {
        courseId: this.course.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  margin-bottom: 15px;
  color: rgba(74, 74, 74, 1);

  .course {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-height: 55px;

    i {
      font-size: 32px;
      font-weight: 600px;
      color: rgba(237, 139, 65, 1);
    }

    .icon {
      width: 36px;
      height: 36px;
      display: block;
    }
    span {
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
    }
  }
}
</style>
