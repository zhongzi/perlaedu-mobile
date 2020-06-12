<template>
  <div :class="b()">
    <input
      ref="file"
      type="file"
      @change="onChange"
      :accept="accept"
      :class="b('hidden')"
    />
    <div :class="b('show')">
      <slot>
        <i :class="['iconfont', 'icon-' + icon]" />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  name: "ai-input-file",
})
export default class Home extends Vue {
  @Prop({ type: String, default: "video/*" }) accept: string;
  @Prop({ type: String, default: "upload" }) icon: string;

  onChange(e) {
    this.$emit("change", e);
    (this.$refs.file as any).value = null;
  }
}
</script>
<style lang="scss" scoped>
.ai-input-file {
  min-height: 60px;
  position: relative;
  background: #fff;
  border-radius: 10px;

  &__hidden {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    z-index: 199;
  }

  &__show {
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 40px;
      color: rgba(233, 233, 233, 1);
    }
  }
}
</style>
