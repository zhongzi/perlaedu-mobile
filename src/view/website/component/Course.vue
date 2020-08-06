<template>
  <div class="wrapper">
    <template v-if="course">
      <div class="course" @click="openCourse">
        <slot :courseIcon="courseIcon">
          <i :class="['iconfont', 'icon-' + courseIcon]" />
        </slot>
        <span> {{ course.title }} </span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import _get from "lodash/get";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) course: any;
  @Prop({ type: String, default: "websiteMerchantCourse" }) routeName: string;

  get courseIcon() {
    return _get(this.course, "subject.icon", "course");
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
    justify-content: center;

    i {
      font-size: 32px;
      color: rgba(237, 139, 65, 1);
    }
    span {
      text-align: center;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
    }
  }
}
</style>
