import './privacy-page.css';
import React from 'react';
import { Menu } from 'antd';
import moment from 'moment';

class PrivacyPage extends React.Component {

  constructor (props) {
    super(props)

    this.signIn = this.signIn.bind(this);
  }

  signIn(){
    this.props.api.signIn().then(res => {
      window.location.href = '/profile';
    });
  }


  goToProfile(){
    window.location.href = '/profile';
  }

  render() {

    let item;

    if (this.props.loading) {
      item =  <Menu.Item key="login" className="privacy-page-menu-item">
                Loading...
              </Menu.Item>
    }
    else{
      item =  <Menu.Item key="login" className="privacy-page-menu-item"
                         onClick={ this.props.api.isSignedIn() ?  this.goToProfile  : this.signIn }>
                { this.props.api.isSignedIn() ? <> { this.props.api.getUserProfile().getName() }</> : <>Log in</> }
              </Menu.Item>
    }

    return (
    <>
      <Menu style={{ position: "fixed", zIndex: 1001, width: "100%", background: "#423c52"}}
            mode="horizontal" theme='dark'>

        { item }

      </Menu>

      <div name="top" className='privacy-page-fake-menu'></div>
      <div name="top" className='privacy-page-fake-menu'></div>
      <div className="privacy-page-back">
      [ <a href='/'>Back</a> ]
      </div>
      <div className="privacy-page-landing-row">
        <h1 className="privacy-page-menu-header-lightback">Privacy Policy</h1>

          <h3 className="privacy-page-menu-pitch-lightback">
          Contacts</h3>
          <div className="privacy-page-paragraph">
            In case of any questions, please contact me via email - <a href="mailto:malafeev.alexey@gmail.com">malafeev.alexey@gmail.com</a>
          </div>

          <h3 className="privacy-page-menu-pitch-lightback">
          What kind of data do we collect?</h3>
          <div className="privacy-page-paragraph">
            Yearplan.app doesn't collect any user data. There are no databases, our server is used only for OAuth authentication.<br/>
            When you log in to the system, you will receive an access token. This token will be saved in the cookies of your browser.
            <br/>
            Token is not stored on the server side!
            <br/><br/>
            After you got the token, it will be used for access to Calendar API of your Google Account. <br/>
            What is our server part role here? It just resends requests to Google Calendar API.<br/> 
            Server part doesn't have logging system, so we're not collect any information in the requests. <br/>
            The app for its work will create self own calendar, so your data in Google Calendar shouldn't be damaged. <br/>
            <br/>
            Yearplan.app web application is a fully open-source project.
            You can find all the sources on GitHub - [<a href="https://github.com/malafeev01/yearplan.app.backend">link</a>].

          </div>
          <h3 className="privacy-page-menu-pitch-lightback">
          Cookies, Local Storage and analytics</h3>
          <div className="privacy-page-paragraph"> 
            Google API data and your access token to this API will be stored in the cookies. <br/>
            Your calendar ID for creating events will be stored in the local storage of your browser. <br/>
            All these data are not sharing anywhere. <br/>
            YearPlan.app is not using any analytics systems. Frontend part of the application is available in GitHub - [<a href='https://github.com/malafeev01/yearplan.app'>link</a>]
            <br/><br/>
          </div>
      </div>

      <div className="privacy-page-footer">
        <div className="privacy-page-footer-label">
          Alexey Malafeev @ { moment().year() }
        </div>
      </div>

    </>
  );
  }

}

export default PrivacyPage;
