import { Component, Vue } from "vue-property-decorator";

@Component
export default class BackMixin extends Vue {
  fromPath: string = "/";

  get isFromRoot() {
    return this.fromPath === "/";
  }

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.fromPath = from.path;
      next();
    });
  }

  goBack(callback: any = null) {
    callback && callback();

    if (this.isFromRoot) {
      this.$weixin.close();
    } else {
      this.$router.go(-1);
    }
  }
}
