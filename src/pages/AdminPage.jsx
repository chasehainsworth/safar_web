import React, { Component } from "react";
import { withAuthorization } from "../components/Firebase";
import { Table, Divider, Button } from "antd";
import { Link } from "react-router-dom";

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

const columns = [
  {
    title: strings.PROVIDER_NAME,
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
    render: (text, record) => (
      <span>
        <Link
          to={{ pathname: ROUTES.UPDATE_ACC + "/", state: { id: record.uid } }}
        >
          <Button icon='edit'>{strings.EDIT_PROVIDER_INFO}</Button>
        </Link>
        <Divider type='vertical' />
        <Link
          to={{ pathname: ROUTES.SERVICES + "/", state: { id: record.uid } }}
        >
          <Button icon='diff'>{strings.EDIT_SERVICES}</Button>
        </Link>
      </span>
    )
  }
];

class AdminPage extends Component {
  state = {
    loadingLangs: false,
    loadingServices: false,
    providers: []
  };
  componentDidMount() {
    this.setState({ loadingLangs: true, loadingServices: true });

    this.unsubscribe = this.props.firebase.providers().onSnapshot(snapshot => {
      let providersList = [];

      let idx = 0;
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
        <div style={{ textAlign: "right", marginBottom: 10 }}>
          <Link to={ROUTES.ADD_ACC}>
            <Button type='primary' icon='plus'>
              {strings.ADD_NEW_PROVIDER_ACCOUNT}
            </Button>
          </Link>
        </div>
        <Table
          columns={columns}
          dataSource={this.state.providers}
          loading={this.state.loadingLangs && this.state.loadingServices}
          onRow={(record, rowIndex) => rowIndex % 2 === 1 && { style: oddRows }}
        />
      </div>
    );
  }
}

const condition = authUser => !!authUser && authUser.role === ROLES.ADMIN;

export default withAuthorization(condition)(AdminPage);
