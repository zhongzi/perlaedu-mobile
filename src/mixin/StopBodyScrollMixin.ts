import { Component, Vue } from "vue-property-decorator";

@Component
export default class StopBodyScrollMixin extends Vue {
  SBSBody: any = document.body;
  SBSTop: number = 0;
  SBSAuto: boolean = true;
  SBSHasFixed: boolean = false;

  stopBodyScroll(isFixed) {
    this.$nextTick(() => {
      this._stopBodyScroll(isFixed);
    });
  }

  _stopBodyScroll(isFixed) {
    if (isFixed) {
      if (this.SBSHasFixed) return;

      this.SBSHasFixed = true;
      this.SBSTop = window.scrollY;

      this.SBSBody.style.position = "fixed";
      this.SBSBody.style.top = -this.SBSTop + "px";
      this.SBSBody.style.maxWidth = "100vw";
      this.SBSBody.style.width = "100vw";
    } else {
      this.SBSBody.style.position = "";
      this.SBSBody.style.top = "";
      this.SBSBody.style.maxWidth = "initial";
      this.SBSBody.style.width = "initial";

      window.scrollTo(0, this.SBSTop);
    }
  }

  mounted() {
    this.SBSAuto && this.stopBodyScroll(true);
  }

  deactivated() {
    this.SBSAuto && this.stopBodyScroll(false);
  }

  beforeDestroy() {
    this.SBSAuto && this.stopBodyScroll(false);
  }
}
