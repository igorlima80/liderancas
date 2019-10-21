import { getRootView } from "tns-core-modules/application";
let LoadingIndicator = require("@nstudio/nativescript-loading-indicator")
  .LoadingIndicator;

export const showDrawer = () => {
  let drawerNativeView = getRootView();
  if (drawerNativeView && drawerNativeView.showDrawer) {
    drawerNativeView.showDrawer();
  }
};

export const closeDrawer = () => {
  let drawerNativeView = getRootView();
  if (drawerNativeView && drawerNativeView.showDrawer) {
    drawerNativeView.closeDrawer();
  }
};

export const gesturesEnabled = v => {
  let drawerNativeView = getRootView();
  if (drawerNativeView) {
    drawerNativeView.gesturesEnabled = v;
  }
};

const loaderIndicator = new LoadingIndicator();

const options = {
  // message: 'Loading...',
  // details: 'Additional detail note!',
  // progress: 0.65,
  margin: 10,
  dimBackground: true,
  // color: '#4B9ED6', 
  // color of indicator and labels
  // background box around indicator
  // hideBezel will override this if true
  // backgroundColor: 'yellow',
  userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
  // hideBezel: false, 
  // default false, can hide the surrounding bezel
  // mode: Mode.AnnularDeterminate, // see options below
};

export const loader = {
  show(){
    loaderIndicator.show(options);
  },
  hide(){
    loaderIndicator.hide();
  }
}