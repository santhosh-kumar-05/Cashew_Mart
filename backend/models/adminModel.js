const admin = require("../config/adminCredentials");

class AdminModel {
  static findAdmin(username) {
    if (username === admin.username) {
      return admin;
    }
    return null;
  }
}

module.exports = AdminModel;
