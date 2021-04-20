import React from 'react';
import YearCalendar from './year-calendar.js'
import ProfileNavBar from './navigation-bar.js'
import {showSuccessNotification,
  showErrorNotification} from '../../common/notification.js'
import {logInfo, logError} from '../../common/utilities.js';

class ProfilePage extends React.Component {

  constructor(props) {
    super(props)

    this.api = props.api;

    this.state = {
      calendarLoading: true,
      events: []
    }
  }

  componentDidMount() {
    logInfo(this, "componentDidMount: string initializing the calendar");
    this.api.isCalendarExist().then( (exist) => {
      if (exist) {
        logInfo(this, "componentDidMount: calendar is alreay exists. Getting events.");
        this.api.getEvents().then( (events) => {
          this.setState({ events: events, calendarLoading: false });
        }).catch( (error) => {
          logError(this, JSON.stringify(error));
          showErrorNotification(error);
        });
      }

      else {
        logInfo(this, "componentDidMount: calendar doesn't exist. Starting creation.");
        this.api.createCalendar().then( (response) => {
          localStorage.setItem('calendarId', response.result.id);
          showSuccessNotification("Вы успешно создали новый каледарь.");
          this.setState({ events: [], calendarLoading: false });
        }).catch( (error) => {
          logError(this, JSON.stringify(error));
          showErrorNotification(error);
        });

      }
    }).catch( (error) => {
      logError(this, JSON.stringify(error));
      showErrorNotification(error);
    });
  }

  componentWillMount() {
    logInfo(this, "componentWillUnmount: checking user session");
    if (!this.api.isSignedIn()){
      logInfo(this, "componentWillUnmount: user is not logged in, redirecting to home page");
      window.location.href = '/';
    }
  }

  render() {
    logInfo(this, "render: rendering profile page");
    return (
      <>
        <ProfileNavBar api={this.api}/>
        <YearCalendar loading={this.state.calendarLoading} api={this.api}
                            events={this.state.events}/>
      </>
    );
  }
}

export default ProfilePage;
