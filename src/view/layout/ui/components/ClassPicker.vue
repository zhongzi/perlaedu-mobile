<template>
  <div
    :class="'ai-class-picker ' + (size || '')"
    @click="showPicker"
  >
    <div class="cont">
      <span class="iconfont iconxiaoquqiehuan"></span>
      <div class="txt">{{text}}</div>
    </div>
    <div class="arrow">
      <span class="iconfont iconxiala"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["text", "active", "size"],

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
          title: "请选择",
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
.ai-class-picker {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 18rem;
  height: 4rem;
  padding: 0 2.4rem 0 1.2rem;
  border-radius: 1rem;
  background-color: rgba(229, 103, 24, .6);
  color: rgba(255, 255, 255, .8);

  &.big {
    width: 19.4rem;
  }

  &.small {
    width: 12rem;
    .cont {
      .ico {
        margin-right: .8rem;
      }
      .txt {
        flex: 0 0 6rem;
      }
    }
  }

  .cont {
    display: flex;
    flex: 1;
    align-items: center;

    flex-wrap: nowrap;

    .iconxiaoquqiehuan {
      margin-right: 1.2rem;
      font-size: 1.4rem;
    }

    .txt {
      overflow: hidden;
      flex: 1;
      font-size: 1.4rem;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .arrow {
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    .iconxiala {
      font-size: .8rem;
    }
  }
}

</style>
