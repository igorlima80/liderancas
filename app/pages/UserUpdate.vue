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
      <ScrollView col="0" row="0" colspan="2">
        <GridLayout
          class="page-content"
          rows="auto,auto,auto,auto,auto,auto,auto,auto"
          columns="*,*"
        >
          <!-- <Label
            row="0"
            col="0"
            text="Dados Gerais"
            colspan="2"
            class="font-weight-bold text-primary m-b-20"
          />
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
          </StackLayout>-->
          <Label
            row="0"
            col="0"
            text="Endereço"
            colspan="2"
            class="font-weight-bold text-primary m-y-20"
          />
          <StackLayout class="input-field" row="1" colspan="2">
            <Label text="Descrição" class="label" />
            <TextField
              ref="description"
              keyboardType="text"
              autocorrect="false"
              autocapitalizationType="none"
              v-model="leader.address_attributes.description"
              returnKeyType="next"
            />
          </StackLayout>
          <StackLayout class="input-field" row="2" colspan="2">
            <Label text="Número" class="label" />
            <TextField
              ref="number"
              keyboardType="text"
              autocorrect="false"
              autocapitalizationType="none"
              v-model="leader.address_attributes.number"
              returnKeyType="next"
            />
          </StackLayout>
          <StackLayout class="input-field" row="3" colspan="2">
            <Label text="Complemento" class="label" />
            <TextField
              ref="complement"
              keyboardType="text"
              autocorrect="false"
              autocapitalizationType="none"
              v-model="leader.address_attributes.complement"
              returnKeyType="next"
            />
          </StackLayout>
          <StackLayout class="input-field" row="4" colspan="2">
            <Label text="CEP" class="label" />
            <MaskedTextField
              ref="zipcode"
              keyboardType="text"
              autocorrect="false"
              autocapitalizationType="none"
              v-model="leader.address_attributes.zipcode"
              returnKeyType="next"
              mask="00000-000"
            />
          </StackLayout>
          <StackLayout class="input-field" row="5" colspan="2">
            <Label text="Bairro" class="label" />
            <TextField
              ref="district"
              keyboardType="text"
              autocorrect="false"
              autocapitalizationType="none"
              v-model="leader.address_attributes.district"
              returnKeyType="next"
            />
          </StackLayout>
          <StackLayout class="input-field" row="6" colspan="2">
            <Label text="Logradouro" class="label" />
            <TextField
              ref="street"
              keyboardType="text"
              autocorrect="false"
              autocapitalizationType="none"
              v-model="leader.address_attributes.street"
              returnKeyType="next"
            />
          </StackLayout>
          <StackLayout class="input-field" row="7" colspan="2">
            <Label text="Cidade" class="label" />
            <!-- <TextField
              ref="city_id"
              keyboardType="text"
              autocorrect="false"
              autocapitalizationType="none"
              v-model="leader.address_attributes.city_id"
              returnKeyType="done"
            />-->
            <RadAutoCompleteTextView
              ref="autocomplete"
              displayMode="plain"
              suggestMode="Suggest"
              :items="dataItems"
            >
              <SuggestionView ~suggestionView suggestionViewHeight="300">
                <StackLayout v-suggestionItemTemplate orientation="vertical" padding="10">
                  <v-template>
                    <Label :text="item.name"></Label>
                  </v-template>
                </StackLayout>
              </SuggestionView>
            </RadAutoCompleteTextView>
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
          ></RadDataForm>-->
        </GridLayout>
      </ScrollView>
      <GridLayout col="0" row="1" colspan="2" rows="auto" columns="*,*">
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
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TokenModel } from "nativescript-ui-autocomplete";
import LiderancasService from "~/services/LiderancasService";
const feedback = new Feedback();
const liderancasService = new LiderancasService();
let clone = require("clone");

export default {
  data() {
    return {
      leader: { address_attributes: {} },
      dataItems: new ObservableArray()
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted() {
    // const url = 'http://localhost:3000/api/cities/find';

    this.$refs.autocomplete.setLoadSuggestionsAsync(text => {
      const promise = new Promise((resolve, reject) => {
        liderancasService
          .getCites(text)
          .then(r => {
            const cityCollection = r.collection;
            const items = new Array();
            for (let i = 0; i < cityCollection.length; i++) {
              items.push(new TokenModel(cityCollection[i].name, null));
            }
            resolve(items);
          })
          .catch(err => {
            const message = `Error fetching remote data from ${url}: ${err.message}`;
            console.log(message);
            alert(message);
            reject();
          });
      });

      return promise;
    });
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
    onLoaded() {
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
.page-content {
  padding: 15 15 0 15;
}
</style>