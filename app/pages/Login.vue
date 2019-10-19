<template>
  <Page class="page" @loaded="pageLoaded()" actionBarHidden="true">
    <FlexboxLayout flexDirection="column" justifyContent="space-around" class="page-content">
      <!-- <ActivityIndicator :busy="busy" alignSelf="center"/> -->
      <Image src="~/assets/images/logo.png" width="30%" />
      <CardView margin="1" elevation="5" radius="7" alignSelf="center">
        <GridLayout rows="auto,auto,auto,auto,auto" class="m-15">
          <Label row="0" text="Login" class="text-center font-weight-bold text-primary m-y-15" />
          <TextField
            row="1"
            ref="cpf"
            hint="CPF"
            keyboardType="text"
            autocorrect="false"
            autocapitalizationType="none"
            v-model="cpf"
            returnKeyType="done"
            @returnPress="submit"
            class="m-b-15"
          />
          <!-- <TextField
            row="2"
            ref="password"
            hint="Senha"
            secure="true"
            v-model="password"
            @returnPress="submit"
            returnKeyType="done"
            class="m-b-15"
          /> -->
          <Button row="2" text="Entrar" @tap="submit" class="btn btn-primary m-y-20" />
          <Label
            row="3"
            text="Esqueceu sua senha?"
            alignSelf="center"
            class="text-primary text-right m-t-15"
            @tap="forgotPassword"
          />
        </GridLayout>
      </CardView>

      <Label alignSelf="center" class="p-5 text-primary" @tap="openBrowser">
        <FormattedString>
          <Span text="Sem conta? " />
          <Span text="Contate seu gestor." class="font-weight-bold" />
        </FormattedString>
      </Label>
    </FlexboxLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import {
  LOGIN,
  RESET_PASSWORD
} from "~/store/actions.type";
import SelectedPageService from "../shared/selected-page-service";
import orientationModule from "nativescript-screen-orientation";
import { Feedback } from "nativescript-feedback";
import validator from "email-validator";
const utilsModule = require("tns-core-modules/utils/utils");
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
const feedback = new Feedback();

export default {
  data() {
    return {
      cpf: "81589123387"
      // email: "admin@admin.com",
      // password: "12345678"
    };
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
  },
  computed: {
    message() {
      return "";
    }
  },
  methods: {
    // focusPassword() {
    //   this.$refs.password.nativeView.focus();
    // },
    submit() {
      if (!this.cpf) {
        feedback.error({
          message: "Por favor, digite o número do CPF."
        });
        return;
      }
      // if (!validator.validate(this.email)) {
      //   feedback.error({
      //     message: "Digite um endereço de e-mail válido."
      //   });
      //   return;
      // }

      this.login();
    },

    login() {
      if (getConnectionType() === connectionType.none) {
        feedback.error({
          message:
            "Lideranças requer uma conexão com a Internet para efetuar o login."
        });
        return;
      }

      utils.loader.show();
      this.$store
        .dispatch(LOGIN, { cpf: this.cpf})
        .then(() => {
          this.$navigator.navigate("/home", {
            clearHistory: true
          });
          utils.loader.hide();
        })
        .catch(error => {
          console.error(error);
          utils.loader.hide();
          feedback.error({
            message:
              "Infelizmente não conseguimos encontrar sua conta. Tente mais tarde."
          });
        });
    },
    forgotPassword() {
      if (getConnectionType() === connectionType.none) {
        feedback.error({
          message:
            "Lideranças requer uma conexão com a Internet para para redefinir sua senha."
        });
        return;
      }
      prompt({
        title: "Redefinir Senha",
        message:
          "Digite o endereço de e-mail que você usou para se cadastrar no Lideranças para redefinir sua senha.",
        inputType: "email",
        defaultText: "",
        okButtonText: "Enviar",
        cancelButtonText: "Cancelar"
      }).then(data => {
        if (data.result) {
          utils.loader.show();
          if (validator.validate(data.text.trim())) {
            this.$store
              .dispatch(RESET_PASSWORD, data.text.trim())
              .then(() => {
                utils.loader.hide();
                alert({
                  title: "Lideranças",
                  message:
                    "Sua senha foi redefinida com sucesso. Por favor, verifique seu e-mail para obter instruções sobre como escolher uma nova senha.",
                  okButtonText: "OK"
                });
                /*                 feedback.success({
                  message:
                    "Sua senha foi redefinida com sucesso. Por favor, verifique seu e-mail para obter instruções sobre como escolher uma nova senha."
                }); */
              })
              .catch(error => {
                utils.loader.hide();
                console.log("Error resetting password: " + error);
                feedback.error({
                  message:
                    "Infelizmente, ocorreu um erro ao redefinir sua senha."
                });
              });
          } else {
            utils.loader.hide();
            feedback.error({
              message: "Digite um endereço de e-mail válido."
            });
          }
        }
      });
    },
    pageLoaded() {
      orientationModule.setCurrentOrientation("portrait");
      utils.gesturesEnabled(false);
    },
    openBrowser(){
      utilsModule.openUrl("https://www.google.com")
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../assets/scss/app-variables";
// End custom common variables

.page {
  background-color: $background-light;
  padding: 20;
}

</style>