<template>
  <div class="wrapper customer" @click="open">
    <ai-card>
      <template v-slot:header v-if="!isInDetail">
        <ai-cell class="header">
          <template v-slot:cover>
            <div class="left">
              <div class="number">
                <crm-job-count-down :customer="customer" />
              </div>
              <ai-avatar
                :avatar="
                  customer
                    | safe('user.avatar', require('@/asset/logo.bg.png'))
                    | alioss({ width: 120 })
                "
                :name="
                  customer
                    | safe('user.nickname', customer.name || customer.phone)
                "
              >
                <template v-slot:remark>
                  {{ "NO-" + customer.id }}
                  {{ customer.created_at | defaultDate }}
                </template>
              </ai-avatar>
            </div>
          </template>
          <template v-slot:right v-if="customer.follower">
            <ai-avatar :avatar="customer | safe('follower.avatar')" />
          </template>
        </ai-cell>
      </template>
      <template v-slot:body v-if="isInDetail">
        <div class="edit">
          <div class="job" :style="{ color: '#' + jobStageColor }">
            当前进度: {{ customer | safe("job.title") }}
          </div>
          <div class="actions">
            <action-add-action :customer="customer" />
            <hui-button type="info" @click.native.stop="edit">
              编辑详情
            </hui-button>
          </div>
        </div>
        <div class="body">
          <div class="section detail">
            <div class="field phone">
              <span class="label">联系电话: </span>
              <span class="value">{{ customer.phone | emptyReplace }}</span>
            </div>
            <div class="field">
              <span class="label">名称: </span>
              <span class="value">{{ customer.name | emptyReplace }}</span>
            </div>
            <div class="field">
              <span class="label">地址: </span>
              <span class="value">{{ customer.address | emptyReplace }}</span>
            </div>
            <div class="field">
              <span class="label">备注: </span>
              <span class="value">{{ customer.remark | emptyReplace }}</span>
            </div>
            <div class="field">
              <span class="label">来源渠道: </span>
              <span class="value">{{ customer | safe("channel.title") }} </span>
            </div>
            <div class="field">
              <span class="label">来源信息: </span>
              <span class="value">{{ sourceDetail }}</span>
            </div>
            <div class="field">
              <span class="label">创建时间: </span>
              <span class="value">{{ customer.created_at | defaultDate }}</span>
            </div>
          </div>
          <div class="section user">
            <div class="title">微信绑定情况</div>
            <div class="field">
              <span class="label">微信: </span>
              <span class="value">{{ customer | safe("user.nickname") }}</span>
            </div>
            <div class="field">
              <span class="label">微信认证手机号码: </span>
              <span class="value">{{ customer | safe("user.phone") }}</span>
            </div>
          </div>
          <div class="section user">
            <div class="title">机构身份情况</div>
            <table>
              <tr>
                <th>创建时间</th>
                <th>角色</th>
                <th>机构</th>
                <th>合伙人</th>
              </tr>
              <template v-for="merchant in customer.merchants">
                <tr :key="merchant.id">
                  <td>{{ merchant.created_at | defaultDay }}</td>
                  <td>校长</td>
                  <td>{{ merchant.name }}</td>
                  <td>{{ merchant | safe("agent.realname") }}</td>
                </tr>
              </template>
              <template v-for="person in customer.persons">
                <tr :key="person.id">
                  <td>{{ person.created_at | date("MM-dd HH:mm") }}</td>
                  <td>{{ getRoleName(person.role) }}</td>
                  <td>{{ person | safe("merchant.name") }}</td>
                  <td>{{ person | safe("merchant.agent.realname") }}</td>
                </tr>
              </template>
            </table>
          </div>
          <div class="section referrer" v-if="customer.referrer">
            <div class="title">推荐人信息</div>
            <div class="field">
              <span class="label">微信: </span>
              <span class="value"
                >{{ customer | safe("referrer.nickname") }}
              </span>
            </div>
            <div class="field">
              <span class="label">微信认证手机号码: </span>
              <span class="value"
                >{{ customer | safe("referrer.phone") }}
              </span>
            </div>
          </div>
          <div class="section referrer" v-if="customer.referrer">
            <div class="title">推荐人机构身份情况</div>
            <table>
              <tr>
                <th>创建时间</th>
                <th>角色</th>
                <th>机构</th>
                <th>合伙人</th>
              </tr>
              <template v-for="merchant in customer.referrer.merchants">
                <tr :key="merchant.id">
                  <td>{{ merchant.created_at | defaultDay }}</td>
                  <td>校长</td>
                  <td>{{ merchant.name }}</td>
                  <td>{{ merchant | safe("agent.realname") }}</td>
                </tr>
              </template>
              <template v-for="person in customer.referrer.persons">
                <tr :key="person.id">
                  <td>{{ person.created_at | defaultDay }}</td>
                  <td>{{ getRoleName(person.role) }}</td>
                  <td>{{ person | safe("merchant.name") }}</td>
                  <td>{{ person | safe("merchant.agent.realname") }}</td>
                </tr>
              </template>
            </table>
          </div>
          <div class="section follower">
            <div class="title">
              <span>跟进人信息: </span>
              <action-transfer
                :customer="customer"
                @refresh="$emit('refresh')"
              />
            </div>

            <div class="field">
              <span class="label">合伙人: </span>
              <span class="value">
                {{ customer | safe("follower.nickname") }}
              </span>
            </div>
            <div class="field">
              <span class="label">手机号码: </span>
              <span class="value"
                >{{ customer | safe("follower.phone") }}
              </span>
            </div>
            <div class="field">
              <span class="label">开始时间: </span>
              <span class="value"
                >{{ customer.followed_at | defaultDate }}
              </span>
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
            <span class="label">最近跟进: </span>
            <span class="value">
              {{
                ((customer.latest_action &&
                  customer.latest_action.created_at) ||
                  customer.updated_at) | date("MM-dd HH:mm")
              }}
            </span>
          </div>
        </div>
      </template>
    </ai-card>
    <action-close
      :customer="customer"
      @refresh="$emit('refresh')"
      v-if="isInDetail"
      class="close"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";
