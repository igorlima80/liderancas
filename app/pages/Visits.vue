<template>
  <Page class="page">
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
      <Label class="action-bar-title" text="Visitas"></Label>
    </ActionBar>

    <GridLayout class="page-content">
      <!-- <ActivityIndicator class="indicator" v-if="visitsIndicator" :busy="visitsIndicator" /> -->
      <RadListView
        class="list-group"
        ref="listView"
        for="visit in visits"
        pullToRefresh="true"
        @itemTap="onItemTap"
        @pullToRefreshInitiated="onPullToRefreshInitiated"
      >
        <v-template name="header">
          <Label text="Visitas" class="font-weight-bold text-primary" />
        </v-template>
        <v-template>
          <StackLayout class="list-group-item">
            <Label :text="visit.description" class="list-group-item-heading"></Label>
            <Label :text="visit.address" class="list-group-item-text"></Label>
            <StackLayout class="hr-light"></StackLayout>
          </StackLayout>
        </v-template>
      </RadListView>
      <MDFloatingActionButton
        rippleColor="green"
        elevation="7"
        class="btn btn-primary f-btn"
        src="res://baseline_add_white_24"
      />
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import { mapGetters } from "vuex";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { GET_VISITS } from "~/store/actions.type";

export default {
  data() {
    return {
      visitsIndicator: true,
      listVisits: new ObservableArray(this.visits)
    };
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Visits");
  },
  computed: { ...mapGetters(["visits"]) },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    onPullToRefreshInitiated({ object }) {
      console.log("Pulling...");
      // in order to avoid race conditions (only on iOS),
      // in which the UI may not be completely updated here
      // we use this.$nextTick call
      this.$nextTick(() => {
        this.$store
          .dispatch(GET_VISITS)
          .then(() => {})
          .catch(error => {});
        object.notifyPullToRefreshFinished();
      });
    },
    onItemTap({ item }) {
      console.log(`Tapped on ${item.name}`);
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../assets/scss/app-variables";
// End custom common variables

// Custom styles
.f-btn {
  horizontal-align: right;
  vertical-align: bottom;
}

.page-content{
  padding: 20;
}
</style>
