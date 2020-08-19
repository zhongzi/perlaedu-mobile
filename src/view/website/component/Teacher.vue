<template>
  <ai-card v-if="innerTeacher.id" @click.native="onClick" class="wrapper">
    <template v-slot:header>
      <div class="cover">
        <img
          :src="
            (innerTeacher.cover_url || innerTeacher.avatar_url)
              | alioss({ width: 120, height: 160 })
          "
        />
      </div>
    </template>
    <template v-slot:footer>
      <div class="name">{{ innerTeacher.realname }} 老师</div>
    </template>
  </ai-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";
import AiRichTextSectionsEditor from "@/view/component/AiRichTextSectionsEditor.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiCard,
    AiRichTextSectionsEditor,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) websiteTeacher: any;
  @Prop({ type: Object, default: null }) teacher: any;
  @Prop({ type: String, default: "websiteMerchantTeacher" }) routeName: string;

  get innerTeacher() {
    return this.teacher || _get(this.websiteTeacher, "teacher") || {};
  }

  onClick() {
    if (isEmpty(this.routeName)) {
      this.$emit("click");
      return;
    }
    this.$router.push({
      name: this.routeName,
      params: {
        teacherId: this.innerTeacher.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 104px;
  height: 170px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  margin-bottom: 15px;

  .cover {
    width: 104px;
    height: 138px;
    padding: 4px;
    border-radius: 4px;
    overflow: hidden;

    img {
      object-fit: fill;
      display: block;
      border-radius: 4px;
    }
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    margin: 0px 10px 10px;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: rgba(74, 74, 74, 1);
    line-height: 2;
  }
}
</style>
