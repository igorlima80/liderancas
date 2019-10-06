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
import { FETCH_USER, GET_NOTIFICATIONS } from "~/store/actions.type";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
const loginService = new LoginService();

export default {
  created() {
    if (loginService.isLoggedIn()) {
      if (getConnectionType() === connectionType.none) {
        alert({
          title: "Saúde+",
          message:
            "Não foi possivei carregar os dados do usuário. Sem conexão com a internet.Tente mais tarde.",
          okButtonText: "OK"
        });
        this.$navigator.navigate("/login", {
          clearHistory: true
        });
      }
      utils.loader.show({
        message: "Carregando dados do usuário..."
      });

      this.$store
        .dispatch(FETCH_USER)
        .then(() => {
          // utils.loader.hide();
        })
        .catch(error => {
          utils.loader.hide();
          alert({
            title: "Saúde+",
            message:
              "Não foi possivei carregar os dados do usuário.Tente mais tarde.",
            okButtonText: "OK"
          });
          this.$navigator.navigate("/login", {
            clearHistory: true
          });
        });

      // utils.loader.show();
      this.$store
        .dispatch(GET_NOTIFICATIONS)
        .then(() => {
          utils.loader.hide();
        })
        .catch(error => {
          utils.loader.hide();
          alert({
            title: "Saúde+",
            message:
              "Não foi possivei carregar as notificações do usuário. Tente mais tarde.",
            okButtonText: "OK"
          });
        });
    }
  },
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
