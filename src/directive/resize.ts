export default {
  inserted: function (el, binding) {
    const padding = binding.arg === "padding" ? binding.value : 0;
    el.style.height = "";
    el.style.height = `${el.scrollHeight - padding}px`;
  },
  update: function (el, binding) {
    const padding = binding.arg === "padding" ? binding.value : 0;
    el.style.height = "";
    el.style.height = `${el.scrollHeight - padding}px`;
  },
};
