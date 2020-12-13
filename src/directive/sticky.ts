import store from "../store";

export default {
  inserted: function (el, binding) {
    const key = binding.value;
    el.scrollTop = store.state.sticky[key] || 0;
    el.addEventListener("scroll", (event) => {
      store.state.sticky[key] = el.scrollTop;
    });
  },
};
