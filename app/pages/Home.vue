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
      <Label class="action-bar-title" text="Início"></Label>
    </ActionBar>
    <GridLayout rows="auto,auto,*,auto,*" class="page-content">
      <MDCardView rippleColor="transparent" elevation="2" class="list-group" row="0">
        <ActivityIndicator class="indicator" v-if="userIndicator" :busy="userIndicator" />
        <GridLayout v-else rows="auto, auto" columns="auto, *" class="list-group-item">
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
          <Label row="0" col="1" text="Olá," class="list-group-item-heading font-weight-bold" />
          <Label row="1" col="1" :text="user.user.name" class="list-group-item-heading" />
          <!-- <Label row="1" col="1" :text="user.user.email" class="list-group-item-text" /> -->
        </GridLayout>
      </MDCardView>
      <Label text="Membros cadastrados recentemente" class="font-weight-bold text-primary m-t-20 m-l-15" row="1" />
      <ActivityIndicator class="indicator" row="2" v-if="votersIndicator" :busy="votersIndicator" />
      <Pager
        v-else
        for="voter in recent_voters"
        row="2"
        transformers="scale"
        showIndicator="true"
        spacing="1%"
        peaking="5%"
      >
        <v-template>
          <MDCardView rippleColor="transparent" elevation="2" class="m-y-30 m-x-5">
            <StackLayout class="m-20" verticalAlignment="center">
              <Label :text="'fa-shoe-prints' | fonticon" class="fas text-right" :class="{visited: voter.status}"/>
              <Image
                v-if="voter.image"
                :src="voter.image"
                class="thumb img-circle"
                horizontalAlignment="center"
                @tap="onVoterCardTap(voter)"
              />
              <Image
                v-else
                src="~/assets/images/userimage.png"
                class="thumb img-circle"
                horizontalAlignment="center"
                @tap="onVoterCardTap(voter)"
              />
              <Label
                class="text-center font-weight-bold m-t-10"
                :text="voter.name"
                textWrap="true"
                @tap="onVoterCardTap(voter)"
              />
              <Label textWrap="true" class="fas text-center m-t-30 p-y-5" @tap="openMaps(voter.latitude, voter.longitude)">
              <FormattedString>
                <Span :text="voter.address"/>
                <Span text="  "/>
                <Span :text="'fa-map-marker-alt' | fonticon" style="color: #D84039" />
              </FormattedString>
            </Label>
            </StackLayout>
          </MDCardView>
        </v-template>
      </Pager>
      <Label text="Membros próximos" class="font-weight-bold text-primary m-l-15" row="3" />
      <ActivityIndicator class="indicator" row="4" v-if="nearVoterIndicator" :busy="nearVoterIndicator" />
      <Pager
        v-else
        for="voter in near_voters"
        row="4"
        transformers="scale"
        showIndicator="true"
        spacing="1%"
        peaking="5%"
      >
        <v-template>
          <MDCardView rippleColor="transparent" elevation="2" class="m-y-30 m-x-5">
            <StackLayout class="m-20" verticalAlignment="center">
              <Label :text="'fa-shoe-prints' | fonticon" class="fas text-right" :class="{visited: voter.status}"/>
              <Image
                v-if="voter.image"
                :src="voter.image"
                class="thumb img-circle"
                horizontalAlignment="center"
                @tap="onNearVoterCardTap(voter)"
              />
              <Image
                v-else
                src="~/assets/images/userimage.png"
                class="thumb img-circle"
                horizontalAlignment="center"
                @tap="onNearVoterCardTap(voter)"
              />
              <Label
                class="text-center font-weight-bold m-t-10"
                :text="voter.name"
                textWrap="true"
                @tap="onNearVoterCardTap(voter)"
              />
              <Label textWrap="true" class="fas text-center m-t-30 p-y-5" @tap="openMaps(voter.latitude, voter.longitude)">
              <FormattedString>
                <Span :text="voter.address"/>
                <Span text="  "/>
                <Span :text="'fa-map-marker-alt' | fonticon" style="color: #D84039" />
              </FormattedString>
            </Label>
            </StackLayout>
          </MDCardView>
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
const geolocation = require("nativescript-geolocation");
const { Accuracy } = require("tns-core-modules/ui/enums");
import {
  FETCH_USER,
  GET_VOTERS
} from "~/store/actions.type";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
const loginService = new LoginService();

export default {
  data() {
    return {
      votersIndicator: true,
      nearVoterIndicator: true,
      userIndicator: true,
      lat: "",
      lon: ""
    };
  },
  created() {
    this.getLocation();
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
      .dispatch(GET_VOTERS)
      .then(() => {
        this.votersIndicator = false;
        this.nearVoterIndicator = false;
      })
      .catch(error => {});
  },
  mounted() {
    geolocation.enableLocationRequest();
    SelectedPageService.getInstance().updateSelectedPage("Home");
  },
  computed: { ...mapGetters(["user", "recent_voters", "near_voters"]) },
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
      this.$navigator.navigate("/voters");
    },
    onItemVisitTap() {
      this.$navigator.navigate("/visits");
    },
    openMaps(latitude,longitude) {
      utils.openMaps(latitude,longitude)
    },
    onVoterCardTap(voter){
      this.$navigator.navigate("/voter", { props: { voter: voter }})
    },
    onNearVoterCardTap(voter){
      this.$navigator.navigate("/visit", { props: { voter: voter }})
    },
    getLocation() {
          geolocation
              .getCurrentLocation({
                  desiredAccuracy: Accuracy.high,
                  maximumAge: 5000,
                  timeout: 20000
              })
              .then(res => {
                  this.lat = res.latitude;
                  this.lon = res.longitude;
                  console.log(`${this.lat} , ${this.lon}`)
                  // this.speed = res.speed;
                  // get the address (REQUIRES YOUR OWN GOOGLE MAP API KEY!)
                  // fetch(
                  //     "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
                  //         res.latitude +
                  //         "," +
                  //         res.longitude +
                  //         "&key=YOUR-API-KEY"
                  // )
                  //     .then(response => response.json())
                  //     .then(r => {
                  //         this.addr = r.results[0].formatted_address;
                  //     });
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
.fas {
  font-size: 18;
}

.icon-action {
  font-size: 38px;
  text-align: center;
}

.visited{
  color: $warning-light 
}
.thumb {
  height: 70;
  width: 70;
  border-radius: 50%;
}
.page {
  background-color: $background-light;
}
</style>