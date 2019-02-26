import React, { Component } from "react";
import { List, Card } from "antd";
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
      let providersList = [];
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

            this.setState({
              loading: false,
              providers: providersList
            });
          })
          .catch(error => console.log(error));
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

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
        dataSource={this.state.providers}
        loading={this.state.loading}
        renderItem={item => (
          <List.Item>
            <Link to={"/UpdateAccount/" + item.uid}>
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
        )}
      />
    );
  }
}

const condition = authUser => !!authUser && authUser.role === ROLES.ADMIN;
export default withAuthorization(condition)(ListAccountsPage);
