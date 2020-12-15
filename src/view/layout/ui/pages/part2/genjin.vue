<template>
  <section class="container">
    <div class="genjin">
      <follow-up></follow-up>
      <follow-up></follow-up>
    </div>
  </section>
</template>

<script>
import FollowUpItem from "~/components/FollowUpItem.vue";

export default {
  components: {
    "follow-up": FollowUpItem
  },
  head() {
    return {};
  }
};
</script>
<style lang="scss">
</style>
