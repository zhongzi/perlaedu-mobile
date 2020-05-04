import { Component, Vue } from "vue-property-decorator";

@Component
export default class StopBodyScrollMixin extends Vue {
  SBSBody: any = document.body;
  SBSTop: number = 0;
  SBSAuto: boolean = true;

  stopBodyScroll(isFixed) {
    if (isFixed) {
      this.SBSTop = window.scrollY;

      this.SBSBody.style.position = "fixed";
      this.SBSBody.style.top = -this.SBSTop + "px";
    } else {
      this.SBSBody.style.position = "";
      this.SBSBody.style.top = "";

      window.scrollTo(0, this.SBSTop);
    }
  }

  deactivated() {
    this.SBSAuto && this.stopBodyScroll(false);
  }

  beforeDestroy() {
    this.SBSAuto && this.stopBodyScroll(false);
  }
}
