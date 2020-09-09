<template>
  <div class="wrapper clue" @click="open">
    <ai-card>
      <template v-slot:header v-if="!isInDetail">
        <ai-cell
          class="header"
          :title="clue | safe('user.nickname', clue.name || clue.phone)"
        >
          <template v-slot:cover>
            <div class="left">
              <div class="number">
                <span> {{ clue.id }}</span>
                号
              </div>
              <img
                v-if="clue.user"
                class="cover"
                :src="clue | safe('user.avatar') | alioss({ width: 120 })"
              />
            </div>
          </template>
          <template v-slot:subtitle>
            {{ clue.created_at | defaultDate }}
          </template>
          <template v-slot:right v-if="status">
            <ai-badge :content="status.text" :color="status.color" />
          </template>
        </ai-cell>
      </template>
      <template v-slot:body v-if="isInDetail">
        <div class="body">
          <div class="section channel">
            <div class="field">
              <span class="label">来源渠道: </span>
              <span class="value">{{ clue | safe("channel.title") }} </span>
            </div>
            <div class="field">
              <span class="label">来源信息: </span>
              <span class="value"
                >({{ clue.source_class }} / {{ clue.source_id }})
                {{ clue | safe("source.title", "") }}
                {{ clue | safe("source.name", "") }}
              </span>
            </div>
          </div>
          <div class="section detail">
            <div class="field">
              <span class="label">客户名称: </span>
              <span class="value">{{ clue.name }}</span>
            </div>
            <div class="field">
              <span class="label">客户手机: </span>
              <span class="value">{{ clue.phone }}</span>
            </div>
            <div class="field">
              <span class="label">客户留言: </span>
              <span class="value">{{ clue.remark }}</span>
            </div>
            <div class="field">
              <span class="label">客户领取时间: </span>
              <span class="value">{{ clue.created_at | defaultDate }}</span>
            </div>
            <div class="field">
              <span class="label">客户微信: </span>
              <span class="value">{{ clue | safe("user.nickname") }}</span>
            </div>
            <div class="field">
              <span class="label">客户微信绑定手机号码: </span>
              <span class="value">{{ clue | safe("user.phone") }}</span>
            </div>
          </div>
          <div class="section user">
            <div class="field">
              <span class="label">客户是否已存在系统: </span>
              <span class="value">{{ clue.u_person ? "是" : "否" }}</span>
            </div>
            <div class="field">
              <span class="label">客户存在系统名称: </span>
              <span class="value">{{ clue | safe("u_person.realname") }}</span>
            </div>
            <div class="field">
              <span class="label">客户存在系统手机号码: </span>
              <span class="value">{{ clue | safe("u_person.phone") }}</span>
            </div>
          </div>
          <div class="section referrer" v-if="clue.referrer">
            <div class="field">
              <span class="label">推荐人: </span>
              <span class="value">{{ clue | safe("referrer.nickname") }} </span>
            </div>
            <div class="field">
              <span class="label">推荐人手机: </span>
              <span class="value">{{ clue | safe("referrer.phone") }} </span>
            </div>
            <div class="field">
              <span class="label">推荐人是否已存在系统: </span>
              <span class="value">{{ clue.r_person ? "是" : "否" }}</span>
            </div>
            <div class="field">
              <span class="label">推荐人存在系统名称: </span>
              <span class="value">{{ clue | safe("r_person.realname") }}</span>
            </div>
          </div>
          <div class="section follower" v-if="clue.follower">
            <div class="field">
              <span class="label">跟进人: </span>
              <span class="value">
                {{ clue | safe("follower.nickname") }}
                <template v-if="clue.f_person">
                  ( {{ clue | safe("f_person.realname") }} )
                </template>
              </span>
            </div>
            <div class="field">
              <span class="label">跟进人手机号码: </span>
              <span class="value">{{ clue | safe("follower.phone") }} </span>
            </div>
            <div class="field">
              <span class="label">分配跟进时间: </span>
              <span class="value">{{ clue.followed_at | defaultDate }} </span>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer v-if="isInDetail">
        <div class="footer">
          <ai-badge
            :content="status.text"
            :color="status.color"
            v-if="status"
          />
          <div class="update">
            <span class="label">最近更新: </span>
            <span class="value">
              {{ clue.updated_at | date("MM-dd HH:mm") }}
            </span>
          </div>
        </div>
      </template>
    </ai-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";
import AiBadge from "@/view/component/AiBadge.vue";
import AiCell from "@/view/component/AiCell.vue";

import { CrmClueStatus } from "@/enum/crm_clue_status";

@Component({
  components: {
    AiCard,
    AiCell,
    AiBadge,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) clue: any;
  @Prop({ type: String, default: "" }) outerTag: string;
  @Prop({ type: Boolean, default: false }) isInDetail: boolean;

  get status() {
    return CrmClueStatus[this.clue.status];
  }

  open() {
    this.$router.push({
      name: "crmClueDetail",
      params: {
        clueId: this.clue.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.clue {
  width: 100%;

  .header {
    width: 100%;
    padding: 10px;

    .left {
      display: flex;
      align-items: center;

      .number {
        margin-right: 10px;
        min-width: 50px;
        span {
          font-size: 24px;
          font-weight: 600;
        }
      }

      .cover {
        width: 40px;
        border-radius: 50%;
      }
    }
  }
  .body {
    padding: 10px;

    .section {
      margin: 15px 0px;
      .field {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 0px 10px;

        font-size: 14px;
        color: #4a4a4a;
      }
    }
  }
  .footer {
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
