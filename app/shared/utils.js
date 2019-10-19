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

export const loader = new LoadingIndicator();
