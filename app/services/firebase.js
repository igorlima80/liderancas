let firebase = require("nativescript-plugin-firebase");

let firebaseService = {
    init() {
        firebase
            .subscribeToTopic("notifications")
            .then(() => console.log("Subscribed to topic notifications"));
        // firebase.getCurrentPushToken().then((token) => {
        //   may be null if not known yet
        //   console.log(`Current push token: ${token}`);
        // });
        firebase
            .init({
                showNotificationsWhenInForeground: true,
                onMessageReceivedCallback: function (message) {
                    console.log("Title: " + message.title);
                    console.log("Body: " + message.body);
                    // if your server passed a custom property called 'foo', then do this:
                    // console.log(
                    //     "Value of Title: " + message.data.title
                    // );
                    // console.log(
                    //   "Value of Body: " + message.data.body
                    // );
                    //goToPage(routes.Activity);
                },
                onPushTokenReceivedCallback: function (token) {
                    console.log("Firebase push token: " + token);
                }
            })
            .then(
                function () {
                    console.log("firebase.init done");
                },
                function (error) {
                    console.log("firebase.init error: " + error);
                }
            );
    }
}



export default firebaseService;