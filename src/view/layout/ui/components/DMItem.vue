<template>
  <div class="dm-item">
    <div class="detail">
      <div class="avatar"></div>
      <div class="info">
        <div class="name">
          宋远桥
          <div
            class="status-picker"
            @click="showPicker"
          >
            迟到 <span class="iconfont iconxiala"></span>
          </div>
        </div>
        <div class="class-name">
          <span class="iconfont iconkecheng"></span> 真武七截阵
        </div>
      </div>

      <check-box size="big"></check-box>
    </div>

    <div class="item-foot">
      <div class="class-hour">
        <span class="iconfont iconshengyu"></span> 剩余 234课
      </div>
      <div class="class-hour">
        <span class="iconfont iconqingjia"></span> 请假 234课
      </div>
      <div class="class-hour">
        <span class="iconfont iconkeqingjia"></span> 可请 234课
      </div>
    </div>
  </div>
</template>
<script>
import CheckBox from "~/components/CheckBox.vue";
export default {
  props: [],
  components: {
    "check-box": CheckBox
  },
  head() {
    return {
      title: "AI教务"
    };
  },

  data() {
    return {
      pickerItems: [
        { text: "选项1", value: "1" },
        { text: "选项2", value: "2" },
        { text: "选项3", value: "3" }
      ]
    };
  },

  methods: {
    /**
     * 展示下拉框
     */
    showPicker() {
      if (!this.picker) {
        this.picker = this.$createPicker({
          title: this.label,
          data: [this.pickerItems],
          onSelect: this.selectHandle,
          onCancel: this.cancelHandle
        });
      }
      this.picker.show();
    },

    /**
     * 确认
     */
    selectHandle(selectedVal, selectedIndex, selectedText) {
      this.$createToast({
        type: "correct",
        txt: `已选择: value: ${selectedVal.join(
          ", "
        )} - index: ${selectedIndex.join(", ")} - text: ${selectedText.join(
          " "
        )}`,
        time: 2000
      }).show();
    },

    /**
     * 取消
     */
    cancelHandle() {
      this.$createToast({
        type: "correct",
        txt: "取消",
        time: 1000
      }).show();
    }
  }
};
</script>
<style lang="scss" scoped>
.dm-item {
  padding: 1rem 0 .8rem;
  border-bottom: .1rem solid rgba(151, 151, 151, .15);

  .detail {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .avatar {
      display: block;
      flex: 0 0 4.5rem;
      height: 4.5rem;
      border-radius: 1rem;
      background-color: #ffd811;
    }

    .info {
      flex: 1;
      padding-left: 1rem;

      .name {
        display: flex;
        align-items: center;
        padding-bottom: .2rem;
        color: #4a4a4a;
        font-size: 1.4rem;
        font-weight: bold;

        .status-picker {
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          width: 5.4rem;
          height: 2.2rem;
          margin-left: .5rem;
          padding: 0 .5rem;
          border-radius: .4rem;
          background-color: #fbf5e7;
          color: #fdb600;
          font-size: 1.2rem;

          .iconfont {
            font-size: .6rem;
          }
        }
      }

      .class-name {
        display: flex;
        align-items: center;
        color: #4a4a4a;
        font-size: 1.2rem;

        .iconfont {
          margin-right: .8rem;
          color: #4a4a4a;
          font-size: 1.3rem;
        }
      }
    }
  }

  .item-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: .9rem;

    .class-hour {
      display: flex;
      align-items: center;
      color: #afafaf;
      font-size: 1.2rem;

      .iconfont {
        margin-right: .6rem;
        color: rgba(155, 155, 155, .4);
        font-size: 1.2rem;
      }
    }
  }
}

</style>
