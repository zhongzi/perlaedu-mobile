const Home = () =>
  import(
    /* webpackChunkName: "website-editing" */ "@/view/website/merchant/editing/Home.vue"
  );
const Editing = () =>
  import(
    /* webpackChunkName: "website-editing" */ "@/view/website/merchant/editing/Editing.vue"
  );

const Course = () =>
  import(
    /* webpackChunkName: "website-editing" */ "@/view/website/merchant/editing/Course.vue"
  );

const Album = () =>
  import(
    /* webpackChunkName: "website-editing" */ "@/view/website/merchant/editing/Album.vue"
  );

const Article = () =>
  import(
    /* webpackChunkName: "website-editing" */ "@/view/website/merchant/editing/Article.vue"
  );

const Video = () =>
  import(
    /* webpackChunkName: "website-editing" */ "@/view/website/merchant/editing/Video.vue"
  );

const Teacher = () =>
  import(
    /* webpackChunkName: "website-editing" */ "@/view/website/merchant/editing/Teacher.vue"
  );

const editingRoutes: any = [
  {
    path: "editing",
    component: Home,
    redirect: {
      name: "websiteEditing",
    },
    meta: {
      requireOpenid: true,
      requireAuth: true,
      hideMenu: true,
    },
    children: [
      {
        path: "",
        name: "websiteEditing",
        component: Editing,
        meta: { title: "机构设置" },
      },
      {
        path: "courses/:courseId",
        name: "websiteEditingCourse",
        component: Course,
        meta: { title: "机构设置-课程" },
      },
      {
        path: "albums/:albumId",
        name: "websiteEditingAlbum",
        component: Album,
        meta: { title: "机构设置-相册" },
      },
      {
        path: "articles/:articleId",
        name: "websiteEditingArticle",
        component: Article,
        meta: { title: "机构设置-动态" },
      },
      {
        path: "videos/:videoId",
        name: "websiteEditingVideo",
        component: Video,
        meta: { title: "机构设置-视频" },
      },
      {
        path: "teachers/:teacherId",
        name: "websiteEditingTeacher",
        component: Teacher,
        meta: { title: "机构设置-师资" },
      },
    ],
  },
];

export default editingRoutes;
