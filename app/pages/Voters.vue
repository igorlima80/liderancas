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
      <Label class="action-bar-title" text="Membros"></Label>
    </ActionBar>

    <GridLayout rows="auto,auto,*">
      <SearchBar row="0" hint="Buscar por Eleitor" :text="searchPhrase" @textChange="onTextChanged" @submit="onSubmit" />
      <Label row="1" text="Eleitores" class="font-weight-bold text-primary m-t-15 m-l-10" />
      <ActivityIndicator row="2" class="indicator" v-if="votersIndicator" :busy="votersIndicator" />
      <RadListView
        v-else
        row="2"
        class="list-group"
        ref="listView"
        for="voter in voters"
        pullToRefresh="true"
        @pullToRefreshInitiated="onPullToRefreshInitiated"
      >
        <v-template>
        <GridLayout class="list-group-item" rows="auto, *" columns="*, auto">
          <!-- <Image v-if="voter.image" row="0" col="0" :src="voter.image" class="thumb img-circle" rowSpan="2" @tap="onItemTap(voter)"/>
          <Image v-else row="0" col="0" src="~/assets/images/userimage.png" class="thumb img-circle" rowSpan="2" @tap="onItemTap(voter)"/> -->
          <Label row="0" col="0" :text="voter.name" class="list-group-item-heading" @tap="onItemTap(voter)"/>
          <Label row="1" col="0" :text="voter.address" class="list-group-item-text" @tap="onItemTap(voter)"/>
          <Label row="0" col="1" class="fas m-r-10" :text="'fa-map-marker-alt' | fonticon" style="color: #D84039" rowSpan="2" @tap="openMaps(voter.latitude, voter.longitude)" />
        </GridLayout>

          <!-- <StackLayout class="list-group-item list-style-layout">
            <Label :text="voter.name" class="list-group-item-heading"></Label>
            <Label :text="voter.address" class="list-group-item-text"></Label>
          </StackLayout>    -->
        </v-template>
      </RadListView>
      <MDFloatingActionButton
        row="2"
        rippleColor="green"
        elevation="7"
        class="btn btn-primary f-btn"
        src="res://baseline_add_white_24"
        @tap="$navigator.navigate('/addvoter')"
      />
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
  created() {
    this.$store
      .dispatch(GET_VOTERS)
      .then(() => {
        this.votersIndicator = false;
      })
      .catch(error => {});
  },
  mounted() {
    // this.$refs.listView.nativeView.focus();
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
    onItemTap(voter) {
      this.$navigator.navigate("/voter", { props: { voter: voter }})
    },
    onTap(voter) {
      this.$navigator.navigate("/visit", { props: { voter: voter }})
    },
    openMaps(latitude,longitude) {
      utils.openMaps(latitude,longitude)
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
</style>