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
      <Label class="action-bar-title" text="Dashboard"></Label>
    </ActionBar>

    <StackLayout class="page-content">
      <CardView margin="1" elevation="10" radius="7" class="list-group">
        <GridLayout rows="auto, auto" columns="80, *" class="list-group-item">
          <Image
            v-if="user.image"
            :src="user.image"
            row="0"
            col="0"
            class="thumb img-circle"
            rowSpan="2"
          />
          <Image
            v-else
            src="~/assets/images/userimage.png"
            row="0"
            col="0"
            class="thumb img-circle"
            rowSpan="2"
          />
          <Label row="0" col="1" :text="user.name" class="list-group-item-heading" />
          <Label row="1" col="1" :text="user.email" class="list-group-item-text" />
        </GridLayout>
      </CardView>
      <Label row="0" col="0" text="Lideranças" class="font-weight-bold text-primary m-y-15" />
      <ListView for="leadership in leaders" @itemTap="onItemLeadershipTap" class="list-group">
        <v-template>
          <GridLayout rows="auto, auto" columns="auto, *" class="list-group-item">
            <Label row="0" col="0" rowSpan="2" :text="'fa-bullhorn' | fonticon" class="fas text-primary m-r-20"></Label>
            <Label row="0" col="1" :text="leadership.name" class="list-group-item-heading text-primary" />
            <Label row="1" col="1" :text="leadership.address" class="list-group-item-text" />
          </GridLayout>
        </v-template>
      </ListView>
    </StackLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import { mapGetters } from "vuex";
import SelectedPageService from "../shared/selected-page-service";
import orientationModule from "nativescript-screen-orientation";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";

export default {
  data() {
    return {
      leaders: [
        {
          name: "Associação do bairro Mafua",
          address: "Rua Magalhães Filho, 1120"
        },
        {
          name: "Fundação X",
          address: "Rua primeiro de Maio, 1547"
        },
        {
          name: "Casa Y",
          address: "Praça Pedro II, S/N"
        }
      ]
    }
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
  },
  computed: { ...mapGetters(["user"]) },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    pageLoaded() {
      orientationModule.orientationCleanup();
      utils.gesturesEnabled(true);
    },
    onItemLeadershipTap(){
      this.$navigator.navigate("/leaders")
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../assets/scss/app-variables";
// End custom common variables

// Custom styles
.fas{
  font-size: 18;
}
</style>