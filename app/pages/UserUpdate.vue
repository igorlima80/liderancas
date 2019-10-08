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
      <Label class="action-bar-title" text="Atualizar Cadastro"></Label>
    </ActionBar>

    <GridLayout class="page-content" rows="*,auto" columns="*,*">
      <RadDataForm :source="user" :metadata="userMetadata" row="0" col="0" colSpan="2"></RadDataForm>
      <Button row="1" col="0" text="Cancelar" @tap="$navigator.back()" class="btn btn-secondary" />
      <Button row="1" col="1" text="Salvar" @tap="updateUser" class="btn btn-primary" />
    </GridLayout>
  </Page>
</template>

<script>
import { mapGetters } from "vuex";
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import { Feedback } from "nativescript-feedback";
import { UPDATE_USER } from "~/store/actions.type";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
const feedback = new Feedback();

export default {
  data() {
    return {
      userMetadata: {
        isReadOnly: false,
        commitMode: "Immediate",
        validationMode: "Immediate",
        propertyAnnotations: [
          {
            name: "authtoken",
            hidden: true
          },
          {
            name: "id",
            hidden: true
          },
          {
            name: "image",
            hidden: true
          },
          {
            name: "latitude",
            hidden: true
          },
          {
            name: "longitude",
            hidden: true
          },
          {
            groupName: "Dados Pessoais",
            name: "name",
            displayName: "Nome",
            index: 0,
            editor: "Text"
          },
          {
            groupName: "Dados Pessoais",
            name: "email",
            displayName: "Email",
            index: 1,
            editor: "Email"
          },
          {
            groupName: "Dados Pessoais",
            name: "phone",
            displayName: "Celular",
            index: 2,
            editor: "Phone"
          },
          {
            groupName: "Endereço",
            name: "address",
            displayName: "Logradouro",
            index: 3,
            editor: "Text"
          },
          {
            groupName: "Endereço",
            name: "number",
            displayName: "Número",
            index: 4,
            editor: "Number"
          },
          {
            groupName: "Endereço",
            name: "neighborhood",
            displayName: "Bairro",
            index: 5,
            editor: "Text"
          },
          {
            groupName: "Endereço",
            name: "cep",
            displayName: "CEP",
            index: 6,
            editor: "Number"
          },
          {
            groupName: "Endereço",
            name: "complement",
            displayName: "Complemento",
            index: 7,
            editor: "Text"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["user"]),
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    updateUser() {
      if (getConnectionType() === connectionType.none) {
        feedback.error({
          message:
            "Lideranças requer uma conexão com a Internet para efetuar o login."
        });
        return;
      }

      utils.loader.show();
      this.$store
        .dispatch(UPDATE_USER, this.user)
        .then(() => {
          this.$navigator.back();
          utils.loader.hide();
          feedback.success({
            message: "Cadastro atualizado com sucesso."
          });
        })
        .catch(error => {
          console.error(error);
          utils.loader.hide();
          feedback.error({
            message:
              "Infelizmente não conseguimos atualizar sua conta. Tente mais tarde."
          });
        });
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../assets/scss/app-variables";
// End custom common variables

// Custom styles
.btn-secondary{
  background-color: $page-icon-color;
}
</style>