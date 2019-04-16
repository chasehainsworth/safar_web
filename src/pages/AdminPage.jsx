import React, { Component } from "react";
import { withAuthorization, AuthUserContext } from "../components/Firebase";
import { Table, Divider, Button, Modal } from "antd";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import * as ROLES from "../constants/roles";
import * as ROUTES from "../constants/routes";
import strings from "../constants/localization";

//TODO: Move these into app.css
const pStyle = {
  margin: 5,
  padding: 0
};

const oddRows = {
  background: "#E0E0E0"
};

const confirm = Modal.confirm;

let camp = "";

/**
 * Creates a table listing all provider accounts by name, all languages they've uploaded
 * their information in, and the number of services they provide. Allows editing of
 * the provider's information and services, and lets you delete the provider.
 *
 * Only accessible by users marked as ADMIN. The standard role is ORGANIZATION, and
 * cannot access this page.
 */
class AdminPage extends Component {
  state = {
    loadingLangs: false,
    loadingServices: false,
    providers: []
  };

  columns = [
    {
      title: strings.ORGANIZATION_NAME,
      dataIndex: "names",
      key: "name",
      render: langs => (
        <div>
          {langs.map((l, i) => (
            <span key={i}>
              {l}
              {i !== langs.length - 1 && <Divider style={pStyle} />}
            </span>
          ))}
        </div>
      )
    },
    {
      title: strings.SUBMITTED_LANGUAGES,
      dataIndex: "languages",
      key: "langs",
      render: langs => (
        <div>
          {langs.map((l, i) => (
            <span key={i}>
              {l.language}
              {i !== langs.length - 1 && <Divider style={pStyle} />}
            </span>
          ))}
        </div>
      )
    },
    {
      title: strings.NUM_OF_SERVICES,
      dataIndex: "services",
      key: "services"
      // render: servs =>
      //   servs.map((s, i) => (
      //     <span key={i}>
      //       {s.name}
      //       {i !== servs.length - 1 && ", "}
      //     </span>
      //   ))
    },
    {
      title: strings.ACTIONS,
      key: "actions",
      render: (text, record, index) => (
        <span>
          <Link
            to={{
              pathname: ROUTES.UPDATE_ACC + "/",
              state: { id: record.uid }
            }}
          >
            <Button icon='edit'>{strings.EDIT_ORGANIZATION_INFO}</Button>
          </Link>
          <Divider type='vertical' />
          <Link
            to={{ pathname: ROUTES.SERVICES + "/", state: { id: record.uid } }}
          >
            <Button icon='diff'>{strings.EDIT_SERVICES}</Button>
          </Link>
          <Divider type='vertical' />
          <Button
            onClick={() => this.deleteOrgConfirm(this.state.providers[index])}
            type='danger'
          >
            {strings.DELETE}
          </Button>
        </span>
      )
    }
  ];

  /**
   * Provides a popup to confirm the deletion of an organization.
   *
   * @param org
   * @public
   */
  deleteOrgConfirm = org => {
    confirm({
      title: `Are you sure you want to delete this organization?`,
      okText: "Yes",
      okType: "danger",
      onOk: () => this.deleteOrg(org)
    });
  };

  /**
   * Deletes the provider's information and services from firebase.
   *
   * @param org
   * @public
   */
  deleteOrg = org => {
    this.props.firebase
      .services()
      .where("provider", "==", org.uid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref
            .collection("languages")
            .get()
            .then(langSnapshot => {
              langSnapshot.forEach(langDoc => {
                langDoc.ref.delete();
              });
              doc.ref.delete();
            });
        });
      });

    let provider = this.props.firebase.provider(org.uid);
    provider
      .collection("languages")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete();
        });
        provider.delete();
      });

    // Don't delete users from the user table - they will still be able to login,
    // but it will crash.
  };

  componentDidMount() {
    this.setState({ loadingLangs: false, loadingServices: false });

    this.unsubscribe = this.props.firebase
      .providers()
      .where("camp", "==", camp)
      .onSnapshot(snapshot => {
        let providersList = [];

        let idx = 0;
        if (snapshot.size === 0) {
          this.setState({ loadingLangs: false, loadingServices: false });
        }
        snapshot.forEach(doc => {
          let names = [];
          let languages = [];
          // let services = [];
          let services = 0;

          let gotLangs = false,
            gotServices = false;
          this.props.firebase
            .provider(doc.id)
            .collection("languages")
            .get()
            .then(langSnapshot => {
              if (langSnapshot.size === 0) {
                this.setState({ loadingLangs: false });
              }
              langSnapshot.forEach(langDoc => {
                names.push(langDoc.data().orgName);
                languages.push({ language: langDoc.id, ...langDoc.data() });
              });

              if (gotServices) {
                providersList.push({
                  key: idx,
                  uid: doc.id,
                  names,
                  // ...doc.data(),
                  services,
                  languages
                });

                if (idx === snapshot.size - 1) {
                  this.setState({
                    loadingLangs: false,
                    providers: [...providersList]
                  });
                }
                idx++;
                console.log("idx p", idx);
              } else {
                gotLangs = true;
              }
            })
            .catch(error => console.log(error));

          this.props.firebase
            .services()
            .where("provider", "==", doc.id)
            .get()
            .then(servsSnapshot => {
              // servsSnapshot.forEach(servDoc => {
              //   services.push(servDoc.id);
              // });
              services = servsSnapshot.size;
              if (services === 0) {
                this.setState({ loadingServices: false });
              }
              if (gotLangs) {
                providersList.push({
                  key: idx,
                  uid: doc.id,
                  names,
                  // ...doc.data(),
                  services,
                  languages
                });

                if (idx === snapshot.size - 1) {
                  this.setState({
                    loadingServices: false,
                    providers: [...providersList]
                  });
                }
                idx++;
              } else {
                gotLangs = true;
              }
            })
            .catch(error => console.log(error));
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    console.log(this.state.providers);
    return (
      <div style={{ padding: 50 }}>
        <AuthUserContext.Consumer>
          {authUser => (camp = authUser.camp)}
        </AuthUserContext.Consumer>
        <div style={{ textAlign: "right", marginBottom: 10 }}>
          <Link to={ROUTES.ADD_ACC}>
            <Button type='primary' icon='plus'>
              {strings.ADD_NEW_ORGANIZATION_ACCOUNT}
            </Button>
          </Link>
        </div>
        <Table
          columns={this.columns}
          dataSource={this.state.providers}
          loading={this.state.loadingLangs && this.state.loadingServices}
          onRow={(record, rowIndex) => rowIndex % 2 === 1 && { style: oddRows }}
        />
      </div>
    );
  }
}

AdminPage.propTypes = {
  /** The firebase instance. */
  firebase: PropTypes.object
};

const condition = authUser => !!authUser && authUser.role === ROLES.ADMIN;

export default withAuthorization(condition)(AdminPage);
