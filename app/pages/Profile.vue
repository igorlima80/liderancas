<template>
  <Page class="page" @loaded="pageLoaded()">
    <ActionBar class="action-bar">
      <!-- 
            Use the NavigationButton as a side-drawer button in Android
            because ActionItems are shown on the right side of the ActionBar
      -->
      <NavigationButton
        ios:visibility="collapsed"
        icon="res://baseline_menu_white_24"
        @tap="onDrawerButtonTap"
      ></NavigationButton>
      <!-- 
            Use the ActionItem for IOS with position set to left. Using the
            NavigationButton as a side-drawer button in iOS is not possible,
            because its function is to always navigate back in the application.
      -->
      <ActionItem
        icon="res://navigation/menu"
        android:visibility="collapsed"
        @tap="onDrawerButtonTap"
        ios.position="left"
      ></ActionItem>
      <Label class="action-bar-title" text="Conta"></Label>
    </ActionBar>

    <GridLayout class="page-content">
      <Button text="Sair" @tap="logout" class="btn btn-primary" />
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import { LOGOUT } from "~/store/actions.type";
import { Feedback } from "nativescript-feedback";
const feedback = new Feedback();

export default {
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Profile");
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    pageLoaded() {
      //   orientationModule.orientationCleanup();
      //   utils.gesturesEnabled(true);
    },
    logout() {
      confirm({
        title: "Sair",
        message: "Você realmente deseja sair do Saúde+?",
        okButtonText: "Sair",
        cancelButtonText: "Cancelar"
      }).then(result => {
        if (result) {
          utils.loader.show({
            message: "Fazendo Logout..."
          });
          this.$store.dispatch(LOGOUT);
          this.$navigator.navigate("/login", {
            clearHistory: true
          });
          utils.loader.hide();
          feedback.success({
            message: "Logout efetuado com sucesso."
          });

          // feedback.success({
          //   message: "Você foi deslogado com sucesso."
          // });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../assets/scss/app-variables";
// End custom common variables

// Custom styles
</style>