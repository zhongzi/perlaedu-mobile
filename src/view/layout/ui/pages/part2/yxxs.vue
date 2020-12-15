<template>
  <section class="container">
    <div class="yxxs">
      <div class="form-area">
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              type="text"
              placeholder="请输入学生姓名"
              label="姓名"
            ></filed-item>
          </div>
          <div class="ai-col flex-1">
            <filed-item
              type="number"
              value="15387657793"
              label="电话"
            ></filed-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-1">
            <filed-item
              type="text"
              placeholder="请输入学生姓名"
              label="备注"
            ></filed-item>
          </div>
        </div>
        <div class="ai-row">
          <div class="ai-col flex-2">
            <filed-item
              type="date"
              pickerType="datetime"
              placeholder="2019/10/25 10:00:00"
              label="下一次跟进时间"
            ></filed-item>
          </div>
          <div class="ai-col flex-1">
            <filed-item
              type="text"
              placeholder="跟进负责人"
              label="跟进人"
            ></filed-item>
          </div>
        </div>
      </div>

      <div class="tips">
        *跟进时间到，跟进人会收到消息提醒
      </div>

      <div class="check-btn-area">
        <div class="btn-item">已导入</div>
        <div class="btn-item active">
          <div class="ico"></div>已导入
        </div>
        <div class="btn-item setting">
          <span class="iconfont iconshezhi"></span>
        </div>
      </div>

      <div class="delete-area">
        <span class="iconfont iconshanchu"></span> 删除当前意向学生
      </div>

      <button-group></button-group>
    </div>
  </section>
</template>

<script>
import ButtonGroup from "~/components/ButtonGroup.vue";
import FiledItem from "~/components/FiledItem.vue";

export default {
  components: {
    "button-group": ButtonGroup,
    "filed-item": FiledItem
  },
  head() {
    return {
      title: "意向学生"
    };
  }
};
</script>
<style lang="scss">
</style>
