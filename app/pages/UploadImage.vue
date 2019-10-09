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
      <Label class="action-bar-title" text="Carregar Imagem"></Label>
    </ActionBar>

    <GridLayout rows="*,auto" class="page-content">
      <CardView margin="2" elevation="7" radius="7" row="0">
        <Image ref="cameraImage" :src="pictureFromCamera"></Image>
      </CardView>
      <Button row="1" text="Tirar foto" class="btn btn-primary" marginTop="20" @tap="takePicture"></Button>
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import * as camera from "nativescript-camera";
import { Image } from "tns-core-modules/ui/image";
import SelectedPageService from "../shared/selected-page-service";
import { LOGOUT } from "~/store/actions.type";
import { Feedback } from "nativescript-feedback";
const feedback = new Feedback();

export default {
  data() {
    return {
      pictureFromCamera: "",
      textPicture: "Take a Picture"
    };
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
    takePicture() {
      if (camera.isAvailable()) {
        camera.requestPermissions().then(
          function success() {
            // permission request accepted or already granted
            camera
              .takePicture({
                saveToGallery: false,
                width: 300,
                height: 300,
                keepAspectRatio: true
              })
              .then(imageAsset => {
                console.log("Result is an image asset instance:" + imageAsset.android);
                this.pictureFromCamera = imageAsset.android;
              })
              .catch(err => {
                console.log("Error -> " + err.message);
              });
          },
          function failure() {
            alert("Sem permissão para acessar a camera!");
          }
        );
      } else {
          alert("O dispositivo não possui camera!");
      }
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