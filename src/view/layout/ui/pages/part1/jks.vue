<template>
  <section class="container">
    <div class="jks">
      <div class="ai-mask">
        <div class="content center">
          <div class="title">
            <span class="iconfont iconjiakeshiicon"></span>
            <div class="txt">加课时</div>
          </div>

          <div class="form-area">
            <div class="ai-row">
              <div class="ai-col flex-3">
                <input
                  placeholder="课时名 *"
                  type="text"
                  class="text-l"
                />
              </div>
              <div class="ai-col flex-2">
                <input
                  placeholder="加课时数 *"
                  type="text"
                />
              </div>
            </div>
            <div class="tips">
              *课时数除开数字还可是月卡、季卡、年卡、不限
            </div>
            <div class="ai-row">
              <div class="ai-col flex-1">
                <input
                  placeholder="总课时费"
                  type="text"
                />
              </div>
              <div class="ai-col flex-1">
                <input
                  placeholder="课时有效期"
                  type="text"
                />
              </div>
              <div class="ai-col flex-1">
                <input
                  placeholder="可请假次数"
                  type="text"
                />
              </div>
            </div>

            <div class="ai-row">
              <div class="text-area">
                <textarea
                  name=""
                  id=""
                  placeholder="备注（会出现在变动通知中）"
                />
                <div class="text">0/100</div>
              </div>
            </div>

            <div class="receipt">
              <div class="tit">收据</div>
              <div class="upload">
                <span class="iconfont iconjiahao"></span>
              </div>
            </div>

            <div class="check-box-area" @click="actionChangeStatus">
              <check-box :active="status" text="发送变动通知" />
            </div>
          </div>

          <button-group
            :buttons="buttons"
            size='mini'
            position="static"
          ></button-group>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CheckBox from "~/components/CheckBox.vue";
import ButtonGroup from "~/components/ButtonGroup.vue";

export default {
  components: {
    /** 选择框 */
    "check-box": CheckBox,
    /** 按钮组 */
    "button-group": ButtonGroup
  },

  data() {
    return {
      buttons: [
        {
          text: "取消",
          type: "cancel",
          width: "120"
        },
        {
          text: "确定",
          type: "primary",
          width: "120"
        }
      ],
      /** 选择框状态 */
      status: false
    };
  },

  head() {
    return {
      title: "加课时"
    };
  },

  methods: {
    actionChangeStatus() {
      this.status = !this.status;
    }
  }
};
</script>
<style lang="scss">
</style>
