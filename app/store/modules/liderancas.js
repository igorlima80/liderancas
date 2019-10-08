import { CHANGE_NOTIFICATION, GET_NOTIFICATIONS } from "~/store/actions.type";
import {
  SET_NOTIFICATION,
  SET_INITIAL,
  SET_NOTIFICATIONS
} from "~/store/mutations.type";
import LiderancasService from "~/services/LiderancasService";
let firebase = require("nativescript-plugin-firebase");
const liderancasService = new LiderancasService();

const state = {
  notifications: {}
};

const getters = {
  notifications: state => state.notifications,
  notifications_quant: state => state.notifications.length
};

const actions = {
  [CHANGE_NOTIFICATION](context, notification) {
    if (notification) {
      firebase
        .subscribeToTopic("notifications")
        .then(() => console.log("Subscribed to topic notifications"));
    } else {
      firebase
        .unsubscribeFromTopic("notifications")
        .then(() => console.log("Unsubscribed from topic notifications"));
    }
    context.commit(SET_NOTIFICATION, notification);
  },
  [GET_NOTIFICATIONS](context) {
    return new Promise((resolve, reject) => {
      liderancasService
        .notifications()
        .then(data => {
          console.info("notifications: " + data);
          context.commit(SET_NOTIFICATIONS, data);
          resolve();
        })
        .catch(error => {
          context.commit(SET_ERROR, response.data.errors);
          reject(error);
        });
    });
  }
};

const mutations = {
  [SET_NOTIFICATION](state, notification) {
    liderancasService.notification = notification;
  },
  [SET_INITIAL](state, initial) {
    liderancasService.initial = initial;
  },
  [SET_NOTIFICATIONS](state, notifications) {
    state.notifications = notifications;
  }
};
// export this module.
export default {
  state,
  mutations,
  actions,
  getters
};
