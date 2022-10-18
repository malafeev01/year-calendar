import './start-page.css';
import React from 'react';
import { Menu, Button, BackTop } from 'antd';
import moment from 'moment';

class StartPage extends React.Component {

  constructor (props) {
    super(props)

    this.signIn = this.signIn.bind(this);
  }

  signIn(){
    this.props.api.signIn().then(res => {
      window.location.href = '/profile';
    });
  }

  goToTop(){
    let url = window.location.origin;
    window.history.replaceState(null, null, url);
  }

  goToProfile(){
    window.location.href = '/profile';
  }

  goToSlide(event){
    let slideName = event.key;
    let url = window.location.origin + '/#' + slideName;
    window.history.replaceState(null, null, url);

    let slide = document.querySelector(`div[name="${slideName}"]`);
    slide.scrollIntoView({ behavior: 'smooth'});

  }
  render() {

    let button;
    let item;

    if (this.props.loading) {
      item =  <Menu.Item key="login" className="start-page-menu-item">
                Loading...
              </Menu.Item>

      button = <Button className="start-page-enter-button" type='ghost'
                       size='large' shape='round'>
               Loading...
              </Button>
    }
    else{
      item =  <Menu.Item key="login" className="start-page-menu-item"
                         onClick={ this.props.api.isSignedIn() ?  this.goToProfile  : this.signIn }>
                { this.props.api.isSignedIn() ? <> { this.props.api.getUserProfile().getName() }</> : <>Log in</> }
              </Menu.Item>

      button = <Button onClick={ this.props.api.isSignedIn() ?  this.goToProfile  : this.signIn }
              className="start-page-enter-button"
              type='ghost' size='large' shape='round'>

              { this.props.api.isSignedIn() ? <> Profile </> : <> Login via Google</> }

             </Button>
    }

    return (
    <>
      <Menu style={{ position: "fixed", zIndex: 1001, width: "100%", background: "#423c52"}}
            mode="horizontal" theme='dark'>

        { item }

        <Menu.Item key="contacts" className="start-page-menu-item" onClick={ this.goToSlide }>
          Contacts
        </Menu.Item>

        <Menu.Item key="donate" className="start-page-menu-item" onClick={ this.goToSlide }>
          Donates
        </Menu.Item>

        <Menu.Item key="about" className="start-page-menu-item" onClick={ this.goToSlide }>
          About
        </Menu.Item>


      </Menu>

      <div name="top" className='start-page-fake-menu'></div>
      <div className="start-page-landing-row start-page-start-box">
        <div className="start-page-start-box-background"> </div>
        <div className="start-page-start-box-backcolor"> </div>
        <div className="start-page-start-box-text">
          <h1 className="start-page-menu-header">Yearplan.app</h1>
          <h3 className="start-page-menu-pitch">For those who like long-term plans</h3>
          { button }
        </div>
      </div>

      <div name="about" className='start-page-fake-menu'></div>
      <div className="start-page-landing-row">
        <h1 className="start-page-menu-header-lightback">What is Yearplan.app</h1>

          <h3 className="start-page-menu-pitch-lightback">
            An application for long-term planning</h3>
          <h3 className="start-page-menu-pitch-lightback">
            Simple and comfortable user interface</h3>
          <h3 className="start-page-menu-pitch-lightback">
            Security - we don't collect your personal data on our servers, this application is fully integrated with Google.Calendar</h3>

          <div className="start-page-app-example-container">
            <div className="start-page-app-example"></div>
            <div className="start-page-app-example-fade"></div>
          </div>

      </div>

      <div name="donate" className='start-page-fake-menu'></div>
      <div className="start-page-landing-row">
        <h1 className="start-page-menu-header-lightback">Helping to the project</h1>
        <div className="start-page-app-donate-container">

          <blockquote>
            Hi, I have been looking for such a calendar app where on year view I can see all my planned events.
            Then I got the idea to create this application. You can use this app for free without any trial periods or annoying ads.
            At the same time, I'll be happy to get any kind of your support.
          <span>Alexey Malafeev (author of the project)</span>
          </blockquote>

        </div>

        <div className="start-page-app-donate-box">

          <form method="POST" action="https://yoomoney.ru/quickpay/confirm.xml" target='_blank'>
              <input type="hidden" name="receiver" value="410019253514907"/>
              <input type="hidden" name="quickpay-form" value="donate"/>
              <input type="hidden" name="targets" value="Thanks for yearplan.app"/>
              <div>
                <input name="sum" defaultValue="100" data-type="number" className="start-page-donate-input"/>
              </div>
              <div className="start-page-donate-currency">
                rub
              </div>
              <div className="start-page-donate-button-box">
                <input type="submit" value="Donate" className="start-page-donate-button"/>
              </div>

          </form>

        </div>
      </div>

      <div name="contacts" className='start-page-fake-menu'></div>
      <div className="start-page-landing-row">
        <h1 className="start-page-menu-header-lightback">Contacts</h1>
        <h3 className="start-page-menu-pitch-lightback">You are welcome to send any feedback. Please contact me.</h3>
        <div className="start-page-app-email-container">
          <a href="mailto:malafeev.alexey@gmail.com">malafeev.alexey@gmail.com</a>
        </div>
        <div className="start-page-app-social-container">
          <a href="https://github.com/malafeev01" target="_blank" rel="noreferrer">GitHub</a>
        </div>

        <div className="start-page-app-social-container">
          <a href="https://vk.com/malafeev_alexey" target="_blank" rel="noreferrer">VKontakte</a>
        </div>

        <div className="start-page-app-social-container">
          <a href="https://www.facebook.com/alexey.malafeev" target="_blank" rel="noreferrer">Facebook</a>
        </div>

        <div className="start-page-app-social-container">
          <a href="https://www.instagram.com/malafeev_alexey/" target="_blank" rel="noreferrer">Instagram</a>
        </div>

      </div>

      <div className="start-page-footer">
        <div className="start-page-footer-label">
          Alexey Malafeev @ { moment().year() }
        </div>
      </div>

      <BackTop onClick={this.goToTop}>
        <div className="start-page-back-top">Up</div>
      </BackTop>

    </>
  );
  }

}

export default StartPage;
