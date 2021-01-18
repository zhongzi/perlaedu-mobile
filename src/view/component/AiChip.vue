<template>
  <div :class="b()">
    <img v-if="logo" class="logo" :src="logo | alioss(aliossOptions)" />
    <span> {{ title }} </span>
    <i
      v-if="enabledIcon"
      class="iconfont icon-close-circle"
      @click="$emit('click:icon')"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-chip",
})
export default class Home extends Vue {
  @Prop({ type: String, default: null }) logo: string;
  @Prop({ type: String, default: "" }) title: string;
  @Prop({ type: Boolean, default: false }) enabledIcon: boolean;
  @Prop({
    type: Object,
    default: () => {
      return {
        width: 40,
      };
    },
  })
  aliossOptions: any;
}
</script>
<style lang="scss" scoped>
.ai-chip {
  display: inline-block;
  background: #fff;
  border-radius: 10px;
  padding: 0px 5px;

  .logo {
    display: line-block;
    width: 28px;
    border-radius: 50%;
  }
  span {
    margin-right: 20px;
    font-size: 12px;
  }
  i {
    font-size: 16px;
  }
}
</style>
