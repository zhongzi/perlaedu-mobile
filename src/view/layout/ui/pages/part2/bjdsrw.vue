<template>
  <section class="container">
    <div class="bjdsrw">
      <div class="hd">
        <div class="time-picker">
          <div class="time-hour time-part">
            <div class="time-item">14</div>
            <div class="time-item">15</div>
            <div class="time-item">16</div>
            <div class="time-item">17</div>
            <div class="time-item">18</div>
          </div>
          <div class="time-minus time-part">
            <div class="time-item">32</div>
            <div class="time-item">31</div>
            <div class="time-item">30</div>
            <div class="time-item">29</div>
            <div class="time-item">28</div>
          </div>
        </div>
      </div>
      <div class="bd">
        <div class="item-wrap">
          <arrow-item
            label="重复"
            value="周一，周四，周五，周日"
          ></arrow-item>
        </div>
        <div class="item-wrap">
          <arrow-item
            label="名称"
            value="记得扣课时"
          ></arrow-item>
        </div>
        <div class="item-wrap">
          <arrow-item
            label="任务对象"
            value="所有老师"
          ></arrow-item>
        </div>
        <div class="item-wrap">
          <arrow-item
            label="任务内容"
            value="千万记得"
          ></arrow-item>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ArrowItem from "~/components/ArrowItem.vue";
import FiledItem from "~/components/FiledItem.vue";

export default {
  components: {
    "arrow-item": ArrowItem,
    "filed-item": FiledItem
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
