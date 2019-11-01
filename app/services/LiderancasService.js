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

  leader() {
    return http
      .request({
        url: this.baseUrl + "leader",
        method: "GET",
        headers: this.getHeaders()
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Leader: " + data);
        return data;
      });
  }

  updateLeader(leader) {
    return http
      .request({
        // url: this.baseUrl + "updateleader",
        url: `http://liderancas.net.br/api/leaders/${leader.id}`,
        method: "POST",
        headers: this.getHeaders(),
        content: JSON.stringify(leader)
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Leader: " + data);
        return data;
      });
  }

  voters(leader_id) {
    return http
      .request({
        // url: this.baseUrl + "voters",
        url: `http://liderancas.net.br/api/leaders/${leader_id}/members`,
        method: "GET",
        headers: this.getHeaders()
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Members: " + data);
        return data;
      });
  }

  nearMembers(info) {
    return http
      .request({
        // url: this.baseUrl + "voters",
        url: "http://liderancas.net.br/api/members/find",
        method: "POST",
        headers: this.getHeaders(),
        content: JSON.stringify(info)
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Members: " + data);
        return data;
      });
  }

  unvisitedMembers(info) {
    return http
      .request({
        // url: this.baseUrl + "voters",
        url: "http://liderancas.net.br/api/members/find_unvisited",
        method: "POST",
        headers: this.getHeaders(),
        content: JSON.stringify(info)
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Members: " + data);
        return data;
      });
  }

  updateVoter(voter) {
    return http
      .request({
        // url: this.baseUrl + "voterupdate",
        url: `http://liderancas.net.br/api/members/${voter.id}`,
        method: "PUT",
        headers: this.getHeaders(),
        content: JSON.stringify({
          member: voter
        })
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Voter: " + data);
        return data;
      });
  }

  addVoter(voter) {
    return http
      .request({
        url: this.baseUrl + "voteradd",
        method: "POST",
        headers: this.getHeaders(),
        content: JSON.stringify({
          voter: voter
        })
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Voter: " + data);
        return data;
      });
  }

  visits(voter_id) {
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

  updateVisit(visit) {
    return http
      .request({
        url: this.baseUrl + "visitupdate",
        method: "POST",
        headers: this.getHeaders(),
        content: JSON.stringify({
          visit: visit
        })
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Visit: " + data);
        return data;
      });
  }

  addVisit(visit) {
    return http
      .request({
        // url: this.baseUrl + "visitadd",
        url: `http://liderancas.net.br/api/visits/find_by_member`,
        method: "POST",
        headers: this.getHeaders(),
        content: JSON.stringify(visit)
      })
      .then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        console.info("Visit: " + data);
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
