const Home = () =>
  import(/* webpackChunkName: "notice" */ "@/view/notice/Home.vue");
const Dashboard = () =>
  import(/* webpackChunkName: "notice" */ "@/view/notice/Dashboard.vue");
const Editing = () =>
  import(/* webpackChunkName: "notice" */ "@/view/notice/Editing.vue");
const Detail = () =>
  import(/* webpackChunkName: "notice" */ "@/view/notice/Detail.vue");
const DetailRecipient = () =>
  import(/* webpackChunkName: "notice" */ "@/view/notice/DetailRecipient.vue");
const ListNotice = () =>
  import(/* webpackChunkName: "notice" */ "@/view/notice/ListNotice.vue");
const ListRecipient = () =>
  import(/* webpackChunkName: "notice" */ "@/view/notice/ListRecipient.vue");
const ListRecipientLog = () =>
  import(/* webpackChunkName: "notice" */ "@/view/notice/ListRecipientLog.vue");

const noticeRoutes: any = [
  {
    path: "/notice",
    component: Home,
    redirect: {
      name: "noticeDashboard",
    },
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: "dashboard",
        name: "noticeDashboard",
        component: Dashboard,
        meta: {
          title: "通知中心",
          requireManager: true,
          hideCopyright: true,
        },
      },
      {
        path: "notices/:noticeId/editing",
        name: "noticeEditing",
        component: Editing,
        meta: {
          title: "编辑通知",
          requireManager: true,
        },
      },
      {
        path: "notices/:noticeId",
        name: "noticeDetail",
        component: Detail,
        meta: {
          title: "通知详情",
          requireManager: true,
          hideCopyright: true,
        },
      },
      {
        path: "recipients/:recipientId",
        name: "noticeRecipient",
        component: DetailRecipient,
        meta: {
          title: "通知详情",
        },
      },
      {
        path: "notices",
        name: "notices",
        component: ListNotice,
        meta: {
          title: "全部通知",
          hideCopyright: true,
        },
      },
      {
        path: "notice-recipients",
        name: "noticeRecipients",
        component: ListRecipient,
        meta: {
          title: "全部接收者明细",
          requireManager: true,
        },
      },
      {
        path: "notice-recipient-logs",
        name: "noticeRecipientLogs",
        component: ListRecipientLog,
        meta: {
          title: "全部发送明细",
          requireManager: true,
        },
      },
    ],
  },
];

export default noticeRoutes;
