import React, { Component } from "react";
import { List, Card, Spin, Icon } from "antd";
import { Link } from "react-router-dom";

import { withAuthorization } from "../components/Firebase";

import * as ROLES from "../constants/roles";

class ListAccountsPage extends Component {
  state = {
    loading: false,
    providers: []
  };

  componentDidMount() {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase.providers().onSnapshot(snapshot => {
      let providersList = [{ isFirst: true }];
      let idx = 0; // firebase snapshot.forEach does not give index
      snapshot.forEach(doc => {
        let languages = [];
        this.props.firebase
          .provider(doc.id)
          .collection("languages")
          .get()
          .then(langSnapshot => {
            langSnapshot.forEach(langDoc =>
              languages.push({ language: langDoc.id, ...langDoc.data() })
            );
            providersList.push({
              uid: doc.id,
              ...doc.data(),
              languages
            });

            if (idx === snapshot.size - 1) {
              this.setState({
                loading: false,
                providers: providersList
              });
            }
            idx++;
          })
          .catch(error => console.log(error));
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // TODO: switch to a table
  render() {
    return (
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3
        }}
        style={{ margin: 10 }}
        dataSource={this.state.providers}
        loading={this.state.loading && <Spin centered />}
        renderItem={item =>
          item.isFirst ? (
            <List.Item>
              <Link to='/AddAccount'>
                <Card style={{ textAlign: "center" }}>
                  <Icon type='plus' style={{ fontSize: 30 }} />
                  <p style={{ fontSize: 15 }}>Add Provider</p>
                </Card>
              </Link>
            </List.Item>
          ) : (
            <List.Item>
              <Link
                to={{ pathname: "/UpdateAccount/", state: { id: item.uid } }}
              >
                <Card title={item.email}>
                  <b>Languages:</b>
                  {item.languages.map(c => {
                    return (
                      <p key={c.orgName + c.language}>
                        {c.language + " - " + c.orgName}
                      </p>
                    );
                  })}
                </Card>
              </Link>
            </List.Item>
          )
        }
      />
    );
  }
}

const condition = authUser => !!authUser && authUser.role === ROLES.ADMIN;
export default withAuthorization(condition)(ListAccountsPage);
