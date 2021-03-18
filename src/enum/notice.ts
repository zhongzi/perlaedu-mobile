const NoticeStatus = {
  pending: {
    text: "未启动",
    color: "#FF6666",
  },
  running: {
    text: "发送中",
    color: "#99CC66",
  },
  finished: {
    text: "已完成",
    color: "#99CC66",
  },
  freezed: {
    text: "已暂停",
    color: "#99CC66",
  },
  stopped: {
    text: "已停止",
    color: "#99CC66",
  },
};

const NoticeChannel = {
  inbox: {
    text: "站内信(不发微信&短信消息)",
    color: "#FF6666",
  },
  sms: {
    text: "短信",
    color: "#99CC66",
  },
  wechat: {
    text: "微信",
    color: "#99CC66",
  },
  wechat_sms: {
    text: "优先微信再短信",
    color: "#99CC66",
  },
  wechat_sms_reverse: {
    text: "优先短信再微信",
    color: "#99CC66",
  },
  wechat_sms_repeat: {
    text: "微信短信都发",
    color: "#99CC66",
  },
};

export { NoticeStatus, NoticeChannel };
