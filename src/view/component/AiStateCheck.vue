<template>
  <div
    :class="[b({ checked: innerChecked }), b({ disabled: disabled })]"
    @click.stop="trigger"
  >
    <slot />
    <i class="iconfont icon-checked" :class="b('icon')" v-if="innerChecked" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "ai-state-check",
})
export default class Home extends Vue {
  @Prop({ type: Boolean, default: false }) checked: boolean;
  @Prop({ type: Boolean, default: true }) enableCheck: boolean;
  @Prop({ type: Boolean, default: false }) disabled: boolean;

  innerChecked: boolean = false;

  created() {
    this.innerChecked = this.checked;
  }

  @Watch("checked")
  onChecked() {
    this.innerChecked = this.checked;
  }

  trigger() {
    if (this.enableCheck) {
      this.innerChecked = !this.innerChecked;
      this.$emit("update:checked", this.innerChecked);
    }
  }
}
</script>
<style lang="scss" scoped>
.ai-state-check {
  position: relative;
  box-sizing: border-box;

  border: 4px solid rgba(255, 255, 255, 0);

  &__icon {
    position: absolute;
    right: -1px;
    bottom: -1px;

    color: #fff;
    background: rgba(255, 103, 6, 1);
    padding: 5px 5px 5px 10px;
    border-radius: 20px 0px 0px 0px;
  }

  &--checked {
    border-radius: 8px;
    border: 4px solid rgba(255, 103, 6, 1);
  }
  &--disabled {
    -webkit-filter: grayscale(100%); /* webkit */
    -moz-filter: grayscale(100%); /*firefox*/
    -ms-filter: grayscale(100%); /*ie9*/
    -o-filter: grayscale(100%); /*opera*/
    filter: grayscale(100%);
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
    filter: gray; /*ie9- */
  }
}
</style>
