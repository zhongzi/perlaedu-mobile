const PersonRole = {
  archived: {
    text: "已经归档",
    value: 0x01,
    color: "#F5A623",
  },
  guest: {
    text: "关注者",
    value: 0x02,
    color: "#F5A623",
  },
  student: {
    text: "学生",
    value: 0x04,
    color: "#F5A623",
  },
  teacher: {
    text: "老师",
    value: 0x08,
    color: "#F5A623",
  },
  sales: {
    text: "销售",
    value: 0x10,
    color: "#F5A623",
  },
  assistant: {
    text: "教务",
    value: 0x20,
    color: "#F5A623",
  },
  master: {
    text: "校长",
    value: 0x40,
    color: "#F5A623",
  },
  operator: {
    text: "运营(平台)",
    value: 0x80,
    color: "#F5A623",
  },
  agent: {
    text: "运营(平台)",
    value: 0x100,
    color: "#F5A623",
  },
  admin: {
    text: "管理员(平台)",
    value: 0x200,
    color: "#F5A623",
  },
};

export { PersonRole };
