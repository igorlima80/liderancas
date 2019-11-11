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
      <Label class="action-bar-title" text="Modificar Membro"></Label>
    </ActionBar>
    <GridLayout rows="*,auto" columns="*,*"> 
      <ScrollView col="0" row="0" colSpan="2">
      <GridLayout class="page-content" rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto" columns="*,*">
      <Label row="0" col="0" text="Dados Gerais" colSpan="2" class="font-weight-bold text-primary m-b-20" />
      <StackLayout class="input-field" row="1" colSpan="2">
        <Label text="Nome" class="label" />
        <TextField
        :isEnabled="enabled"
        ref="name"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="voter.name"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="2" colSpan="2">
        <Label text="Data de nascimento" class="label" />
        <TextField
        :isEnabled="enabled"
        ref="date"
        keyboardType="datetime"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="voter.birthdate"
        returnKeyType="next"
      />
        <!-- mask="00/00/0000" -->
      </StackLayout>
      <StackLayout class="input-field" row="3" colSpan="2">
        <Label text="CPF" class="label" />
        <!-- <MaskedTextField -->
          <TextField
          :isEnabled="enabled"
          ref="cpf"
          keyboardType="text"
          autocorrect="false"
          autocapitalizationType="none"
          :text="voter.cpf"
          returnKeyType="next"
        />
          <!-- mask="000.000.000-00" -->
      </StackLayout>
      <Label row="4" col="0" text="Endereço" colSpan="2" class="font-weight-bold text-primary m-y-20" />
      <StackLayout class="input-field" row="5" colSpan="2">
        <Label text="Descrição" class="label" />
        <TextField
        :isEnabled="enabled"
        ref="description"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="voter.address.description"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="6" colSpan="2">
        <Label text="Número" class="label" />
        <TextField
        :isEnabled="enabled"
        ref="number"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="voter.address.number"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="7" colSpan="2">
        <Label text="Complemento" class="label" />
        <TextField
        :isEnabled="enabled"
        ref="complement"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="voter.address.complement"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="8" colSpan="2">
        <Label text="CEP" class="label" />
        <!-- <MaskedTextField -->
        <TextField  
        :isEnabled="enabled"
        ref="zipcode"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="voter.address.zipcode"
        returnKeyType="next"
      />
        <!-- mask="00000-000" -->
      </StackLayout>
      <StackLayout class="input-field" row="9" colSpan="2">
        <Label text="Bairro" class="label" />
        <TextField
        :isEnabled="enabled"
        ref="district"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="voter.address.district"
        returnKeyType="next"
      />
      </StackLayout>
      <StackLayout class="input-field" row="10" colSpan="2">
        <Label text="Logradouro" class="label" />
        <TextField
        :isEnabled="enabled"
        ref="street"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="voter.address.street"
        returnKeyType="next"
      />
      </StackLayout>
      <!-- <StackLayout class="input-field" row="11" colSpan="2">
        <Label text="Cidade" class="label" />
        <TextField
        :isEnabled="enabled"
        ref="city_id"
        keyboardType="text"
        autocorrect="false"
        autocapitalizationType="none"
        v-model="voter.address.city_id"
        returnKeyType="done"
      />
      </StackLayout> -->
      <!-- <RadDataFormMaskedTextField
        @loaded="onLoadMaskedTextField
        ref="dataForm"
        :source="voter"
        :metadata="userMetadata"
        :groups="groups"
        row="0"
        col="0"
        colSpan="2"
      ></RadDataForm> -->
      </GridLayout>
      </ScrollView>
      <GridLayout col="0" row="1" colSpan="2" rows="auto" columns="*,*">
        <Button row="0" col="0" text="Cancelar" @tap="$navigator.navigate('/voters')" class="btn btn-secondary" />
        <Button row="0" col="1" text="Salvar" @tap="updateVoter" class="btn btn-primary" :isEnabled="enabled"/>
      </GridLayout>
    </GridLayout>

      <!-- <RadDataForm
        ref="dataForm"
        :source="voter"
        :metadata="userMetadata"
        :groups="groups"
        :isReadOnly="isReadOnly"
        row="0"
        col="0"
        colSpan="2"
      ></RadDataForm>
      <Button row="1" col="0" text="Cancelar" @tap="$navigator.back()" class="btn btn-secondary" />
      <Button
        row="2"
        col="1"
        text="Salvar"
        @tap="updateVoter"
        class="btn btn-primary"
        :isEnabled="!isReadOnly"
      /> -->
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
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
      enabled: false
    };
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
          this.$navigator.navigate("/voters")
          utils.loader.hide();
          feedback.success({
            message: "Membro atualizado com sucesso."
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
      this.enabled = !this.enabled;
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

.page-content{
  padding: 15 15 0 15;
}
</style>