import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Menu, Icon, Spin, Tooltip, Button } from "antd";
import ReactGA from "react-ga";

import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { USERS } from "../../../utils/constants/endpoints";
import NotificationsBox from "../NotificationsBox/NotificationsBox.jsx";
import "./style.scss";
import {
  USER_TYPES,
  USER_TYPE_NAMES,
  gradIcon
} from "../../../utils/constants/constants";

const { SubMenu } = Menu;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_type: this.props.cookie("get", "user_type"),
      is_demo_user:
        this.props.cookie("get", "is_demo_user") != ("" || null)
          ? this.props.cookie("get", "is_demo_user")
          : false,
      current:
        window.location.pathname != "/blogs"
          ? window.location.pathname
          : window.location.search != "?edit=true"
          ? window.location.pathname
          : window.location.pathname + window.location.search,
      request: false,
      redirect: false
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleSyncUserEmail = this.handleSyncUserEmail.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  componentDidUpdate() {
    if (
      this.state.current != window.location.pathname &&
      this.state.current != window.location.pathname + window.location.search &&
      this.state.request
    ) {
      this.setState({ request: false, redirect: true });
    }
    if (
      (this.state.current === window.location.pathname ||
        this.state.current ===
          window.location.pathname + window.location.search) &&
      this.state.redirect
    ) {
      this.setState({ redirect: false });
    }
    if (this.state.is_demo_user != this.props.cookie("get", "is_demo_user")) {
      this.setState({ is_demo_user: this.props.cookie("get", "is_demo_user") });
    }
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.toggleNotifications(false);
    }
  }

  handleNotifications() {
    this.props.notificationCheck();
    this.props.toggleNotifications(true);
    ReactGA.event({
      category: "Notifications",
      action: "Clicked Notifications Icon",
      label: "on Header"
    });
  }

  async handleSyncUserEmail() {
    if (
      this.props.cookie("get", "google_access_token_expiration") == ("" || null)
    ) {
      this.props.alert(
        5000,
        "info",
        "Automatic sync is available for users who logged in with Gmail account.\n If you have never logged in with your Gmail, you can link your account with Google account on profile page."
      );
    } else {
      let config = { method: "GET" };
      await this.props.handleTokenExpiration("header handleSyncUserEmail");
      axiosCaptcha(USERS("syncUserEmails"), config).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success) {
            this.props.passStatesToApp(
              "syncResponseTimestamp",
              new Date().getTime()
            );
            this.props.passStatesToApp("isSynchingGmail", true);
          }
        }
      });
    }
  }

  async handleMenuClick(event) {
    const setStateAsync = state => {
      return new Promise(resolve => {
        this.setState(state, resolve);
      });
    };
    this.setState({ request: true });
    let page = event.key;
    if (page === "/logout") {
      this.props.passStatesToApp("logout", true);
      let redirectPage =
        this.state.user_type.name == "Alumni" ? "/alumni" : "/home";
      await setStateAsync({ current: redirectPage });
      this.props.handleSignOut();
    } else if (page === "/demoToSignup") {
      let redirectPage =
        this.state.user_type.name == "Alumni" ? "/alumni/signup" : "/signup";
      this.props.passStatesToApp("logout", true);
      await setStateAsync({ current: redirectPage });
      this.props.handleSignOut();
    } else if (
      ["/events", "/events?edit=true"].includes(page) &&
      window.location.pathname.includes("event")
    ) {
      this.setState({ current: "/action?type=redirect&" + page });
    } else if (
      ["/blogs", "/blogs?edit=true"].includes(page) &&
      window.location.pathname.includes("blogs")
    ) {
      this.setState({ current: "/action?type=redirect&" + page });
    } else {
      this.setState({ current: page });
    }
  }

  generateLoggedInHeader() {
    const exclusiveHeaderName =
      this.state.user_type.name === "Student"
        ? USER_TYPE_NAMES[this.state.user_type.id]["header"] + " "
        : "";
    const isDashboardOpenedByDefault =
      window.location.pathname == "/" ? "/dashboard" : "";
    const profilePhotoUrl = this.props.profilePhotoUrl
      ? this.props.profilePhotoUrl
      : "../../../src/assets/icons/SeyfoIcon@3x.png";
    const style = this.state.is_demo_user
      ? { height: "11Ox" }
      : { height: "60x" };
    const spinIcon = (
      <Icon type="loading" style={{ fontSize: 24, color: "black" }} spin />
    );

    const jobMenu = (
      <SubMenu
        title={
          <div className="header-icon menu-icon">
            <img src="../../../src/assets/icons/BusinessIcon.png" />
          </div>
        }
      >
        <Menu.Item key="/dashboard">Dashboard</Menu.Item>
        <Menu.Item key="/metrics">Metrics</Menu.Item>
        <Menu.Item key="/companies">Companies</Menu.Item>
        <Menu.Item key="/jobs">Jobs</Menu.Item>
      </SubMenu>
    );

    const communityMenu = (
      <SubMenu
        title={
          <div className="header-icon menu-icon">
            <img src="../../../src/assets/icons/SchoolIcon.png" />
          </div>
        }
      >
        <Menu.Item key="/blogs">{exclusiveHeaderName + "Blog"}</Menu.Item>
        <Menu.Item key="/events">{exclusiveHeaderName + "Events"}</Menu.Item>
      </SubMenu>
    );

    const alumniMenu = (
      <SubMenu title={<div className="header-icon menu-icon">{gradIcon}</div>}>
        <Menu.Item key="/alumni/home">Home</Menu.Item>
        <Menu.Item key="/alumni/network">Network</Menu.Item>
        <Menu.Item key="/blogs">Blog</Menu.Item>
        <Menu.Item key="/events">Events</Menu.Item>
      </SubMenu>
    );

    return (
      <div className="header-container" style={style}>
        <div className="left-container">
          <div className="jobhax-logo-container">
            <div
              className="jobhax-logo"
              onClick={() =>
                this.setState({ current: "/dashboard", request: true })
              }
            />
          </div>
        </div>
        <div className="right-container">
          {window.location.pathname == "/dashboard" &&
            (!this.props.isSynchingGmail ? (
              <div className="header-icon general">
                <Tooltip placement="bottom" title="sync">
                  <img
                    onClick={this.handleSyncUserEmail}
                    style={{ height: 16 }}
                    src="../../../src/assets/icons/SyncIcon@3x.png"
                  />
                </Tooltip>
              </div>
            ) : (
              <div className="header-icon general">
                <Spin indicator={spinIcon} />
              </div>
            ))}
          <Menu
            onClick={event => this.handleMenuClick(event)}
            selectedKeys={[
              window.location.pathname,
              isDashboardOpenedByDefault
            ]}
            mode="horizontal"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            {this.state.user_type.name === "Alumni" &&
              this.state.user_type.name !== "Career Service" &&
              alumniMenu}
            {this.state.user_type.name !== "Career Service" && jobMenu}
            {this.state.user_type.name === "Alumni" &&
              this.state.user_type.name === "Career Service" &&
              communityMenu}
          </Menu>
          {!this.props.isNotificationsShowing ? (
            <div
              className="header-icon general"
              onClick={() => this.handleNotifications()}
            >
              <Tooltip placement="bottom" title="notifications">
                <img
                  src="../../../src/assets/icons/beta_flag_2.png"
                  style={{
                    position: "absolute",
                    height: "24px",
                    margin: "0px 0px 0 -2px"
                  }}
                />
                <img src="../../../src/assets/icons/NotifIcon@3x.png" />
              </Tooltip>
            </div>
          ) : (
            <div className="header-icon general" ref={this.setWrapperRef}>
              <img
                src="../../../src/assets/icons/NotifIcon@3x.png"
                onClick={() => this.props.toggleNotifications(false)}
              />
              <NotificationsBox
                notificationsList={this.props.notificationsList}
              />
            </div>
          )}
          <Menu
            onClick={event => this.handleMenuClick(event)}
            selectedKeys={[this.state.current]}
            mode="horizontal"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <SubMenu
              title={
                <div className="header-icon user-icon">
                  <img src={profilePhotoUrl} />
                </div>
              }
            >
              <Menu.Item key="/profile">Profile</Menu.Item>
              {this.state.user_type.blog_creation_enabled &&
                this.state.user_type.name === "none" &&
                window.screen.availWidth > 800 && (
                  <Menu.Item key="/blogs?edit=true">Add Blog</Menu.Item>
                )}
              <Menu.Item key="/logout">
                <Icon type="logout" />
                Logout
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </div>
    );
  }

  generateNonLoggedInHeader() {
    let signupRedirect =
      this.state.current === "/alumni" ? "/alumni/signup" : "/signup";
    let functional = !(
      this.props.cookie("get", "signup_flow_completed") === "false"
    );
    return (
      <div className="header-container">
        <div className="left-container">
          <div className="jobhax-logo-container">
            <div
              className="jobhax-logo"
              onClick={() =>
                functional && this.setState({ current: "/home", request: true })
              }
            />
          </div>
          <div
            className="option"
            onClick={() =>
              functional &&
              this.setState({ current: "/aboutus", request: true })
            }
          >
            About us
          </div>
        </div>
        <div className="right-container out">
          <div
            className="option"
            onClick={() =>
              functional && this.setState({ current: "/signin", request: true })
            }
          >
            Log in
          </div>
          <div>/</div>
          <div
            className="option"
            onClick={() =>
              functional &&
              this.setState({ current: signupRedirect, request: true })
            }
          >
            Sign up
          </div>
        </div>
      </div>
    );
  }

  generateDemoBanner() {
    return (
      <div className="demo-banner">
        Demo mode
        <div className="buttons-container">
          <Button onClick={() => this.handleMenuClick({ key: "/logout" })}>
            Exit demo
          </Button>
          <Button
            type="primary"
            onClick={() => this.handleMenuClick({ key: "/demoToSignup" })}
          >
            Sign up
          </Button>
        </div>
        <div className="demo-banner-height"></div>
      </div>
    );
  }

  render() {
    let header = "";
    const headerHeight = this.state.is_demo_user
      ? { height: 110 }
      : { height: 60 };
    if (this.state.redirect) {
      return <Redirect to={this.state.current} />;
    }
    if (this.props.isUserLoggedIn) {
      header = this.generateLoggedInHeader();
    } else {
      header = this.generateNonLoggedInHeader();
    }
    return (
      <div>
        <div className="header-big-container">
          {this.state.is_demo_user && this.generateDemoBanner()}
          {header}
        </div>
        <div style={headerHeight}></div>
      </div>
    );
  }
}

export default Header;
