<template>
  <section class="container ai-background">
    <div class="dmrz">
      <div class="hd">
        <class-picker
          size="big"
          text="新东方烹饪学校"
        ></class-picker>
      </div>

      <div class="bd">
        <roll-call-item></roll-call-item>
      </div>
    </div>
  </section>
</template>

<script>
import RollCallItem from "~/components/RollCallItem.vue";
import ClassPicker from "~/components/ClassPicker.vue";

export default {
  components: {
    /** 表单数据 */
    "roll-call-item": RollCallItem,
    /** 班级选择 */
    "class-picker": ClassPicker
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
      title: "AI教务"
    };
  }
};
</script>
<style lang="scss">
</style>
