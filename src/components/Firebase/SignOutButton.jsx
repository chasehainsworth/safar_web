import React from "react";
import Button from "antd/lib/button";

import { withFirebase } from "./";

const SignOutButton = ({ firebase }) => (
  <Button onClick={firebase.doSignOut}>Sign Out</Button>
);

export default withFirebase(SignOutButton);
