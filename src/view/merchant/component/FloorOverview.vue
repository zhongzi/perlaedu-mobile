<template>
  <div class="wrapper floor-overview">
    <floor title="学校概况">
      <div class="main">
        <template v-for="(data, index) in mainCellDatas">
          <floor-cell
            v-if="!(data.visiable === false)"
            :key="index"
            class="cell"
            :title="data.title"
            :amount="data.amount"
            :unit="data.unit"
            :icon="data.icon"
            :decimal="data.decimal"
            :clickable="data | safe('clickable', true)"
            :showPlus="data | safe('showPlus', true)"
            @click="gotoList(data)"
            @clickPlus="gotoAdd(data)"
          />
        </template>
      </div>
      <div class="btn-guide" @click="showMore = true" v-if="!showMore">
        <i class="iconfont icon-xiala" />
        <span> 点击展开更多数据 </span>
      </div>
      <div class="more" v-else>
        <template v-for="(data, index) in moreCellDatas">
          <floor-cell
            :key="index"
            class="cell"
            :title="data.title"
            :amount="data.amount"
            :unit="data.unit"
            :decimal="data.decimal"
          >
            <template v-slot:right> <span /> </template>
          </floor-cell>
        </template>
      </div>
    </floor>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import Floor from "./Floor.vue";
import FloorCell from "./FloorCell.vue";

import _get from "lodash/get";
import isEmpty from "lodash/isEmpty";

@Component({
  components: {
    Floor,
    FloorCell,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;

  showMore: boolean = false;

  get isOwner() {
    const userId = _get(this.merchant, "user_id");
    return !!(userId && userId === _get(this.$auth, "user.id"));
  }

  get mainCellDatas() {
    return [
      {
        title: "教务管理",
        amount: _get(
          this.merchant,
          "statistics.person.count_by.count_assistant",
          0
        ),
        unit: "名",
        icon: require("../asset/image/shape-assistant" +
          this.$densityStr +
          ".png"),
        listURL: this.$frontURLResolver.listAssistants(this.merchant),
        addURL: this.$frontURLResolver.addAssistant(this.merchant),
        visiable: this.isOwner,
      },
      {
        title: "老师管理",
        amount: _get(
          this.merchant,
          "statistics.person.count_by.count_teacher",
          0
        ),
        unit: "名",
        icon: require("../asset/image/shape-teacher" +
          this.$densityStr +
          ".png"),
        listURL: this.$frontURLResolver.listTeachers(this.merchant),
        addURL: this.$frontURLResolver.addTeacher(this.merchant),
      },
      {
        title: "学生管理",
        amount: _get(
          this.merchant,
          "statistics.person.count_by.count_student",
          0
        ),
        unit: "名",
        icon: require("../asset/image/shape-student" +
          this.$densityStr +
          ".png"),
        listURL: this.$frontURLResolver.listStudents(this.merchant),
        addURL: this.$frontURLResolver.addStudent(this.merchant),
      },
      {
        title: "班级管理",
        amount: _get(this.merchant, "statistics.group.count_valid", 0),
        unit: "个",
        icon: require("../asset/image/shape-class" + this.$densityStr + ".png"),
        listURL: this.$frontURLResolver.listGroups(this.merchant),
        addURL: this.$frontURLResolver.addGroup(this.merchant),
      },
      {
        title: "人科",
        amount: _get(this.merchant, "statistics.tag.sum_by_merchant.count", 0),
        unit: "科",
        icon: require("../asset/image/shape-lesson" +
          this.$densityStr +
          ".png"),
        clickable: false,
        showPlus: false,
      },
    ];
  }

  get moreCellDatas() {
    return [
      {
        title: "课时存量",
        amount: _get(
          this.merchant,
          "statistics.tag.sum_by_merchant.sum_lessons",
          0
        ),
        unit: "课时",
      },
      {
        title: "课时费存量",
        amount: _get(
          this.merchant,
          "statistics.tag.sum_by_merchant.sum_prices",
          0
        ),
        unit: "元",
        decimal: 2,
      },
      {
        title: "储值卡存量",
        amount: _get(
          this.merchant,
          "statistics.tag.sum_by_merchant.sum_cash",
          0
        ),
        unit: "元",
        decimal: 2,
      },
      {
        title: "总课时消耗",
        amount: _get(
          this.merchant,
          "statistics.tag_transaction.sum_by_merchant.sum_lessons_decr",
          0
        ),
        unit: "课时",
      },
      {
        title: "总课时费消耗",
        amount: _get(
          this.merchant,
          "statistics.tag_price_transaction.sum_by_merchant.sum_prices_decr",
          0
        ),
        unit: "元",
        decimal: 2,
      },
      {
        title: "总储值卡消耗",
        amount: _get(
          this.merchant,
          "statistics.tag_transaction.sum_by_merchant.sum_cash_decr",
          0
        ),
        unit: "元",
        decimal: 2,
      },
    ];
  }

  gotoList(data) {
    if (isEmpty(data.listURL)) return;

    window.location.href = data.listURL;
    return;
  }

  gotoAdd(data) {
    if (isEmpty(data.addURL)) return;

    window.location.href = data.addURL;
    return;
  }
}
</script>
<style lang="scss" scoped>
.floor-overview {
  .main,
  .more {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .cell {
      width: 32%;

      &:not(:nth-child(3n)) {
        margin-right: calc(4% / 2);
      }
    }
  }

  .main {
    .cell:nth-child(n + 4) {
      margin-top: 8px;
    }
  }
  .more {
    .cell {
      margin-top: 8px;
    }
  }

  .btn-guide {
    text-align: center;
    margin-top: 15px;

    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8a8686;
    line-height: 20px;

    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 12px;
      margin-right: 10px;
    }
  }
}
</style>
