const Home = () =>
  import(/* webpackChunkName: "crm-clue" */ "@/view/crm/clue/Home.vue");
const List = () =>
  import(/* webpackChunkName: "crm-clue" */ "@/view/crm/clue/List.vue");
const Detail = () =>
  import(/* webpackChunkName: "crm-clue" */ "@/view/crm/clue/Detail.vue");

const clueRoutes: any = [
  {
    path: "clues",
    component: Home,
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        name: "crmClueList",
        component: List,
        meta: { title: "客户线索列表" },
      },
      {
        path: ":clueId",
        name: "crmClueDetail",
        component: Detail,
        meta: { title: "客户线索详情" },
      },
    ],
  },
];

export default clueRoutes;
