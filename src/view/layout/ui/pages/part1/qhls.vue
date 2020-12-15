<template>
  <section class="container">
    <div class="qhls">
      <div class="ai-mask">
        <div class="content center">
          <div
            class="box"
            v-for="(item, index) in list"
            :key="index"
            @click="actionChangeTeacher(item)"
          >
            <teacher-item :item="item"></teacher-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TeacherItem from "~/components/TeacherItem.vue";

export default {
  components: {
    /** 教师 */
    "teacher-item": TeacherItem
  },

  data() {
    return {
      list: [
        {
          id: 1,
          name: "张翠山",
          active: true
        },
        {
          id: 2,
          name: "灭绝师太",
          active: false
        },
        {
          id: 3,
          name: "成昆",
          active: false
        },
        {
          id: 4,
          name: "张翠山",
          active: false
        },
        {
          id: 5,
          name: "紫衫龙王",
          active: false
        },
        {
          id: 6,
          name: "灭绝师太",
          active: false
        }
      ]
    };
  },

  head() {
    return {
      title: "切换老师"
    };
  },

  methods: {
    /**
     * 点击切换教师
     */
    actionChangeTeacher(cur) {
      this.list.map(item => {
        if (item.id === cur.id) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
</style>
