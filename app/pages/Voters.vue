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
      <Label class="action-bar-title" text="Eleitores"></Label>
    </ActionBar>

    <GridLayout class="page-content">
      <!-- <ActivityIndicator class="indicator" v-if="votersIndicator" :busy="votersIndicator" /> -->
      <RadListView
        ref="listView"
        for="voter in voters"
        pullToRefresh="true"
        @itemTap="onItemTap"
        @pullToRefreshInitiated="onPullToRefreshInitiated"
      >
        <v-template>
          <StackLayout class="item" orientation="vertical">
            <Label :text="voter.name" class="nameLabel"></Label>
            <Label :text="voter.description" class="descriptionLabel"></Label>
          </StackLayout>
        </v-template>
      </RadListView>
      <MDFloatingActionButton rippleColor="green" class="btn btn-primary f-btn" src="res://baseline_add_white_24"/>
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import { mapGetters } from "vuex";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { GET_VOTERS } from "~/store/actions.type";
import { Feedback } from "nativescript-feedback";
const feedback = new Feedback();

export default {
  data() {
    return {
      votersIndicator: true,
      listVoters: new ObservableArray(this.voters)
    };
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Voters");
  },
  computed: { ...mapGetters(["voters"]) },
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
          .dispatch(GET_VOTERS)
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
.f-btn{
  position: fixed;
  bottom: 30px;
  right: 30px;
}
</style>