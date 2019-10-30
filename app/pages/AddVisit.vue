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
      <Label class="action-bar-title" text="Registro de Visita"></Label>
    </ActionBar>

    <GridLayout class="page-content" rows="auto,*,auto" columns="*,*">
      <RadDataForm
        ref="dataForm"
        :source="visit"
        :metadata="userMetadata"
        :groups="groups"
        row="1"
        col="0"
        colSpan="2"
      ></RadDataForm>
      <Button row="2" col="0" text="Cancelar" @tap="$navigator.back()" class="btn btn-secondary" />
      <Button row="2" col="1" text="Salvar" @tap="addVisit" class="btn btn-primary" />
    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import {
  GroupTitleStyle,
  PropertyGroup,
  DataFormFontStyle
} from "nativescript-ui-dataform";
import { Color } from "tns-core-modules/color";
import SelectedPageService from "../shared/selected-page-service";
import { Feedback } from "nativescript-feedback";
import { ADD_MEMBER } from "~/store/actions.type";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
const feedback = new Feedback();

export default {
  props: ["voter"],
  data() {
    return {
      visit: {
        id: "",
        description: "",
        date: "",
        hour: "",
        lideranca_id: "",
        voter_id: "",
        obs: ""
      },
      groups: [],
      isReadOnly: true,
      userMetadata: {
        commitMode: "Immediate",
        validationMode: "Immediate"
        // propertyAnnotations: [
        //   {
        //     name: "authtoken",
        //     hidden: true
        //   },
        //   {
        //     name: "id",
        //     hidden: true
        //   },
        //   {
        //     name: "image",
        //     hidden: true
        //   },
        //   {
        //     name: "latitude",
        //     hidden: true
        //   },
        //   {
        //     name: "longitude",
        //     hidden: true
        //   },
        //   {
        //     groupName: "Dados Pessoais",
        //     name: "name",
        //     displayName: "Nome",
        //     index: 0,
        //     editor: "Text"
        //   },
        //   {
        //     groupName: "Dados Pessoais",
        //     name: "email",
        //     displayName: "Email",
        //     readOnly: true,
        //     index: 1,
        //     editor: "Email"
        //   },
        //   {
        //     groupName: "Dados Pessoais",
        //     name: "phone",
        //     displayName: "Celular",
        //     index: 2,
        //     editor: "Phone"
        //   },
        //   {
        //     groupName: "Endereço",
        //     name: "address",
        //     displayName: "Logradouro",
        //     index: 3,
        //     editor: "Text"
        //   },
        //   {
        //     groupName: "Endereço",
        //     name: "number",
        //     displayName: "Número",
        //     index: 4,
        //     editor: "Number"
        //   },
        //   {
        //     groupName: "Endereço",
        //     name: "neighborhood",
        //     displayName: "Bairro",
        //     index: 5,
        //     editor: "Text"
        //   },
        //   {
        //     groupName: "Endereço",
        //     name: "cep",
        //     displayName: "CEP",
        //     index: 6,
        //     editor: "Number"
        //   },
        //   {
        //     groupName: "Endereço",
        //     name: "complement",
        //     displayName: "Complemento",
        //     index: 7,
        //     editor: "Text"
        //   }
        // ]
      }
    };
  },
  created() {
    let gts = new GroupTitleStyle();
    let pg = new PropertyGroup();

    gts.labelTextColor = new Color("#417169");
    gts.labelFontStyle = DataFormFontStyle.Bold;
    gts.labelTextSize = 14;

    pg.name = "Dados Pessoais";
    pg.collapsible = true;
    pg.collapsed = false;
    pg.titleStyle = gts;

    this.groups.push(pg);

    pg = new PropertyGroup();

    pg.name = "Endereço";
    pg.collapsible = true;
    pg.collapsed = false;
    pg.titleStyle = gts;

    this.groups.push(pg);
  },
  methods: {
    addVisit() {
      if (getConnectionType() === connectionType.none) {
        feedback.error({
          message:
            "Lideranças requer uma conexão com a Internet para cadastrar nova visita."
        });
        return;
      }

      utils.loader.show();
      this.$store
        .dispatch(ADD_MEMBER, this.voter)
        .then(() => {
          this.$navigator.back();
          utils.loader.hide();
          feedback.success({
            message: "Visita cadastrada com sucesso."
          });
        })
        .catch(error => {
          console.error(error);
          utils.loader.hide();
          feedback.error({
            message: "Infelizmente não conseguimos cadastrar. Tente mais tarde."
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
.thumb {
  height: 45;
  width: 45;
  border-radius: 50%;
}

.disabled {
  opacity: 0.5;
}
</style>