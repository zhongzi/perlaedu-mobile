<template>
  <div class="wrapper">
    <ai-card v-if="innerTeacher.id" @click.native="onClick">
      <template v-slot:header>
        <div class="cover">
          <img
            :src="innerTeacher.avatar_url | alioss({ width: 120, height: 200 })"
          />
        </div>
      </template>
      <template v-slot:body>
        <div class="name">{{ innerTeacher.realname }} 老师</div>
      </template>
      <template v-slot:footer>
        <slot name="actions" />
      </template>
    </ai-card>
    <hui-dialog v-model="showDialog" :appendToBody="true">
      <div class="dialog">
        <img class="cover" :src="innerTeacher.avatar_url" />
        <div class="name">{{ innerTeacher.realname }} 老师</div>
        <div class="detail" v-if="innerTeacher.description">
          <ai-rich-text-render :value="innerTeacher.description" />
        </div>
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";
import AiRichTextRender from "@/view/component/AiRichTextRender.vue";

import _get from "lodash/get";

@Component({
  components: {
    AiCard,
    AiRichTextRender,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) websiteTeacher: any;
  @Prop({ type: Object, default: null }) teacher: any;
  @Prop({ type: Boolean, default: true }) enablePreview: boolean;

  showDialog: boolean = false;

  get innerTeacher() {
    return this.teacher || _get(this.websiteTeacher, "teacher", {});
  }

  onClick() {
    if (this.enablePreview) {
      this.showDialog = true;
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 104px;
  height: 160px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 5px;
  margin-bottom: 15px;

  .cover {
    width: 96px;
    height: 130px;
    padding: 5px;

    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 4px;
    }
  }
}
.dialog {
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .name {
    font-size: 18px;
    margin: 20px 0px;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
}

.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  text-align: center;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(74, 74, 74, 1);
  line-height: 18px;
}
</style>
