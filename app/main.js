import Vue from 'nativescript-vue'
import RadSideDrawer from 'nativescript-ui-sidedrawer/vue'
import VueDevtools from 'nativescript-vue-devtools'
import Navigator from 'nativescript-vue-navigator'
import { TNSFontIcon, fonticon } from "nativescript-fonticon";
import firebaseService from '~/services/firebase';
import DrawerContent from "./components/DrawerContent";
import App from './components/App'
import {routes} from './routes'
import store from './store'

Vue.use(RadSideDrawer)
Vue.use(Navigator, { routes })
if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}

Vue.registerElement(
  'CardView',
  () => require('@nstudio/nativescript-cardview').CardView
);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

TNSFontIcon.paths = {
  fa: "./assets/css/font-awesome.css"
};
TNSFontIcon.loadCss();
Vue.filter("fonticon", fonticon);

firebaseService.init();

new Vue({
  store,
  render (h) {
      return h(
        App,
        [
          h(DrawerContent, { slot: 'drawerContent' }),
          h({ slot: 'mainContent' })
        ]
      )
    }
}).$start()
