import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "antd";
import { AuthUserContext, withFirebase } from "../components/Firebase";
import { withRouter } from "react-router-dom";
import SignOutButton from "../components/Firebase/Session/SignOutButton";

// import strings from "../constants/localization";
import * as ROLES from "../constants/roles";
import * as ROUTES from "../constants/routes";

class HomePage extends Component {
  state = {};
  render() {
    return (
      // Push to Login, Admin, or UpdateAccountPage depending on auth status
      <AuthUserContext.Consumer>
        {authUser => {
          console.log(authUser);
          authUser === null && (this.props.history.push(ROUTES.LOGIN));
          authUser && authUser.role === ROLES.ADMIN && (this.props.history.push(ROUTES.ADMIN));
          authUser && authUser.role === ROLES.ORGANIZATION && (this.props.history.push(ROUTES.UPDATE_ACC));
        }}
      </AuthUserContext.Consumer>
      // <div className='text-center'>
      //   <h1 className='title'>Safar</h1>
      //   <h2 style={{ marginBottom: 10 }}>{strings.ORGANIZATION_PORTAL}</h2>
      //   <Row type='flex' justify='center' gutter={8}>
      //     <Col xs={24} sm={6} md={4} lg={3} xl={2}>
      //       <AuthUserContext.Consumer>
      //         {authUser =>
      //           !authUser && (
      //             <Button type='primary' size='large'>
      //               {strings.REQUEST_ACCESS}
      //             </Button>
      //           )
      //         }
      //       </AuthUserContext.Consumer>
      //     </Col>
      //     <Col xs={24} sm={4} md={4} lg={3} xl={4}>
      //       <AuthUserContext.Consumer>
      //         {authUser =>
      //           !authUser ? (
      //             <Link to='/Login'>
      //               <Button type='primary' size='large'>
      //                 {strings.LOGIN}
      //               </Button>
      //             </Link>
      //           ) : (
      //             <SignOutButton />
      //           )
      //         }
      //       </AuthUserContext.Consumer>
      //     </Col>
      //   </Row>
      // </div>
    );
  }
}

export default withRouter(withFirebase(HomePage));
