<template>
  <div class="wrapper teacher">
    <div class="header">
      <div class="cover">
        <img :src="teacher.cover_url | alioss({ width: 300 })" />
        <div class="setting" v-if="isOwner" @click="openEditing">
          <i class="iconfont icon-setting" />
        </div>
      </div>
      <div class="title">{{ teacher.realname }} 老师</div>
    </div>
    <div class="content">
      <merchant-cell :merchant="teacher.merchant" class="merchant" />
      <ai-section class="escription">
        <ai-rich-text-sections-editor
          :isJson="true"
          :is-editing="false"
          :value="teacher.sections"
        />
      </ai-section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiSection from "@/view/component/AiSection.vue";
import AiRichTextSectionsEditor from "@/view/component/AiRichTextSectionsEditor.vue";

import MerchantCell from "../component/MerchantCell.vue";

import _get from "lodash/get";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    AiSection,
    MerchantCell,
    AiRichTextSectionsEditor,
  },
})
export default class Home extends Mixins(SyncMixin) {
  get merchant() {
    return this.teacher.merchant || {};
  }

  get teacher() {
    return this.entity;
  }

  get isOwner() {
    return (
      this.merchant.id &&
      _get(this.$auth, "user.is_manager") &&
      isEqual(this.merchant.id, _get(this.$auth, "user.curr_merch_id"))
    );
  }

  created() {
    this.store = "person";
    this.id = this.$route.params.teacherId;
    this.loadEntity({
      query: {
        extras: JSON.stringify({
          Person: ["merchant", "sections"],
          Merchant: ["count_persons"],
        }),
      },
    });
  }

  @Watch("teacher", { deep: true })
  onCouseChanged() {
    this.$store.commit("updateTitle", `${this.teacher.realname} - 师资简介`);
  }

  openEditing() {
    this.$router.push({
      name: "websiteEditingTeacher",
      params: {
        teacherId: this.teacher.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.teacher {
  background: rgba(247, 247, 247, 1);

  .header {
    position: relative;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 24px;
      font-weight: 600;
      padding: 20px;
    }
  }

  .cover {
    flex: 1;
    min-width: 150px;

    img {
      border-radius: 10px;
      width: 100%;
    }

    .setting {
      position: absolute;
      top: 15px;
      right: 10px;

      padding: 5px 7px;
      background: #ff940f;
      border-radius: 10px;

      i {
        font-size: 28px;
        color: rgba(255, 255, 255, 0.91);
      }
    }
  }

  .content {
    position: relative;
    top: -10px;
    background: rgba(247, 247, 247, 1);
    border-radius: 10px;

    min-height: 50vh;
    padding: 5px 20px;

    .title {
      text-align: center;
      margin: 20px auto 30px;
    }

    .description {
      padding: 10px;
      border-radius: 10px;
    }
  }
}
</style>
