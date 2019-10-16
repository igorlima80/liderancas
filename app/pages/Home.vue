<template>
  <Page class="page" @loaded="pageLoaded()" @unloaded="pageUnLoaded()">
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
    <GridLayout rows="auto,auto,*,auto,*" class="page-content">
      <CardView margin="0" elevation="7" radius="7" class="list-group" row="0">
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
      <Label text="Membros recentes" class="font-weight-bold text-primary m-t-20" row="1" />
      <ActivityIndicator
        class="indicator"
        row="2"
        v-if="membersIndicator"
        :busy="membersIndicator"
      />
      <Pager
        v-else
        for="member in members"
        row="2"
        transformers="scale"
        showIndicator="true"
        spacing="1%"
        peaking="5%"
      >
        <v-template>
          <CardView elevation="7" radius="10" class="m-y-30 m-x-5">
            <GridLayout class rows="auto, *" columns="*">
              <Label row="0" :text="member.name" />
              <Label row="1" :text="member.address" />
            </GridLayout>
          </CardView>
        </v-template>
      </Pager>
      <Label text="Visitas marcadas" class="font-weight-bold text-primary" row="3" />
      <ActivityIndicator class="indicator" row="4" v-if="visitsIndicator" :busy="visitsIndicator" />
      <Pager
        v-else
        for="visit in visits"
        row="4"
        transformers="scale"
        showIndicator="true"
        spacing="1%"
        peaking="5%"
      >
        <v-template>
          <CardView elevation="7" radius="10" class="m-y-30 m-x-5">
            <GridLayout class rows="auto, *" columns="*">
              <Label row="0" :text="visit.description" />
              <Label row="1" :text="visit.address" />
            </GridLayout>
          </CardView>
        </v-template>
      </Pager>
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import { mapGetters } from "vuex";
import SelectedPageService from "../shared/selected-page-service";
import orientationModule from "nativescript-screen-orientation";
import LoginService from "~/services/LoginService";
import {
  FETCH_USER,
  GET_NOTIFICATIONS,
  GET_MEMBERS,
  GET_VISITS
} from "~/store/actions.type";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
const loginService = new LoginService();

export default {
  data() {
    return {
      membersIndicator: true,
      visitsIndicator: true
    };
  },
  created() {   
    // if (loginService.isLoggedIn()) {
    //   if (getConnectionType() === connectionType.none) {
    //     alert({
    //       title: "Lideranças",
    //       message:
    //         "Não foi possivei carregar os dados do usuário. Sem conexão com a internet. Tente mais tarde.",
    //       okButtonText: "OK"
    //     });
    //     this.$navigator.navigate("/login", {
    //       clearHistory: true
    //     });
    //   }
    //   return;
    // }

    this.$store
      .dispatch(FETCH_USER)
      .then(() => {
        this.userIndicator = false;
      })
      .catch(error => {
        utils.loader.hide();
        alert({
          title: "lideranças",
          message:
            "Não foi possivei carregar os dados do usuário.Tente mais tarde.",
          okButtonText: "OK"
        });
        this.$navigator.navigate("/login", {
          clearHistory: true
        });
        return;
      });

    this.$store
      .dispatch(GET_MEMBERS)
      .then(() => {
        this.membersIndicator = false;
      })
      .catch(error => {});
    this.$store
      .dispatch(GET_VISITS)
      .then(() => {
        this.visitsIndicator = false;
      })
      .catch(error => {});
    this.$store
      .dispatch(GET_NOTIFICATIONS)
      .then(() => {})
      .catch(error => {});
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
  },
  computed: { ...mapGetters(["user", "members", "visits"]) },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    pageLoaded() {
      orientationModule.setCurrentOrientation("portrait");
      utils.gesturesEnabled(true);
    },
    pageUnLoaded() {
      orientationModule.orientationCleanup();
    },
    onItemLeadershipTap() {
      this.$navigator.navigate("/leaders");
    },
    onItemVisitTap() {
      this.$navigator.navigate("/visits");
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../assets/scss/app-variables";
// End custom common variables

// Custom styles
.fas {
  font-size: 18;
}

.indicator {
  width: 32;
  height: 32;
}

.page {
  background-color: $background-light;
}
</style>