import Login from "@/page/Login";
import {lazy} from "react";
import{createBrowserRouter} from "react-router-dom";
import NotFound from "../page/NotFound";
import Register from "../page/Register";
import Article from "../page/Article";
import {AuthRoute} from "@/components/AuthRoute";
import { Suspense } from "react";
const Home = lazy(() => import("@/page/Home"))
const Addarticle = lazy(() => import("@/page/Addarticle"))
const Editarticle = lazy(() => import("@/page/Editarticle"))
const Mine = lazy(() => import("@/page/Mine"))
const Minearticle = lazy(() => import("@/page/Minearticle"))
const Mineinfo = lazy(() => import("@/page/Mineinfo"))
const Personainfor = lazy(() => import("@/page/Personainfor"))
const Push = lazy(() => import("@/page/Push"))
const Articlecontainer = lazy(() => import("@/page/Ariticlecontainer"))
const router = createBrowserRouter([
      {
        path:"/",
        element:<Login />
      },
      {
        path:"/register",
        element:<Register />
      },
      {
        path:"/article",
        element:<AuthRoute><Article /></AuthRoute>,
        children:[
            {
              path:"addArticle",
              element:<Suspense fallback={'加载中'}><Addarticle /></Suspense>
            },
            {
              path:"editArticle",
              element:<Suspense fallback={'加载中'}><Editarticle /></Suspense>
            },
            {
              path:"home",
              element:<Suspense fallback={'加载中'}><Home /></Suspense>
            },
            {
              path:"push",
              element:<Suspense fallback={'加载中'}><Push/></Suspense>
            },
            {
              path:"mine",
              element:<Suspense fallback={'加载中'}><Mine/></Suspense>
            },
            {
              path:"mineArticle",
              element:<Suspense fallback={'加载中'}><Minearticle /></Suspense>
            },
            {
              path:"mineInfo",
              element:<Suspense fallback={'加载中'}><Mineinfo /> </Suspense>
            },
            {
              path:"persona",
              element:<Suspense fallback={'加载中'}><Personainfor /></Suspense>
            },
            {
              path:"articlecontainer",
              element:<Suspense fallback={'加载中'}><Articlecontainer /> </Suspense>
            }

        ]
      },
      {
        path:"*",
        element:<NotFound />
      }

])//配置嵌套路由
export default router