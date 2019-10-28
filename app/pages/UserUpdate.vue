<template>
  <Page class="page" @loaded="onLoaded">
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

    <GridLayout rows="*,auto" columns="*,*"> 
      <ScrollView col="0" row="0" colSpan="2">
      <GridLayout class="page-content" rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto" columns="*,*">
      <Label row="0" col="0" text="Dados Gerais" colSpan="2" class="font-weight-bold text-primary m-b-20" />
      <StackLayout class="input-field" row="1" colSpan="2">
        <Label text="Nome" class="label" />
        <TextField
        ref="name"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="leader.user.name"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="2" colSpan="2">
        <Label text="Email" class="label" />
        <TextField
        ref="email"
        keyboardType="email"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="leader.user.email"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="3" colSpan="2">
        <Label text="CPF" class="label" />
        <MaskedTextField
          isEnabled="false"
          ref="cpf"
          keyboardType="text"
          autocorrect="false"
          autocapitalizationType="none"
          :text="leader.user.cpf"
          returnKeyType="next"
          mask="000.000.000-00"
        />
      </StackLayout>
      <Label row="4" col="0" text="Endereço" colSpan="2" class="font-weight-bold text-primary m-y-20" />
      <StackLayout class="input-field" row="5" colSpan="2">
        <Label text="Descrição" class="label" />
        <TextField
        ref="description"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="leader.address.description"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="6" colSpan="2">
        <Label text="Número" class="label" />
        <TextField
        ref="number"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="leader.address.number"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="7" colSpan="2">
        <Label text="Complemento" class="label" />
        <TextField
        ref="complement"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="leader.address.complement"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="8" colSpan="2">
        <Label text="CEP" class="label" />
        <MaskedTextField
        ref="zipcode"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="leader.address.zipcode"
        returnKeyType="next"
        mask="00000-000"
      />
      </StackLayout>
      <StackLayout class="input-field" row="9" colSpan="2">
        <Label text="Bairro" class="label" />
        <TextField
        ref="district"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="leader.address.district"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="10" colSpan="2">
        <Label text="Logradouro" class="label" />
        <TextField
        ref="street"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="leader.address.street"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="11" colSpan="2">
        <Label text="Cidade" class="label" />
        <TextField
        ref="city_id"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="leader.address.city_id"
        returnKeyType="done"
      />
      </StackLayout>
      <!-- <RadDataFormMaskedTextField
        @loaded="onLoadMaskedTextField
        ref="dataForm"
        :source="leader"
        :metadata="userMetadata"
        :groups="groups"
        row="0"
        col="0"
        colSpan="2"
      ></RadDataForm> -->
      </GridLayout>
      </ScrollView>
      <GridLayout col="0" row="1" colSpan="2" rows="auto" columns="*,*">
        <Button row="0" col="0" text="Cancelar" @tap="$navigator.back()" class="btn btn-secondary" />
        <Button row="0" col="1" text="Salvar" @tap="updateUser" class="btn btn-primary" />
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
import { mapGetters } from "vuex";
import * as utils from "~/shared/utils";
import {
  GroupTitleStyle,
  PropertyGroup,
  DataFormFontStyle
} from "nativescript-ui-dataform";
import { Color } from "tns-core-modules/color";
import SelectedPageService from "../shared/selected-page-service";
import { Feedback } from "nativescript-feedback";
import { UPDATE_LEADER } from "~/store/actions.type";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
const feedback = new Feedback();
let clone = require('clone');

export default {
  data() {
    return {
      leader: {user: {},
      address: {}}
      // groups: [],
      // userMetadata: {
      //   isReadOnly: false,
      //   commitMode: "Immediate",
      //   validationMode: "Immediate",
      //   propertyAnnotations: [
      //     {
      //       name: "authtoken",
      //       hidden: true
      //     },
      //     {
      //       name: "id",
      //       hidden: true
      //     },
      //     {
      //       name: "image",
      //       hidden: true
      //     },
      //     {
      //       name: "latitude",
      //       hidden: true
      //     },
      //     {
      //       name: "longitude",
      //       hidden: true
      //     },
      //     {
      //       groupName: "Dados Pessoais",
      //       name: "user.name",
      //       displayName: "Nome",
      //       index: 0,
      //       editor: "Text"
      //     },
      //     {
      //       groupName: "Dados Pessoais",
      //       name: "email",
      //       displayName: "Email",
      //       readOnly: true,
      //       index: 1,
      //       editor: "Email"
      //     },
      //     {
      //       groupName: "Dados Pessoais",
      //       name: "phone",
      //       displayName: "Celular",
      //       index: 2,
      //       editor: "Phone"
      //     },
      //     {
      //       groupName: "Endereço",
      //       name: "address",
      //       displayName: "Logradouro",
      //       index: 3,
      //       editor: "Text"
      //     },
      //     {
      //       groupName: "Endereço",
      //       name: "number",
      //       displayName: "Número",
      //       index: 4,
      //       editor: "Number"
      //     },
      //     {
      //       groupName: "Endereço",
      //       name: "neighborhood",
      //       displayName: "Bairro",
      //       index: 5,
      //       editor: "Text"
      //     },
      //     {
      //       groupName: "Endereço",
      //       name: "cep",
      //       displayName: "CEP",
      //       index: 6,
      //       editor: "Number"
      //     },
      //     {
      //       groupName: "Endereço",
      //       name: "complement",
      //       displayName: "Complemento",
      //       index: 7,
      //       editor: "Text"
      //     }
      //   ]
      // }
    }
  },
  // created() {
  //   let gts = new GroupTitleStyle();
  //   let pg = new PropertyGroup();

  //   gts.labelTextColor = new Color("#417169");
  //   gts.labelFontStyle = DataFormFontStyle.Bold;
  //   gts.labelTextSize = 14;

  //   pg.name = "Dados Pessoais";
  //   pg.collapsible = true;
  //   pg.collapsed = false;
  //   pg.titleStyle = gts;

  //   this.groups.push(pg);

  //   pg = new PropertyGroup();

  //   pg.name = "Endereço";
  //   pg.collapsible = true;
  //   pg.collapsed = false;
  //   pg.titleStyle = gts;

  //   this.groups.push(pg);
  // },
  computed: {
    ...mapGetters(["user"])
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
        .dispatch(UPDATE_LEADER, this.leader)
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
    },
    onLoaded(){
      this.leader = clone(this.user);
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../assets/scss/app-variables";
// End custom common variables

// Custom styles
.page-content{
  padding: 15 15 0 15;
}
</style>