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

    <GridLayout rows="auto,*,auto" columns="auto,*" class="page-content">
      <Button row="0" col="0" text="Tirar uma foto" class="btn btn-primary" @tap="takePicture" />
      <Button
        row="0"
        col="1"
        text="Carregar do arquivo"
        class="btn btn-primary"
        @tap="uploadPicture"
      />
      <Image ref="cameraImage" row="1" col="0" colSpan="2" class="preview" loadMode="async"/>
      <Button
        row="2"
        colSpan="2"
        col="0"
        text="Enviar foto"
        class="btn btn-primary"
        @tap="updateAvatar"
      />
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import * as camera from "nativescript-camera";
import { Image } from "tns-core-modules/ui/image";
import * as imagepicker from "nativescript-imagepicker";
import SelectedPageService from "../shared/selected-page-service";
import { LOGOUT } from "~/store/actions.type";
import { Feedback } from "nativescript-feedback";
const feedback = new Feedback();

export default {
  data() {
    return {
      isSingleMode: true,
      imageAssets: [],
      imageWidth: 300,
      imageHeight: 300
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
      let self = this;
      if (camera.isAvailable()) {
        camera.requestPermissions().then(
          function success() {
            // permission request accepted or already granted
            camera
              .takePicture({
                saveToGallery: false,
                width: self.imageWidth,
                height: self.imageHeight,
                keepAspectRatio: true
              })
              .then(imageAsset => {
                console.log(
                  "Result is an image asset instance:" + imageAsset.android
                );
                self.setImageAsset(imageAsset);
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
    },
    uploadPicture() {
      this.isSingleMode = true;
      let context = imagepicker.create({ mode: "single", mediaType: "Image" });
      this.startSelection(context);
    },
    startSelection(context) {
      context
        .authorize()
        .then(() => {
          this.imageAssets = [];
          return context.present();
        })
        .then(selection => {
          console.log("Selection done: " + JSON.stringify(selection[0]));
          // set the images to be loaded from the assets with optimal sizes (optimize memory usage)
          selection.forEach(element => {
            element.options.width = this.imageWidth;
            element.options.height = this.imageHeight;
          });
          this.setImageAsset(selection[0]);
        })
        .catch(function(e) {
          console.log(e);
        });
    },
    updateAvatar() {},
    setImageAsset(imageAsset) {
      this.$refs.cameraImage.nativeView.src = imageAsset;
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../assets/scss/app-variables";
// End custom common variables

// Custom styles
.preview {
  // width: 70%;
  // height: 70%;
  border-radius: 50%;
}
</style>