import * as http from "tns-core-modules/http";
import BackendService from "./BackendService";

export default class LiderancasService extends BackendService {
  
  notifications() {
    return http
      .request({
        url: this.baseUrl + "notifications",
        method: "GET",
        headers: this.getHeaders()
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Notifications: " + data);
        return data;
      });
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
