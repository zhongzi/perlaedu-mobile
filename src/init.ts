const baseSize = 10;
const baseWidth = 375;
function setRem() {
  const scale = document.documentElement.clientWidth / baseWidth;
  document.documentElement.style.fontSize =
    baseSize * Math.min(scale, 2) + "px";
}
setRem();
window.onresize = function () {
  setRem();
};
