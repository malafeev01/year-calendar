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
                Загрузка...
              </Menu.Item>

      button = <Button className="start-page-enter-button" type='ghost'
                       size='large' shape='round'>
               Загрузка...
              </Button>
    }
    else{
      item =  <Menu.Item key="login" className="start-page-menu-item"
                         onClick={ this.props.api.isSignedIn() ?  this.goToProfile  : this.signIn }>
                { this.props.api.isSignedIn() ? <> { this.props.api.getUserProfile().getName() }</> : <>Войти</> }
              </Menu.Item>

      button = <Button onClick={ this.props.api.isSignedIn() ?  this.goToProfile  : this.signIn }
              className="start-page-enter-button"
              type='ghost' size='large' shape='round'>

              { this.props.api.isSignedIn() ? <> Перейти в профиль </> : <> Войти через Google</> }

             </Button>
    }

    return (
    <>
      <Menu style={{ position: "fixed", zIndex: 1, width: "100%", background: "#423c52"}}
            mode="horizontal" theme='dark'>

        { item }

        <Menu.Item key="contacts" className="start-page-menu-item" onClick={ this.goToSlide }>
          Контакты
        </Menu.Item>

        <Menu.Item key="donate" className="start-page-menu-item" onClick={ this.goToSlide }>
          Донаты
        </Menu.Item>

        <Menu.Item key="about" className="start-page-menu-item" onClick={ this.goToSlide }>
          О проекте
        </Menu.Item>


      </Menu>

      <div name="top" className='start-page-fake-menu'></div>
      <div className="start-page-landing-row start-page-start-box">
        <div className="start-page-start-box-background"> </div>
        <div className="start-page-start-box-backcolor"> </div>
        <div className="start-page-start-box-text">
          <h1 className="start-page-menu-header">Годовой календарь</h1>
          <h3 className="start-page-menu-pitch">Для тех, кто любит планировать на год вперед</h3>
          { button }
        </div>
      </div>

      <div name="about" className='start-page-fake-menu'></div>
      <div className="start-page-landing-row">
        <h1 className="start-page-menu-header-lightback">Годовой календарь это:</h1>

          <h3 className="start-page-menu-pitch-lightback">
            Приложение, которое позволит вам осуществить годовое планирование</h3>
          <h3 className="start-page-menu-pitch-lightback">
            Простой и удобный пользовательский интерфейс</h3>
          <h3 className="start-page-menu-pitch-lightback">
            Безопасность ваших данных - мы не храним данные у себя, приложение полностью интегрировано с Google.Calendar</h3>

          <div className="start-page-app-example-container">
            <div className="start-page-app-example"></div>
            <div className="start-page-app-example-fade"></div>
          </div>

      </div>

      <div name="donate" className='start-page-fake-menu'></div>
      <div className="start-page-landing-row">
        <h1 className="start-page-menu-header-lightback">Помощь проекту</h1>
        <div className="start-page-app-donate-container">

          <blockquote>
            Привет, планируя путешествия или какие-то мероприятия за долго до их совершения, мне всегда не хватало такого календаря, где на годовом виде будут отображены все запланированные события, так чтобы я ничего не забыл. Тогда мне и пришла идея написать такое приложение. Эти приложением можете пользоваться и вы совершенно бесплатно, без пробного периода и надоедливой рекламы.
            При этом, я буду рад любой поддержке для развитие проекта.
          <span>Алексей Малафеев (автор проекта)</span>
          </blockquote>

        </div>

      <div className="start-page-app-donate-box">
        <iframe title="donate" src="https://yoomoney.ru/quickpay/shop-widget?writer=seller&targets=%D0%A1%D0%BF%D0%B0%D1%81%D0%B8%D0%B1%D0%BE%20%D0%B7%D0%B0%20%D0%93%D0%BE%D0%B4%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%9A%D0%B0%D0%BB%D0%B5%D0%B4%D0%B0%D1%80%D1%8C&targets-hint=&default-sum=100&button-text=14&hint=&successURL=&quickpay=shop&account=410019253514907" frameBorder="0" allowtransparency="true" scrolling="no" style={{height: "400px"}}></iframe>
        </div>
      </div>

      <div name="contacts" className='start-page-fake-menu'></div>
      <div className="start-page-landing-row">
        <h1 className="start-page-menu-header-lightback">Контакты</h1>
        <h3 className="start-page-menu-pitch-lightback">Буду рад любым отзывам и предложения по развитию календаря. Напишите мне.</h3>
        <div className="start-page-app-email-container">
          <a href="mailto:malafeev.alexey@gmail.com">malafeev.alexey@gmail.com</a>
        </div>
      </div>

      <div className="start-page-footer">
        <div className="start-page-footer-label">
          Алексей Малафеев @ { moment().year() } год.
        </div>
      </div>

      <BackTop onClick={this.goToTop}>
        <div className="start-page-back-top">Наверх</div>
      </BackTop>

    </>
  );
  }

}

export default StartPage;
