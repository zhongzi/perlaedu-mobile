const Home = () =>
  import(/* webpackChunkName: "website" */ "@/view/website/union/Home.vue");

const Union = () =>
  import(/* webpackChunkName: "website" */ "@/view/website/union/Union.vue");

const Course = () =>
  import(
    /* webpackChunkName: "website" */ "@/view/website/merchant/Course.vue"
  );

const Article = () =>
  import(
    /* webpackChunkName: "website" */ "@/view/website/merchant/Article.vue"
  );

const unionRoutes: any = [
  {
    path: "unions/:unionId",
    component: Home,
    name: "websiteUnionHome",
    redirect: {
      name: "websiteUnion",
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        name: "websiteUnion",
        component: Union,
        meta: { title: "线上综合体官网" },
      },
      {
        path: "courses/:courseId",
        name: "websiteUnionCourse",
        component: Course,
        meta: { title: "课程详情" },
      },
      {
        path: "articles/:articleId",
        name: "websiteUnionArticle",
        component: Article,
        meta: { title: "最新动态" },
      },
    ],
  },
];

export default unionRoutes;
