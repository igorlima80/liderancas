import Home from "./pages/Home";
import Login from "./pages/Login";
// import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Leaders from "./pages/Leaders";
import Members from "./pages/Members";
import Visits from "./pages/Visits";
import UserUpdate from "./pages/UserUpdate.vue"

export const routes = {
  "/home": {
    component: Home,
    meta: { needsAuth: true }
  },
  "/login": {
    component: Login,
    meta: { needsAuth: false }
  },
  "/user-update": {
    component: UserUpdate,
    meta: { needsAuth: true }
  },
  //  "/signup": {
  //    component: Signup,
  //    meta: { needsAuth: false }
  //  },
  "/notifications": {
    component: Notifications,
    meta: { needsAuth: true }
  },
  "/leaders": {
    component: Leaders,
    meta: { needsAuth: true }
  },
  "/members": {
    component: Members,
    meta: { needsAuth: true }
  },
  "/visits": {
    component: Visits,
    meta: { needsAuth: true }
  },
  "/settings": {
    component: Settings,
    meta: { needsAuth: true }
  }
};
