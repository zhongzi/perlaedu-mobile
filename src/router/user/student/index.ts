const Home = () =>
  import(/* webpackChunkName: "user" */ "@/view/user/student/Home.vue");

const Me = () =>
  import(/* webpackChunkName: "user" */ "@/view/user/student/Me.vue");

const studentRoutes: any = [
  {
    path: "students/",
    component: Home,
    name: "studentHome",
    redirect: {
      name: "student",
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "myself",
        name: "student",
        component: Me,
        meta: { title: "个人中心" },
      },
    ],
  },
];

export default studentRoutes;
