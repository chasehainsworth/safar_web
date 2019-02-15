import React, { Component } from "react";
import Layout from "antd/lib/layout";
import Menu from "antd/lib/menu";
import { AuthUserContext } from "../components/Firebase";
import { Link } from "react-router-dom";

const { Header } = Layout; 

class TopMenu extends Component {
    render() {
        return (
            <Header>
                <div className='logo'>S A F A R</div>
                <Menu theme='dark' mode='horizontal' style={{ height: "64px"}}>
                    <AuthUserContext.Consumer>
                    {authUser =>
                        authUser && (
                            <Link to="/Account">
                                <Menu.Item key='1' style={{ marginTop: "8px", marginLeft: "200px"}}>Account</Menu.Item>
                            </Link>
                        )
                    }
                    </AuthUserContext.Consumer>
                </Menu>
            </Header>
        )
    }
}

export default TopMenu;