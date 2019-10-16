import * as http from "tns-core-modules/http";
import BackendService from "./BackendService";

export default class LoginService extends BackendService {
  login(user) {
    return http
      .request({
        url: this.baseUrl + "login",
        // url: "http://165.22.187.114:21460/api/leaders/login",
        method: "POST",
        headers: this.getCommonHeaders(),
        content: JSON.stringify({
          cpf: user.cpf
          // username: user.email,
          // password: user.password,
          // deviceToken: this.deviceToken
        })
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        return data;
      });
  }

  facebookLogin(tokenResult) {
    return http
      .request({
        url: this.baseUrl + "facebooklogin",
        method: "POST",
        headers: this.getCommonHeaders(),
        content: JSON.stringify({
          tokenResult: tokenResult
        })
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        return data;
      });
  }

  googleLogin(tokenResult) {
    return http
      .request({
        url: this.baseUrl + "googlelogin",
        method: "POST",
        headers: this.getCommonHeaders(),
        content: JSON.stringify({
          tokenResult: tokenResult
        })
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        return data;
      });
  }

  register(user) {
    return http
      .request({
        url: this.baseUrl + "register",
        method: "POST",
        headers: this.getCommonHeaders(),
        content: JSON.stringify({
          email: user.email,
          password: user.password
        })
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("User registered: ", data);
        return data;
      });
  }

  resetPassword(email) {
    return http
      .request({
        url: this.baseUrl + "resetpassword",
        method: "POST",
        headers: this.getCommonHeaders(),
        content: JSON.stringify({
          email: email
        })
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Reset password for email: " + data.result);
        return data;
      });
  }

  user() {
    return http
      .request({
        url: this.baseUrl + "user",
        method: "GET",
        headers: this.getHeaders()
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info(data);
        return data;
      });
  }

  // updateUser() {
  //   return http
  //     .request({
  //       url: this.baseUrl + "updateuser",
  //       method: "POST",
  //       headers: this.getCommonHeaders()
  //     })
  //     .then(this.validateCode)
  //     .then(this.getJson)
  //     .then(data => {
  //       console.info("User update data: " + data);
  //       return data;
  //     });
  // }

  getCommonHeaders() {
    return {
      "Content-Type": "application/json"
      // "Authorization": "Basic" + this.token,
    };
  }

  getHeaders(toAppend = {}) {
    return Object.assign(
      {
        "Content-Type": "application/json",
        Authorization: "Basic " + this.token
      },
      toAppend
    );
  }
}
