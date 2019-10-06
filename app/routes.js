import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings"
import Featured from "./pages/Featured"
import Notifications from "./pages/Notifications"
import Search from "./pages/Search"


export const routes = {
         "/home": {
           component: Home,
           meta: { needsAuth: true }
         },
         "/login": {
           component: Login,
           meta: { needsAuth: false }
         },
         "/signup": {
           component: Signup,
           meta: { needsAuth: false }
         },
         "/notifications": {
           component: Notifications,
           meta: { needsAuth: true }
         },
         "/featured": {
           component: Featured,
           meta: { needsAuth: true }
         },
         "/search": {
           component: Search,
           meta: { needsAuth: true }
         },
         "/settings": {
           component: Settings,
           meta: { needsAuth: true }
         }
       };
