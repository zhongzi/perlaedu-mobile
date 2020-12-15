<template>
  <section class="container">
    <div class="jxs">
      <div class="avatar">
        <image />
      </div>

      <div class="form-area">
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              type="text"
              label="姓名"
              placeholder="请输入学生姓名"
              :required="true"
            />
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              type="number"
              label="电话"
              placeholder="请输入学生手机号"
              :required="true"
            />
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-3">
            <filed-item
              type="picker"
              label="所学课程"
              placeholder="课程名"
            />
          </div>
          <div class="ai-col flex-2">
            <filed-item
              type="text"
              label="课时数"
              placeholder="课时数"
            />
          </div>
          <div class="ai-col flex-2">
            <filed-item
              type="text"
              label="总课时费"
              placeholder="总课时费"
            />
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              type="text"
              label="课程有效期"
              placeholder="请输入课时有效期"
            />
          </div>
          <div class="ai-col flex-1">
            <filed-item
              type="text"
              label="可请假次数"
              placeholder="可请假次数"
            />
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              type="picker"
              label="所在班级"
              placeholder="请选择所在班级"
            />
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              type="text"
              label="备注"
              placeholder="请输入备注"
            />
          </div>
        </div>
      </div>
      <div class="tips">
        *课时数除开数字还可以是月卡、季卡、年卡、不限
      </div>

      <button-group
        :buttons="buttons"
        className='grey'
      ></button-group>
    </div>
  </section>
</template>

<script>
import FiledItem from "~/components/FiledItem.vue";
import ButtonGroup from "~/components/ButtonGroup.vue";

export default {
  components: {
    /** 表单组件 */
    "filed-item": FiledItem,
    /** 按钮组 */
    "button-group": ButtonGroup
  },

  data() {
    return {
      buttons: [
        {
          text: "取消",
          type: "cancel",
          width: "126"
        },
        {
          text: "确定",
          type: "primary",
          width: "160"
        }
      ]
    };
  },

  head() {
    return {
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss">
</style>
