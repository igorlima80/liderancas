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

  leaders() {
    return http
      .request({
        url: this.baseUrl + "leaders",
        method: "GET",
        headers: this.getHeaders()
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Leaders: " + data);
        return data;
      });
  }

  visits() {
    return http
      .request({
        url: this.baseUrl + "visits",
        method: "GET",
        headers: this.getHeaders()
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Visits: " + data);
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
