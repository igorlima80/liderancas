<template lang="html">
  <RadSideDrawer ref="drawer" drawerLocation="Left" :drawerTransition="transition">
    <StackLayout ~drawerContent backgroundColor="#ffffff">
      <slot name="drawerContent"></slot>
    </StackLayout>
    <Navigator :defaultRoute="isLoggedIn() ? '/home' : '/login'" ~mainContent ref="drawerMainContent" >
      <slot name="mainContent"></slot>
    </Navigator>
  </RadSideDrawer>
</template>

<script>
import * as utils from "~/shared/utils";
import LoginService from "~/services/LoginService";
import { SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
const loginService = new LoginService();

export default {
  data() {
    return {
      transition: new SlideInOnTopTransition()
    };
  },
  methods: {
    isLoggedIn() {
      return loginService.isLoggedIn();
    }
  }
};
</script>

<style lang="css">
</style>
