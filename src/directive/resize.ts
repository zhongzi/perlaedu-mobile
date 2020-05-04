export default {
  inserted: function (el) {
    el.style.height = `${el.scrollHeight}px`;
  },
  update: function (el) {
    el.style.height = `${el.scrollHeight}px`;
  },
};