import AiBadge from "@/view/component/AiBadge.vue";
import AiCell from "@/view/component/AiCell.vue";
import AiAvatar from "@/view/component/AiAvatar.vue";

import { CrmCustomerStatus } from "@/enum/crm_customer_status";
import { PersonRole } from "@/enum/person_role";

import ActionAddAction from "./ActionAddAction.vue";
import ActionTransfer from "./ActionTransfer.vue";
import ActionClose from "./ActionClose.vue";
import CrmJobCountDown from "./CrmJobCountDown.vue";

import forIn from "lodash/forIn";
import isEmpty from "lodash/isEmpty";
import _get from "lodash/get";

@Component({
  components: {
    AiCard,
    AiCell,
    AiBadge,
    AiAvatar,
    ActionTransfer,
    ActionClose,
    ActionAddAction,
    CrmJobCountDown,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) customer: any;
  @Prop({ type: String, default: "" }) outerTag: string;
  @Prop({ type: Boolean, default: false }) isInDetail: boolean;

  get status() {
    return CrmCustomerStatus[this.customer.status];
  }

  get jobStageColor() {
    return _get(this.customer, "job_stage.color");
  }

  get sourceDetail() {
    if (!this.customer.source) return "-";
    return `(${this.customer.source_class}/${this.customer.source_id})${
      this.customer.source.title || this.customer.source.name
    }`;
  }

  getRoleName(role) {
    let name = "";
    forIn(PersonRole, (v, k) => {
      if ((role & v.value) > 0) {
        name += isEmpty(name) ? "" : "|";
        name += v.text;
        console.log(name);
      }
    });
    return name;
  }

  open() {
    this.$router.push({
      name: "crmCustomerDetail",
      params: {
        customerId: this.customer.id,
      },
    });
  }

  edit() {
    this.$router.push({
      name: "crmCustomerEditing",
      params: {
        customerId: this.customer.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.customer {
  width: 100%;

  .header {
    width: 100%;
    padding: 10px;

    .left {
      display: flex;
      align-items: center;

      .number {
        margin-right: 10px;
        min-width: 80px;
        width: 80px;

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
  .edit {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .job {
      font-weight: 600;
      text-decoration: underline;
    }
    .actions {
      display: flex;
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

      .phone {
        font-weight: bold;
        color: red;
      }

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px;
        font-weight: 600;
      }

      table {
        width: 100%;
        font-size: 14px;
        color: #4a4a4a;

        td {
          text-align: center;
        }

        th {
          text-align: center;
          font-weight: normal;
        }
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
  .close {
    display: block;
    width: 80%;
    border: none;
    margin: 20px auto;
  }
}
</style>
