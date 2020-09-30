<template>
  <div class="wrapper floor-more">
    <floor title="更多功能">
      <div class="main">
        <template v-for="(data, index) in cellDatas">
          <div
            v-if="!(data.visiable === false)"
            :key="index"
            class="cell"
            @click="openWork(data)"
          >
            <span> {{ data.title }} </span>
            <span> <i class="iconfont icon-qrcode" /> </span>
          </div>
        </template>
      </div>
      <!--
      <div class="more">
        <img :src="require('@/asset/mp.ai.more.qrcode.jpeg')" />
        <p>长按识别二维码, 进入更多功能</p>
      </div>
-->
    </floor>
    <ai-dialog v-model="show">
      <div class="dialog">
        <p>{{ work | safe("title") }}</p>
        <img :src="work | safe('qrcode')" />
        <p>长按识别二维码, 进入查看操作</p>
      </div>
    </ai-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCell from "@/view/component/AiCell.vue";
import AiDialog from "@/view/component/AiDialog.vue";

import Floor from "./Floor.vue";

import _get from "lodash/get";

@Component({
  components: {
    Floor,
    AiCell,
    AiDialog,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) merchant: any;

  show: boolean = false;
  work: any = null;

  get isOwner() {
    const userId = _get(this.merchant, "user_id");
    return !!(userId && userId === _get(this.$auth, "user.id"));
  }

  get cellDatas() {
    return [
      {
        title: "算工资",
        qrcode: require("@/asset/image/qrcode/suangongzi.jpeg"),
      },
      {
        title: "学生剩余课时/课耗",
        qrcode: require("@/asset/image/qrcode/xuesheng-shengyu-keshi-kehao.jpeg"),
      },
      {
        title: "班级课时表",
        qrcode: require("@/asset/image/qrcode/banjikeshibiao.jpeg"),
      },
      {
        title: "一对一课时表",
        qrcode: require("@/asset/image/qrcode/yiduiyikeshibiao.jpeg"),
      },
      {
        title: "花名册 （仅校长）",
        qrcode: require("@/asset/image/qrcode/huamingce-xiaozhang.jpeg"),
        visiable: this.isOwner,
      },
      {
        title: "收款二维码",
        qrcode: require("@/asset/image/qrcode/shoukuan-erweima.jpeg"),
      },
      {
        title: "充值/扣费明细",
        qrcode: require("@/asset/image/qrcode/chongzhi-koufei-mingxi.jpeg"),
      },
      //  {
      //    title: "更多功能",
      //    qrcode: require("@/asset/image/qrcode/more.jpeg"),
      //  },
    ];
  }

  openWork(work) {
    this.work = work;
    this.show = true;
  }
}
</script>
<style lang="scss" scoped>
.floor-more {
  .main {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .cell {
      display: flex;
      align-items: center;
      justify-content: space-between;

      background: #ffffff;
      border-radius: 4px;
      padding: 10px;

      width: 49%;
      margin-bottom: 10px;

      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4a4a4a;
      line-height: 20px;

      &:not(:nth-child(2n)) {
        margin-right: 2%;
      }

      span:nth-child(2) {
        color: #b9b8b8;
      }
    }
  }

  .more {
    text-align: center;

    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4a4a4a;
    line-height: 18px;

    img {
      width: 100px;
    }
  }
}

.dialog {
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  img {
    width: 200px;
  }

  p:nth-child(1) {
    font-size: 18px;
    line-height: 2;
    font-weight: 600;
  }

  p:nth-child(3) {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4a4a4a;
    line-height: 2;
  }
}
</style>
