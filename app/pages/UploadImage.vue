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
      <Image ref="cameraImage" row="1" col="0" colSpan="2" class="preview" loadMode="async" />
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
const imageSourceModule = require("tns-core-modules/image-source");
import * as imagepicker from "nativescript-imagepicker";
let ImageCropper = require("nativescript-imagecropper").ImageCropper;
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
                let source = new imageSourceModule.ImageSource();
                source.fromAsset(imageAsset).then(source => {
                  self.editPicture(source);
                });
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
    editPicture(imageSource) {
      let imageCropper = new ImageCropper();
      imageCropper
        .show(imageSource, { width: 300, height: 300 })
        .then(args => {
          console.dir(args);
          if (args.image !== null) {
            this.setImageAsset(args.image);
          }
        })
        .catch(function(e) {
          console.dir(e);
        });
    },
    startSelection(context) {
      let self = this;
      context
        .authorize()
        .then(() => {
          this.imageAssets = [];
          return context.present();
        })
        .then(selection => {
          console.log("Selection done: " + JSON.stringify(selection[0]));
          selection.forEach(function(selected) {
            let source = new imageSourceModule.ImageSource();
            source.fromAsset(selected).then(source => {
              self.editPicture(source);
            });
          });
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