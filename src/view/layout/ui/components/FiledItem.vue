<template>
  <div :class="className || ''">
    <div
      class="item textarea"
      v-if="type === 'textarea'"
    >
      <div class="label">
        {{label}}
        <div class="count">{{value.length}}/{{maxlength}}</div>
      </div>
      <div class="cont textarea">
        <textarea :value="value" />
        </div>
    </div>
    <div
      v-else
      :class="'item ' + (type || '')"
    >
      <div class="label">
        {{label}}<span
          class="star"
          v-if="required"
        >*</span>
      </div>

      <div class="cont">
        <!-- Str 输入框 -->
        <input
          class="input"
          v-if="type === 'text' || type === 'number'"
          :type="type"
          :placeholder="placeholder"
          :value="value"
        />
        <!-- End 输入框 -->

        <!-- Str 下拉框 -->
        <div
          class="picker"
          v-if="type === 'picker'"
          @click="showPicker"
        >
          <div
            class="value"
            v-if="value"
          >{{value}}</div>
          <div
            class="placeholder"
            v-else
          >{{placeholder}}</div>
          <span class="iconfont iconxiala"></span>
        </div>
        <!-- End 下拉框 -->

        <!-- Str 日期选组 -->
        <div
          class="date"
          v-if="type === 'date'"
          @click="showDateTimePicker"
        >
          <div
            class="value"
            v-if="value"
          >{{value}}</div>
          <div
            class="placeholder"
            v-else
          >{{placeholder}}</div>
          <span class="iconfont iconshijian"></span>
        </div>
        <!-- End 日期选择 -->

        <div
          :class="active ? 'radio active' : 'radio'"
          v-if="type === 'radio'"
        >
          <div class="circle"></div>
        </div>
        <div
          class="avatar"
          v-if="type === 'avatar'"
        ></div>
      </div>
    </div>
    <div :class="'slot ' + className">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    "type",
    "label",
    "placeholder",
    "required",
    "value",
    "active",
    "maxlength",
    "className"
  ],
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
    },

    /**
     * 展示下拉框 日期时间
     */
    showDateTimePicker() {
      if (!this.dateTimePicker) {
        this.dateTimePicker = this.$createDatePicker({
          title: "日期时间",
          min: new Date(2008, 7, 8, 8, 0, 0),
          max: new Date(2020, 9, 20, 20, 59, 59),
          value: new Date(),
          columnCount: 6,
          onSelect: this.selectDTHandle,
          onCancel: this.cancelDTHandle
        });
      }

      this.dateTimePicker.show();
    },

    selectDTHandle(date, selectedVal, selectedText) {
      this.$createDialog({
        type: "warn",
        content: `Selected Item: <br/> - date: ${date} <br/> - value: ${selectedVal.join(
          ", "
        )} <br/> - text: ${selectedText.join(" ")}`,
        icon: "cubeic-alert"
      }).show();
    },

    cancelDTHandle() {
      this.$createToast({
        type: "correct",
        txt: "Picker canceled",
        time: 1000
      }).show();
    }
  }
};
</script>
<style lang="scss" scoped>
.item {
  position: relative;
  padding: 1.2rem 0 1rem;
  border-bottom: .1rem solid rgba(216, 216, 216, .3);

  .label {
    padding: .1rem 0;
    color: #4a4a4a;
    font-size: 1.4rem;
    font-weight: bold;
  }

  .cont {
    padding: .2rem 0;
  }

  .input {
    width: 100%;
    color: #4a4a4a;
    font-size: 1.3rem;

    &::-webkit-input-placeholder {
      color: #9b9b9b;
    }
  }

  .picker,
  .date {
    display: flex;
    justify-content: space-between;
    min-height: 1.7rem;
    font-size: 1.3rem;
    line-height: 1.7rem;

    .value {
      color: #4a4a4a;
    }
    .placeholder {
      color: #9b9b9b;
    }
  }

  .picker {
    .iconfont {
      color: #9b9b9b;
      font-size: .8rem;
    }
  }

  .date {
    .iconfont {
      color: #4a4a4a;
      font-size: 1.8rem;
    }
  }

  .radio {
    position: absolute;
    top: 50%;
    right: 0;
    width: 3.4rem;
    height: 2rem;
    border-radius: 1.2rem;
    background-color: #f2f2f2;
    transform: translateY(-50%);

    .circle {
      position: absolute;
      top: .3rem;
      right: .3rem;
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 50%;
      background-color: #ffffff;
    }

    &.active {
      background-color: rgba(250, 142, 69, .2);

      .circle {
        left: .3rem;
        background-color: #fa8e45;
      }
    }
  }

  .avatar {
    position: absolute;
    top: 50%;
    right: 0;
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 1rem;
    background-color: #ffd811;
    transform: translateY(-50%);
  }

  &.avatar {
    padding: 2.4em 0 1.6rem;
  }

  &.textarea {
    .label {
      position: relative;

      .count {
        position: absolute;
        top: 50%;
        right: 0;
        color: #9b9b9b;
        font-size: 1.3rem;
        transform: translateY(-50%);
      }
    }

    .cont {
      padding: .4rem 0 0;
      textarea {
        width: 100%;
        height: 3.4rem;
        font-size: 1.3rem;
        resize: none;
      }
    }
  }
}

.margin {
  .item {
    margin: 0 2.8rem;
  }

  .slot {
    padding: 0 2.8rem;
  }
}

.slot {
  background: linear-gradient(
  180deg,
  rgba(251, 251, 251, 1) 0%,
  rgba(246, 246, 246, 1) 100%
  );
}

</style>
