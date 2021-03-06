import React from "react";
import Button from "antd/lib/button";

import { withFirebase } from "../";
import strings from "../../../constants/localization";

/**
 * A Button to sign out from firebase authentication.
 *
 * @param {Firebase Object} firebase
 */
const SignOutButton = ({ firebase }) => (
  <Button onClick={firebase.doSignOut}>{strings.SIGN_OUT}</Button>
);

export default withFirebase(SignOutButton);
