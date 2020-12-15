<template>
  <section class="container ai-background">
    <div class="bdmx">
      <div class="hd">
        <div class="trigger-box">
          <class-picker
            size="big"
            text="新东方烹饪学校"
          ></class-picker>
        </div>
        <!-- Str 数据区 -->
        <div class="count-area">
          <div class="count-item">
            <div class="count">
              <div class="sum sum-1">+345</div>
              <div class="sum sum-2">-282</div>
            </div>
            <div class="txt">
              本日
            </div>
          </div>

          <div class="count-item">
            <div class="count">
              <div class="sum sum-1">+345</div>
              <div class="sum sum-2">-282</div>
            </div>
            <div class="txt">
              本日
            </div>
          </div>

          <div class="count-item">
            <div class="count">
              <div class="sum sum-1">+345</div>
              <div class="sum sum-2">-282</div>
            </div>
            <div class="txt">
              本日
            </div>
          </div>
        </div>
        <!-- End 数据区 -->
      </div>

      <div class="bd ai-content">
        <div class="filter">
          <div class="filter-box">
            <check-box
              text="显示 +"
              :active="true"
            ></check-box>
          </div>
          <div class="filter-box">
            <check-box
              text="显示 -"
              :active="false"
            ></check-box>
          </div>
        </div>
        <filter-item></filter-item>
        <filter-item></filter-item>
      </div>
    </div>
  </section>
</template>

<script>
import FilterItem from "~/components/FilterItem.vue";
import CheckBox from "~/components/CheckBox.vue";
import ClassPicker from "~/components/ClassPicker.vue";

export default {
  components: {
    /** 表单数据 */
    "check-box": CheckBox,
    /** 班级选择 */
    "class-picker": ClassPicker,
    /** 表单 */
    "filter-item": FilterItem
  },

  data() {
    return {};
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
