import './navigation-bar.css';
import calnderIcon from '../../img/calendar.png';
import React from 'react';
import { Menu } from 'antd';
import { Link } from "react-router-dom";
import { showErrorNotification } from '../../common/notification.js';
import { logInfo, logError } from '../../common/utilities.js';

const { SubMenu } = Menu;



class ProfileNavBar extends React.Component {

  constructor(props) {
    super(props)
    this.onExit = this.onExit.bind(this);

  }

  goToHome(){
    window.location.href = '/';
  }

  onExit(){
    logInfo(this, "onExit: starting signing out");
    this.props.api.signOut().then(() => {
      logInfo(this, "onExit: signed out");
      window.location.href = '/';
    }).catch( (error) => {
      logError(this, JSON.stringify(error));
      showErrorNotification(error);
    });
  }


  render (){
    logInfo(this, 'render: Rendering navigation bar');
    let smallScreen = window.screen.width < 430 ? true : false;
    let appName;

    if (!smallScreen){
      appName = <Menu.Item className="profile-nav-bar-title">
                      <Link to="/">Годовой календарь</Link>
                    </Menu.Item>
    }
    else {
      appName = <></>;
    }

    return (
      <Menu mode="horizontal" theme="light" inlineCollapsed={ false }>
      <Menu.Item className="profile-nav-bar-title" onClick={this.goToHome}>
           <div className="profile-nav-bar-icon" style={{"backgroundImage": `url(${calnderIcon})`}}></div>
      </Menu.Item>

        { appName }

        <SubMenu className="profile-nav-bar-menu" key="SubMenu"
                title={this.props.api.getUserProfile().getName()}
                icon={<div className="profile-nav-bar-avatar"
                           style={{"backgroundImage": `url(${this.props.api.getUserProfile().getImageUrl()})`}}></div>}>

          <Menu.Item key="logout" className="profile-nav-bar-menu-exit" onClick={ this.onExit }>Выйти</Menu.Item>

        </SubMenu>

      </Menu>
    );
  }

}

export default ProfileNavBar;
