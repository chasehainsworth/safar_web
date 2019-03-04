import React, { Component } from "react";
import { withAuthorization } from "../components/Firebase";

import * as ROLES from "../constants/roles";

class AdminPage extends Component {
  state = {};
  render() {
    return <div />;
  }
}

const condition = authUser => !!authUser && authUser.role === ROLES.ADMIN;

export default withAuthorization(condition)(AdminPage);
