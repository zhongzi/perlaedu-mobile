<template>
  <div :class="[{ 'person-avatar-active': active }, 'person-avatar']">
    <div class="avatar">
      <img :src="avatar" v-if="avatar" />
      <div :class="icon + ' ico'" v-if="icon"></div>
    </div>

    <div class="name">{{ realname }}</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import _get from "lodash/get";

@Component
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) person: any;
  @Prop({ type: String, default: null }) icon: string;
  @Prop({ type: Boolean, default: false }) active: boolean;

  get realname() {
    return _get(this.person, "realname") || _get(this.person, "nickname");
  }

  get avatar() {
    return _get(this.person, "avatar_url") || _get(this.person, "avatar");
  }
}
</script>
<style lang="scss" scoped>
.person-avatar {
  position: relative;
  box-sizing: border-box;
  width: 10rem;
  height: 3.6rem;
  padding: 0.1rem 0.1rem 0.1rem 4.5rem;
  border-radius: 1rem;
  background-color: #f2f2f2;

  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 1rem;
    overflow: hidden;
    background-color: #f58723;

    img {
      width: 100%;
      display: inline;
    }

    .ico {
      position: absolute;
      right: -0.1rem;
      bottom: 0;
      width: 1.6rem;
      height: 1.6rem;

      &.bind {
        border-radius: 0.4rem;
        background: url(../assets/images/icon_bind.png) 50% 50% no-repeat;
        background-color: #ffffff;
        background-size: 1.1rem 0.9rem;
      }

      &.que {
        background: url(../assets/images/icon_que_1.png) 50% 50% no-repeat;
        background-size: 100% 100%;
      }

      &.bing {
        background: url(../assets/images/icon_bing_1.png) 50% 50% no-repeat;
        background-size: 100% 100%;
      }

      &.jia {
        background: url(../assets/images/icon_jia_1.png) 50% 50% no-repeat;
        background-size: 100% 100%;
      }

      &.chi {
        background: url(../assets/images/icon_chi_1.png) 50% 50% no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .name {
    color: #4a4a4a;
    font-size: 1.2rem;
    line-height: 3.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.person-avatar-active {
  background-color: #fa8e45;
  .name {
    color: #ffffff;
    font-size: 1.2rem;
    line-height: 3.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
