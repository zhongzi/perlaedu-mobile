const BillCouponStatus = {
  pending: {
    text: "激活中 ",
    color: "#B61227",
  },
  refer: {
    text: "推荐",
    color: "#F5A623",
    unSelected: true,
  },
  funded: {
    text: "已扣款",
    color: "#F5A623",
    unSelected: true,
  },
  issued: {
    text: "发券",
    color: "#F5A623",
    unSelected: true,
  },
  taken: {
    text: "已领取",
    action: "领取",
    color: "#F5A623",
  },
  used_pending: {
    text: "核销锁定中",
    color: "#F5A623",
    unSelected: true,
  },
  used: {
    text: "已核销",
    action: "核销",
    color: "#4A4A4A",
  },
  expired: {
    text: "已经过期",
    color: "#F5A623",
    unSelected: true,
  },
  canceled: {
    text: "已取消",
    color: "#F5A623",
    unSelected: true,
  },
  defunded: {
    text: "已经退款",
    color: "#F5A623",
    unSelected: true,
  },
  transfer: {
    text: "已经转账",
    color: "#F5A623",
    unSelected: true,
  },
};

export { BillCouponStatus };
