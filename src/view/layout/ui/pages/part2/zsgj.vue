<template>
  <section class="container ai-background">
    <div class="zsgj">
      <div class="hd">
        <class-picker text="新东方烹饪学校"></class-picker>

        <div class="name-picker">
          <div class="cont">
            <div class="txt">跟进人 全部</div>
          </div>
          <div class="arrow">
            <span class="iconfont iconxiala"></span>
          </div>
        </div>
      </div>

      <div class="bd ai-content">
        <div class="filter-counts">
          <div class="count-item">
            <div class="txt">已导入</div>
            <div class="sum">154</div>
          </div>
          <div class="count-item">
            <div class="txt">已沟通</div>
            <div class="sum">31</div>
          </div>
          <div class="count-item">
            <div class="txt">已预约</div>
            <div class="sum">12</div>
          </div>
          <div class="count-item">
            <div class="txt">已试课</div>
            <div class="sum">10</div>
          </div>
          <div class="count-item">
            <div class="txt">已报名</div>
            <div class="sum">4</div>
          </div>
        </div>

        <div class="filter-area">
          <div class="ai-row">
            <div class="ai-col flex-1">
              <filed-item
                label="筛选关键字（可不填）"
                placeholder="请输入姓名、电话 "
                type="text"
              ></filed-item>
            </div>
          </div>

          <div class="tags-area">
            <div class="tag-hd">
              <div class="tit">筛选标签</div>
              <div class="tag-s tag-style-1">未选中</div>
              <div class="tag-s tag-style-2">包含</div>
              <div class="tag-s tag-style-3">不包含</div>
            </div>

            <div class="tag-bd">
              <div class="tag-l tag-style-1">
                <div class="txt">已导入</div>
                <div class="num">(32)</div>
              </div>

              <div class="tag-l tag-style-2">
                <div class="txt">已导入</div>
                <div class="num">(32)</div>
              </div>

              <div class="tag-l tag-style-2">
                <div class="txt">已导入</div>
                <div class="num">(32)</div>
              </div>

              <div class="tag-l tag-style-2">
                <div class="txt">已导入</div>
                <div class="num">(32)</div>
              </div>

              <div class="tag-l tag-style-3">
                <div class="txt">已导入</div>
                <div class="num">(32)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button-group :buttons="buttons">
      </button-group>
    </div>
  </section>
</template>

<script>
import ClassPicker from "~/components/ClassPicker.vue";
import FiledItem from "~/components/FiledItem";
import ButtonGroup from "~/components/ButtonGroup.vue";

export default {
  components: {
    "class-picker": ClassPicker,
    "button-group": ButtonGroup,
    "filed-item": FiledItem
  },
  head() {
    return {
      title: "招生跟进"
    };
  },
  data() {
    return {
      buttons: [
        {
          text: "筛选名单",
          type: "primary",
          width: "306"
        }
      ]
    };
  }
};
</script>
<style lang="scss">
</style>
