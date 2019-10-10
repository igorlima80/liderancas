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

    <GridLayout rows="auto,auto,*,auto,*" class="page-content">
      <CardView margin="2" elevation="7" radius="7" class="list-group" row="0">
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
      <Label text="Lideranças recentes" class="font-weight-bold text-primary m-t-20" row="1" />
      <ListView
        for="leadership in leaders"
        @itemTap="onItemLeadershipTap"
        class="list-group"
        row="2"
      >
        <v-template>
          <GridLayout rows="auto, auto" columns="auto, *" class="list-group-item">
            <Label
              row="0"
              col="0"
              rowSpan="2"
              :text="'fa-bullhorn' | fonticon"
              class="fas text-primary m-r-20"
            ></Label>
            <Label
              row="0"
              col="1"
              :text="leadership.name"
              class="list-group-item-heading text-primary"
            />
            <Label row="1" col="1" :text="leadership.address" class="" />
          </GridLayout>
        </v-template>
      </ListView>
      <Label text="Visitas marcadas" class="font-weight-bold text-primary" row="3" />
      <ListView for="visit in visits" @itemTap="onItemVisitTap" class="list-group" row="4">
        <v-template>
          <GridLayout rows="auto, auto" columns="auto, *" class="list-group-item">
            <Label
              row="0"
              col="0"
              rowSpan="2"
              :text="'fa-map-marked-alt' | fonticon"
              class="fas text-primary m-r-20"
            ></Label>
            <Label row="0" col="1" :text="visit.description" class="list-group-item-heading text-primary" />
            <Label row="1" col="1">
              <FormattedString>
                <Span>{{visit.address}}  </Span>
                <Span class="font-weight-bold">Data: {{visit.date}}</Span>
              </FormattedString>
            </Label>
          </GridLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import { mapGetters } from "vuex";
import SelectedPageService from "../shared/selected-page-service";
import orientationModule from "nativescript-screen-orientation";
import { GET_LEADERS, GET_VISITS } from "~/store/actions.type";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";

export default {
  data() {
    return {
    };
  },
  created() {
    this.$store
      .dispatch(GET_LEADERS)
      .then(() => {})
      .catch(error => {});
    this.$store
      .dispatch(GET_VISITS)
      .then(() => {})
      .catch(error => {});
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
  },
  computed: { ...mapGetters(["user", "leaders", "visits"]) },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    pageLoaded() {
      orientationModule.orientationCleanup();
      utils.gesturesEnabled(true);
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
</style>