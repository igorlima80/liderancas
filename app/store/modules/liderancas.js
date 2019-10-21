import {
  CHANGE_NOTIFICATION,
  GET_NOTIFICATIONS,
  UPDATE_LEADER,
  GET_VOTERS,
  UPDATE_VOTER,
  ADD_VOTER,
  GET_VISITS,
  UPDATE_VISIT
} from "~/store/actions.type";
import {
  SET_NOTIFICATION,
  SET_NOTIFICATIONS,
  SET_INITIAL,
  SET_VOTERS,
  SET_VISITS
} from "~/store/mutations.type";
import LiderancasService from "~/services/LiderancasService";
let firebase = require("nativescript-plugin-firebase");
const liderancasService = new LiderancasService();

const state = {
  notifications: {},
  voters:{},
  visits: {}
};

const getters = {
  notifications: state => state.notifications,
  notifications_quant: state => state.notifications.length,
  voters: state => state.voters,
  visits: state => state.visits,
  recent_voters: state => state.voters.slice(0, 5),
  near_voters: state => state.voters.slice(0, 5)
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
  [UPDATE_LEADER](context, leader) {
    return new Promise((resolve, reject) => {
      liderancasService
        .updateLeader(leader)
        .then(data => {
          context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [GET_VOTERS](context) {
    return new Promise((resolve, reject) => {
      liderancasService
        .voters()
        .then(data => {
          console.info("Voters: " + data);
          context.commit(SET_VOTERS, data);
          resolve();
        })
        .catch(error => {
          context.commit(SET_ERROR, response.data.errors);
          reject(error);
        });
    });
  },
  [ADD_VOTER](context, voter) {
    return new Promise((resolve, reject) => {
      liderancasService
        .addVoter(voter)
        .then(data => {
          // context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [UPDATE_VOTER](context, voter) {
    return new Promise((resolve, reject) => {
      liderancasService
        .updateVoter(voter)
        .then(data => {
          // context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [UPDATE_VISIT](context, visit) {
    return new Promise((resolve, reject) => {
      liderancasService
        .updateVisit(visit)
        .then(data => {
          // context.commit(SET_AUTH, data);
          resolve(data);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
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
  [SET_VOTERS](state, voters) {
    state.voters = voters;
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
