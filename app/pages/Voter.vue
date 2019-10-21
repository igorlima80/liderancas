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
      <ActionItem
        @tap="readOnly"
        ios.position="right"
        icon="res://baseline_edit_white_24"
        text="Editar"
      />
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
      <Label class="action-bar-title" text="Modificar Eleitor"></Label>
    </ActionBar>

    <GridLayout class="page-content" rows="auto,*,auto" columns="*,*">
      <GridLayout
        :isEnabled="!isReadOnly"
        class="m-20"
        :class="{ disabled: isReadOnly }"
        row="0"
        col="0"
        colSpan="2"
        rows="auto,auto"
        columns="*, auto"
        @tap="$navigator.navigate('/upload-image', { props: { user: voter, role: 'voter' }})"
      >
        <Image
          v-if="voter.image"
          row="0"
          col="1"
          :src="voter.image"
          class="thumb"
          rowSpan="2"
        />
        <Image v-else row="0" col="1" src="~/assets/images/userimage.png" class="thumb" rowSpan="2" />
        <Label row="0" col="0" text="Avatar" class="font-weight-bold" color="black" />
        <Label row="1" col="0" text="Modifique o seu avatar" />
      </GridLayout>
      <RadDataForm
        ref="dataForm"
        :source="voter"
        :metadata="userMetadata"
        :groups="groups"
        :isReadOnly="isReadOnly"
        row="1"
        col="0"
        colSpan="2"
      ></RadDataForm>
      <Button row="2" col="0" text="Cancelar" @tap="$navigator.back()" class="btn btn-secondary" />
      <Button
        row="2"
        col="1"
        text="Salvar"
        @tap="updateVoter"
        class="btn btn-primary"
        :isEnabled="!isReadOnly"
      />
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
import { UPDATE_VOTER } from "~/store/actions.type";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
const feedback = new Feedback();

export default {
  props: ["voter"],
  data() {
    return {
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
    updateVoter() {
      if (getConnectionType() === connectionType.none) {
        feedback.error({
          message:
            "Lideranças requer uma conexão com a Internet para atualizar o eleitor."
        });
        return;
      }

      utils.loader.show();
      this.$store
        .dispatch(UPDATE_VOTER, this.voter)
        .then(() => {
          this.$navigator.back();
          utils.loader.hide();
          feedback.success({
            message: "Eleitor atualizado com sucesso."
          });
        })
        .catch(error => {
          console.error(error);
          utils.loader.hide();
          feedback.error({
            message: "Infelizmente não conseguimos atualizar. Tente mais tarde."
          });
        });
    },
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    readOnly() {
      this.isReadOnly = !this.isReadOnly;
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../assets/scss/app-variables";
// End custom common variables

// Custom styles
.thumb{
  height: 45;
  width: 45;
  border-radius: 50%;
}

.disabled {
  opacity: 0.50;
}
</style>