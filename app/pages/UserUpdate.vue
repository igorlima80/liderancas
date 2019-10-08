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

    <GridLayout class="page-content">
      <RadDataForm :source="user" :metadata="userMetadata">     
          <!-- <PropertyGroup collapsible="true" name="outras info" hidden="true">
            <properties>
              <EntityProperty name="id" ></EntityProperty>
              <EntityProperty name="authtoken" ></EntityProperty>
              <EntityProperty name="cod" ></EntityProperty>
              <EntityProperty name="lat" ></EntityProperty>
              <EntityProperty name="log" ></EntityProperty>
            </properties>
          </PropertyGroup> -->
        
      </RadDataForm>
    </GridLayout>
  </Page>
</template>

<script>
import { mapGetters } from "vuex";
import * as utils from "~/shared/utils";
import SelectedPageService from "../shared/selected-page-service";
import { Feedback } from "nativescript-feedback";
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
            index: 7,
            editor: "Phone"
          },
          {
            groupName: "Endereço",
            name: "address",
            displayName: "Logradouro",
            index: 2,
            editor: "Text"
          },
          {
            groupName: "Endereço",
            name: "number",
            displayName: "Número",
            index: 3,
            editor: "Number"
          },
          {
            groupName: "Endereço",
            name: "neighborhood",
            displayName: "Bairro",
            index: 4,
            editor: "Text"
          },
          {
            groupName: "Endereço",
            name: "cep",
            displayName: "CEP",
            index: 5,
            editor: "Number"
          },
          {
            groupName: "Endereço",
            name: "complement",
            displayName: "Complemento",
            index: 6,
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
</style>