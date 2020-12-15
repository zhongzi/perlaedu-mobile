<template>
  <section class="container">
    <div class="dmqr">
      <div class="ai-mask">
        <div class="content center">
          <div class="tit">
            <span class="iconfont iconqueren"></span> 确认
          </div>
          <div class="tips">确认给选中的学生划课时？</div>
          <div class="selects">
            <div>
              <check-box
                :active="true"
                text="发送变动通知"
              ></check-box>
            </div>
            <div>
              <check-box
                :active="true"
                text="发送变动通知"
              ></check-box>
            </div>
            <div>
              <check-box
                :active="true"
                text="发送变动通知"
              ></check-box>
            </div>
          </div>

          <div class="picker-trigger">
            点名时上课的老师 <span class="iconfont iconxiala"></span>
          </div>

          <div class="remark">
            <textarea
              name=""
              id=""
              placeholder="备注（会出现在变动通知中）"
            ></textarea>
            <div class="count">0/100</div>
          </div>

          <div class="btn-area">
            <div class="ai-btn w-120 cancel">取消</div>
            <div class="ai-btn w-120 primary">确定</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CheckBox from "~/components/CheckBox.vue";

export default {
  components: {
    /** 表单数据 */
    "check-box": CheckBox
  },

  data() {
    return {
      list: [
        {
          tag: "A",
          users: [
            {
              name: "全真弃子",
              binded: true,
              status: "已停课"
            }
          ]
        }
      ]
    };
  },

  head() {
    return {
      title: "点名确认"
    };
  }
};
</script>
<style lang="scss">
</style>
