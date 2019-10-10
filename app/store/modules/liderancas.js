import {
  CHANGE_NOTIFICATION,
  GET_NOTIFICATIONS,
  GET_LEADERS,
  GET_VISITS
} from "~/store/actions.type";
import {
  SET_NOTIFICATION,
  SET_NOTIFICATIONS,
  SET_INITIAL,
  SET_LEADERS,
  SET_VISITS
} from "~/store/mutations.type";
import LiderancasService from "~/services/LiderancasService";
let firebase = require("nativescript-plugin-firebase");
const liderancasService = new LiderancasService();

const state = {
  notifications: {},
  leaders: {},
  visits: {}
};

const getters = {
  notifications: state => state.notifications,
  notifications_quant: state => state.notifications.length,
  leaders: state => state.leaders,
  visits: state => state.visits
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
  },
  [GET_LEADERS](context) {
    return new Promise((resolve, reject) => {
      liderancasService
        .leaders()
        .then(data => {
          console.info("leaders: " + data);
          context.commit(SET_LEADERS, data);
          resolve();
        })
        .catch(error => {
          context.commit(SET_ERROR, response.data.errors);
          reject(error);
        });
    });
  },
  [GET_VISITS](context) {
    return new Promise((resolve, reject) => {
      liderancasService
        .visits()
        .then(data => {
          console.info("visits: " + data);
          context.commit(SET_VISITS, data);
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
  },
  [SET_LEADERS](state, leaders) {
    state.leaders = leaders;
  },
  [SET_VISITS](state, visits) {
    state.visits = visits;
  }
};
// export this module.
export default {
  state,
  mutations,
  actions,
  getters
};
