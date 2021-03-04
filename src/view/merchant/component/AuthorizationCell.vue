<template>
  <div class="wrapper bind-cell">
    <ai-cell :cover="cover" :title="title" :subtitle="subtitle">
      <template v-slot:cover>
        <img :src="cover" class="cover" />
      </template>
      <template v-slot:remark>
        <template v-if="isRelated">
          <ai-badge
            v-for="(person, index) in persons"
            :key="index"
            :content="person.realname"
            class="badge"
            color="#9b9b9b"
          />
        </template>
      </template>
      <template v-slot:right>
        <div class="right">
          <div class="phone">{{ phone }}</div>
          <div class="action">
            <ai-button-round
              :class="{ 'relate-first': !isRelated }"
              @click.native="open = true"
              class="btn"
              >{{ isRelated ? "关联更多" : "手动关联" }}</ai-button-round
            >
          </div>
        </div>
      </template>
    </ai-cell>
    <picker-person
      :open.sync="open"
      :query="query"
      :isMultiple="false"
      @selected="selectedRelatedPerson"
    />
    <ai-dialog v-model="showRelatedPerson" :hideOnBlur="false">
      <div class="dialog">
        <ai-title title="关联确认" class="title">
          <div class="subtitle">
            <span> 确定建立 {{ item | safe("user.nickname") }} </span>
            <i class="iconfont icon-link" />
            <span> {{ relatedPerson.realname }} 的关联吗?</span>
          </div>
        </ai-title>
        <div>
          <ai-input-radio
            class="position"
            value="first"
            :checked="position === 'first'"
            @change="(v) => (position = v)"
            title="通过第一电话关联"
          >
            <template v-slot:subtitle>
              <div class="infos">
                <p v-for="(info, index) in makeInfos('一')" :key="index">
                  {{ info }}
                </p>
              </div>
            </template>
          </ai-input-radio>
          <ai-input-radio
            class="position"
            value="second"
            :checked="position === 'second'"
            @change="(v) => (position = v)"
            title="通过第二电话关联"
          >
            <template v-slot:subtitle>
              <div class="infos">
                <p v-for="(info, index) in makeInfos('二')" :key="index">
                  {{ info }}
                </p>
              </div>
            </template>
          </ai-input-radio>
        </div>
        <ai-title title="注意:" class="title">
          <div class="subtitle">
            {{ relatedPerson.realname }} 的第
            {{ position === "first" ? "一" : "二" }} 电话将被设置为
            {{ item | safe("user.phone") }};
            {{ item | safe("user.nickname") }} 将能查看和接收有关
            {{ relatedPerson.realname }} 的消息
          </div>
        </ai-title>
        <ai-submit-actions
          submitLabel="确定"
          @cancel="showRelatedPerson = false"
          @submit="bindWechat(position)"
        />
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiBadge from "@/view/component/AiBadge.vue";
import AiCell from "@/view/component/AiCell.vue";
import AiDialog from "@/view/component/AiDialog.vue";
import AiButtonRound from "@/view/component/AiButtonRound.vue";
import AiButtonRoundSmall from "@/view/component/AiButtonRoundSmall.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiInputRadio from "@/view/component/AiInputRadio.vue";
import AiTitle from "@/view/component/AiTitle.vue";

import PickerPerson from "@/view/layout/component/PickerPerson.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";

@Component({
  components: {
    AiBadge,
    AiCell,
    AiDialog,
    AiButtonRound,
    AiButtonRoundSmall,
    AiSubmitActions,
    AiInputRadio,
    AiTitle,
    PickerPerson,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) item: any;

  open: boolean = false;
  bindedPerson: any = [];

  position = "first";
  showRelatedPerson: boolean = false;
  relatedPerson: any = {};

  get isRelated() {
    return this.persons && this.persons.length > 0;
  }

  get query() {
    return {
      role: "!=2",
      extras: "user,user_second",
    };
  }

  get cover() {
    return _get(this.item, "user.avatar");
  }

  get title() {
    return _get(this.item, "user.nickname");
  }

  get subtitle() {
    return this.$options.filters.defaultDate(_get(this.item, "updated_at"));
  }

  get phone() {
    return _get(this.item, "user.phone", "");
  }

  get persons() {
    return _get(this.item, "req_related_persons", this.bindedPerson);
  }

  selectedRelatedPerson(person) {
    this.relatedPerson = person;
    this.showRelatedPerson = true;
  }

  makeInfos(seg) {
    let realname = this.relatedPerson.realname;
    let phone = this.relatedPerson.phone;
    let nickname = _get(this.relatedPerson, "user.nickname");

    if (seg === "二") {
      phone = this.relatedPerson.phone_second;
      nickname = _get(this.relatedPerson, "user_second.nickname");
    }

    phone = isEmpty(phone) ? "空" : phone;
    const phoneInfo = `${realname}的第${seg}电话是 ${phone}`;
    const nicknameInfo = isEmpty(nickname)
      ? "没有已关联的微信"
      : `已经关联的微信是 ${nickname}`;
    return [phoneInfo, nicknameInfo];
  }

  bindWechat(position) {
    if (!this.relatedPerson) return;

    const res = { id: this.relatedPerson.id };
    if (position === "first") {
      res["phone"] = this.item.user.phone;
      res["openid"] = this.item.openid;
    } else if (position === "second") {
      res["phone_second"] = this.item.user.phone;
      res["openid_second"] = this.item.openid;
    }

    this.id = this.relatedPerson.id;
    this.saveEntity({
      store: "person",
      res: res,
      success: () => {
        this.open = false;
        this.showRelatedPerson = false;

        this.bindedPerson = concat(this.bindedPerson || [], this.relatedPerson);
        this.$emit("refresh");
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.bind-cell {
  width: 100%;
  background: #fff;
  padding: 10px;
  border-radius: 8px;

  .badge {
    margin: 0px 3px;
  }

  .cover {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .phone {
      font-size: 13px;
      color: #9b9b9b;
    }

    .action {
      .relate-first {
        background: #fa8e45;
        border: none;
        color: #fff;
      }

      .name {
        font-size: 12px;
        margin: 3px;
      }
      .btn {
        min-height: 30px;
      }
    }
  }
}
.dialog {
  padding: 10px 0px;

  .title {
    margin: 25px;

    .subtitle {
      display: flex;
      align-items: center;
      font-size: 13px;

      i {
        margin: 5px 10px;
      }
    }
  }

  .position {
    margin: 10px 30px;

    .infos {
      font-size: 13px;
      color: #9b9b9b;
    }
  }
}
</style>
