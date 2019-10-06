import {
  LOGIN,
  LOGOUT,
  REGISTER,
  FETCH_USER,
  RESET_PASSWORD
} from "~/store/actions.type";
import {
  SET_AUTH,
  PURGE_AUTH,
  SET_ERROR,
  SET_TOKEN,
  SET_INITIAL
} from "~/store/mutations.type";
import LoginService from "~/services/LoginService";
import { clear } from "tns-core-modules/application-settings";

const loginService = new LoginService();

const state = {
  user: {},
  errors: null
};

const getters = {
  user: state => state.user
};

const actions = {
  [LOGIN](context, user) {
    return new Promise((resolve, reject) => {
      loginService
        .login(user)
        .then(data => {
          console.info("User logged in with token: " + data.authtoken);
          context.commit(SET_TOKEN, data.authtoken);
          context.commit(SET_AUTH, data);
          resolve();
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [REGISTER](context, user) {
    return new Promise((resolve, reject) => {
      loginService
        .register(user)
        .then(data => {
          context.commit(SET_TOKEN, data.authtoken);
          resolve(data);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [RESET_PASSWORD](context, email) {
    return new Promise((resolve, reject) => {
      loginService
        .resetPassword(email)
        .then(data => {
          // context.commit(SET_AUTH, data.user);
          resolve(data);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [FETCH_USER](context) {
    return new Promise((resolve, reject) => {
      loginService
        .user()
        .then(data => {
          console.info("User data: " + data);
          context.commit(SET_AUTH, data);
          resolve();
        })
        .catch(error => {
          context.commit(SET_ERROR, response.data.errors);
          context.commit(PURGE_AUTH);
          reject(error);
        });
    });
  }

  /*     [UPDATE_USER](context, payload) {
    const { email, username, password, image, bio } = payload;
    const user = {
      email,
      username,
      bio,
      image
    };
    if (password) {
      user.password = password;
    }

    return ApiService.put("user", user).then(({ data }) => {
      context.commit(SET_AUTH, data.user);
      return data;
    });
  } */
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_TOKEN](state, token) {
    loginService.token = token;
  },
  [SET_AUTH](state, user) {
    state.user = user;
    state.errors = {};
  },
  [SET_INITIAL](state, initial) {
    loginService.initial = initial;
    state.errors = {};
  },
  [PURGE_AUTH](state) {
    state.user = {};
    state.errors = {};
    clear();
  }
};
// export this module.
export default {
  state,
  mutations,
  actions,
  getters
};
