<template>
  <div :class="[b(), { [b('border-bottom')]: showBottomLine }]">
    <div :class="b('left')" @click="$emit('click:left')">
      <slot name="left">
        <slot name="cover">
          <div :class="b('left-cover')" v-if="cover">
            <img :src="cover" />
          </div>
        </slot>
        <div :class="b('left-info')">
          <slot name="info">
            <div :class="b('left-info-header')">
              <slot name="header">
                <div :class="b('left-info-header-title')">
                  <slot name="title">
                    {{ title }}
                  </slot>
                </div>
                <div :class="b('left-info-header-subtitle')">
                  <slot name="subtitle">
                    {{ subtitle }}
                  </slot>
                </div>
              </slot>
            </div>
            <div :class="b('left-info-remark')">
              <slot name="remark">
                <slot name="footer">
                  {{ remark }}
                </slot>
              </slot>
            </div>
          </slot>
        </div>
      </slot>
    </div>
    <div :class="b('right')" @click="$emit('click:right')">
      <slot name="right" />
      <i class="iconfont icon-direction" v-if="showIcon" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-cell",
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) cover: string;
  @Prop({ type: String, default: null }) title: string;
  @Prop({ type: String, default: null }) subtitle: string;
  @Prop({ type: String, default: null }) remark: string;
  @Prop({ type: Boolean, default: false }) showIcon: boolean;
  @Prop({ type: Boolean, default: false }) showBottomLine: boolean;
}
</script>
<style lang="scss" scoped>
.ai-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 50px;

  &__left {
    display: flex;
    align-items: center;
    height: 100%;

    &-cover {
      max-width: 40%;
      margin-right: 10px;

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 8px;
      }
    }

    &-info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;

      &-header {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;

        &-title {
          font-size: 16px;
          font-weight: 500;
          color: rgba(74, 74, 74, 1);
          line-height: 20px;
        }

        &-subtitle {
          font-size: 13px;
          font-weight: 400;
          color: rgba(155, 155, 155, 1);
          line-height: 18px;
        }
      }
      &-remark {
        font-size: 13px;
        font-weight: 400;
        color: rgba(155, 155, 155, 1);
        line-height: 18px;
      }
    }
  }
  &__border-bottom {
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }

  &__right {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d4d4d4;
  }
}
</style>
