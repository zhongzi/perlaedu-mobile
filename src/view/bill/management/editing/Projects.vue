<template>
  <div class="wrapper">
    <div class="remark" v-if="isEdiable">
      <i class="iconfont icon-info" />
      <span> 左滑可进行编辑或者删除操作</span>
    </div>
    <div class="projects">
      <ai-list-stored resource="billProject" :query="query" scrollHeight="80vh">
        <template v-slot:item="{ item, tag }">
          <bill-card-project
            class="item"
            :key="item.id"
            :project="item"
            :outerTag="tag"
            :swiperEnable="isEdiable"
            @modify="onModify(item)"
            @click.native="onOpen(item)"
          />
        </template>
        <template v-slot:empty>
          <div style="text-align: center">暂无收费项目</div>
        </template>
      </ai-list-stored>
    </div>
    <ai-fixed-footer v-if="isEdiable">
      <ai-button-plus
        v-if="isEdiable"
        @click.native="newProjectDialogOpen"
        class="btn-new-project"
      />
    </ai-fixed-footer>
    <hui-dialog class="dlg-add-project" v-model="open" v-if="open">
      <div class="dlg-add-project__content">
        <h2 class="field">编辑收费项目</h2>
        <ai-selection-stored
          resource="billChannel"
          v-model="form.channel_id"
          mode="border"
          class="field"
        />
        <ai-input
          v-model="form.title"
          mode="border"
          placeholder="输入项目名称"
          class="field"
        />
        <div class="actions field">
          <hui-button class="cancel" type="error" @click.native="open = false"
            >取消
          </hui-button>
          <hui-button class="submit" @click.native="newProjectSubmit"
            >确认
          </hui-button>
        </div>
      </div>
    </hui-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import BillCardProject from "../../component/BillCardProject.vue";
import AiButtonPlus from "@/view/component/AiButtonPlus.vue";
import AiInput from "@/view/component/AiInput.vue";
import AiSelectionStored from "@/view/component/AiSelectionStored.vue";
import AiListStored from "@/view/component/AiListStored.vue";
import AiCellSwiper from "@/view/component/AiCellSwiper.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import { PersonRole } from "@/enum/person_role";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import cloneDeep from "lodash/cloneDeep";
import map from "lodash/map";
import filter from "lodash/filter";

@Component({
  components: {
    BillCardProject,
    AiButtonPlus,
    AiInput,
    AiSelectionStored,
    AiCellSwiper,
    AiListStored,
    AiFixedFooter,
  },
})
export default class Home extends Mixins(SyncMixin) {
  open: boolean = false;
  person: any = null;

  form: any = {
    channel_id: null,
    title: null,
  };

  get relatedMerchantId() {
    return _get(
      this.$route,
      "query._merchant_id_",
      this.$auth.user.curr_merch_id
    );
  }

  get isEdiable() {
    return (
      (_get(this.person, "role", 0) &
        (PersonRole.master.value | PersonRole.assistant.value)) >
      0
    );
  }

  get query() {
    return {
      extras: "channel,items",
    };
  }

  created() {
    this.loadPerson();
  }

  @Watch("relatedMerchantId")
  onRelatedMerchantIdChanged() {
    this.loadPerson();
  }

  loadPerson() {
    this.loadEntity({
      store: "person",
      id: "staff",
      merchant_id: this.relatedMerchantId,
      success: (resp) => {
        this.person = resp.data;
      },
    });
  }

  newProjectDialogOpen() {
    this.form = {
      channel_id: null,
      title: null,
    };
    this.open = true;
  }

  newProjectSubmit() {
    if (isEmpty(this.form.title)) {
      this.$hui.toast.info("收费项目名称不能为空");
      return;
    }

    this.saveEntity({
      store: "billProject",
      id: this.form.id,
      query: {
        extras: "channel",
      },
      res: this.form,
      success: (resp) => {
        this.open = false;
        this.$nextTick(() => {
          this.onModify(resp.data);
        });
      },
    });
  }

  onModify(project) {
    this.$router.push({
      name: "billEditingItems",
      params: {
        projectId: project.id,
      },
    });
  }

  onOpen(project) {
    if (project.items.length <= 0) {
      this.$hui.toast.info("该收费项目上尚没有任何收费套餐或者优惠券");
      return;
    }
    this.$router.push({
      name: "bill",
      params: {
        merchantId: project.merchant_id,
        projectId: project.id,
        openid: this.$auth.openid,
        items: "new",
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 20px;

  .remark {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 12px;
    line-height: 18px;
    color: #9b9b9b;
    padding-bottom: 10px;

    i {
      margin-right: 5px;
    }
  }

  .projects {
    .item {
      margin: 10px auto;
    }
  }

  .btn-new-project {
    border-style: dashed;
    margin-top: 10px;
  }
  .dlg-add-project {
    &__content {
      min-height: 50vh;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0px 20%;

      .field {
        text-align: center;
        width: 100%;
        margin: 5px 0px;
      }
    }
    .actions {
      display: flex;
      align-items: center;
      justify-content: center;

      .submit {
        width: 100px;
      }
    }
  }
}
</style>
