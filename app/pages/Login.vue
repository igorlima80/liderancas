<template>
  <Page class="page" @loaded="pageLoaded()" @unloaded="pageUnloaded()" actionBarHidden="true">
    <FlexboxLayout flexDirection="column" justifyContent="space-around" class="page-content">
      <!-- <ActivityIndicator :busy="busy" alignSelf="center"/> -->
      <Image src="~/assets/images/logo.png" width="30%" />
      <CardView margin="1" elevation="5" radius="7" alignSelf="center">
        <GridLayout rows="auto,auto,auto,auto,auto" class="m-15">
          <Label row="0" text="Login" class="text-center font-weight-bold text-primary m-b-10" />
          <TextField
            row="1"
            ref="email"
            hint="Email"
            keyboardType="email"
            autocorrect="false"
            autocapitalizationType="none"
            v-model="email"
            returnKeyType="next"
            @returnPress="focusPassword"
            class="m-b-10"
          />
          <TextField
            row="2"
            ref="password"
            hint="Senha"
            secure="true"
            v-model="password"
            @returnPress="submit"
            returnKeyType="done"
            class="m-b-15"
          />
          <Button row="3" text="Entrar" @tap="submit" class="btn btn-primary" />
          <Label
            row="4"
            text="Esqueceu sua senha?"
            alignSelf="center"
            class="text-primary text-right m-t-15"
            @tap="forgotPassword"
          />
        </GridLayout>
      </CardView>

      <Label alignSelf="center" class="p-5 text-primary" @tap="$navigator.navigate('/signup')">
        <FormattedString>
          <Span text="Não tem uma conta? " />
          <Span text="Cadastre-se!" class="font-weight-bold" />
        </FormattedString>
      </Label>
    </FlexboxLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import LoginService from "~/services/LoginService";
import {
  LOGIN,
  RESET_PASSWORD
} from "~/store/actions.type";
import SelectedPageService from "../shared/selected-page-service";
import orientationModule from "nativescript-screen-orientation";
import { Feedback } from "nativescript-feedback";
import validator from "email-validator";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
const feedback = new Feedback();

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    focusPassword() {
      this.$refs.password.nativeView.focus();
    },
    submit() {
      if (!this.email || !this.password) {
        feedback.error({
          message: "Por favor, digite o endereço de e-mail e senha."
        });
        return;
      }
      if (!validator.validate(this.email)) {
        feedback.error({
          message: "Digite um endereço de e-mail válido."
        });
        return;
      }

      this.login();
    },

    login() {
      if (getConnectionType() === connectionType.none) {
        feedback.error({
          message:
            "Saúde+ requer uma conexão com a Internet para efetuar o login."
        });
        return;
      }

      utils.loader.show();
      this.$store
        .dispatch(LOGIN, { email: this.email, password: this.password })
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
            "DiárioEDU requer uma conexão com a Internet para para redefinir sua senha."
        });
        return;
      }
      prompt({
        title: "Redefinir Senha",
        message:
          "Digite o endereço de e-mail que você usou para se cadastrar no Saúde+ para redefinir sua senha.",
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
                  title: "Saúde+",
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
    // fetchUser() {
    //   this.$store
    //     .dispatch(FETCH_USER)
    //     .then(() => {
    //       utils.loader.hide();
    //     })
    //     .catch(error => {
    //       utils.loader.hide();
    //       alert({
    //         title: "Saúde+",
    //         message:
    //           "Não foi possivei carregar os dados do usuário.Tente mais tarde.",
    //         okButtonText: "OK"
    //       });
    //       this.$navigator.navigate("/login", {
    //         clearHistory: true
    //       });
    //     });
    // },
    pageLoaded() {
      orientationModule.setCurrentOrientation("portrait");
      utils.gesturesEnabled(false);
    },
    pageUnloaded() {
      // orientationModule.orientationCleanup();
      // utils.gesturesEnabled(true);
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../assets/scss/app-variables";
// End custom common variables

.page {
  background-color: #DDEDEA;
}

</style>