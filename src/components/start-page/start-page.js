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
      <Menu style={{ position: "fixed", zIndex: 1001, width: "100%", background: "#423c52"}}
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
            Привет, планируя путешествия или какие-то мероприятия за долго до их совершения, мне всегда не хватало такого календаря, где на годовом виде будут отображены все запланированные события, так чтобы я ничего не забыл. Тогда мне и пришла идея написать такое приложение. Этим приложением можете пользоваться и вы, совершенно бесплатно, без пробного периода и надоедливой рекламы.
            При этом, я буду рад любой поддержке для развития проекта.
          <span>Алексей Малафеев (автор проекта)</span>
          </blockquote>

        </div>

        <div className="start-page-app-donate-box">

          <form method="POST" action="https://yoomoney.ru/quickpay/confirm.xml" target='_blank'>
              <input type="hidden" name="receiver" value="410019253514907"/>
              <input type="hidden" name="quickpay-form" value="donate"/>
              <input type="hidden" name="targets" value="Спасибо за годовой календарь"/>
              <div>
                <input name="sum" defaultValue="100" data-type="number" className="start-page-donate-input"/>
              </div>
              <div className="start-page-donate-currency">
                рублей
              </div>
              <div className="start-page-donate-button-box">
                <input type="submit" value="Перевести" className="start-page-donate-button"/>
              </div>

          </form>

        </div>
      </div>

      <div name="contacts" className='start-page-fake-menu'></div>
      <div className="start-page-landing-row">
        <h1 className="start-page-menu-header-lightback">Контакты</h1>
        <h3 className="start-page-menu-pitch-lightback">Буду рад любым отзывам и предложения по развитию календаря. Напишите мне.</h3>
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
