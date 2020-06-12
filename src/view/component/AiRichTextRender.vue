<template>
  <div :class="b()">
    <div v-for="(s, i) in sections" :key="i">
      <div class="section-content">
        <img class="section-image" v-if="s.url" :src="s.url | alioss" />
        <div v-if="s.text" class="section-text">
          <pre
            v-bind:style="{
              'font-size': s.font_size,
              'font-weight': s.font_weight,
              color: s.font_color,
            }"
            >{{ s.text }}</pre
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";

@Component({
  name: "ai-rich-text-render",
})
export default class Home extends Vue {
  @Prop({ type: [String, Array], default: () => null }) value: any;

  get sections() {
    let sections = [];
    if (!isEmpty(this.value) && isString(this.value)) {
      try {
        sections = JSON.parse(this.value);
      } catch (e) {}
    } else if (isArray(this.value)) {
      sections = this.value;
    }
    return sections;
  }
}
</script>
<style lang="scss" scoped>
.ai-rich-text-render {
  margin-top: 10px;
  .section-content {
    .section-text {
      text-align: left;

      pre {
        margin: 1em auto;
      }
    }

    .section-image {
      width: 100%;
      vertical-align: bottom;
    }
  }
}
</style>
