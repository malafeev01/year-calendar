import './App.css';
import "antd/dist/antd.css";
import Api from './api/google-api.js'
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import StartPage from './components/start-page/start-page.js'
import ProfilePage from './components/profile-page/profile-page.js'
import PrivacyPage from './components/privacy-page/privacy-page.js'
import {showErrorNotification} from './common/notification.js'
import {logInfo, logError} from './common/utilities.js';
import { LoadingOutlined } from '@ant-design/icons';
import {  Spin } from 'antd';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.api = null;

    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    logInfo(this, "componentDidMount: starting initializing API");
    this.api = new Api();
    logInfo(this, "componentDidMount: API initialized");

    this.api.getSession().then( (session )=> {
      this.setState({loading: false});
    }).catch( (error) => {
      this.setState({loading: false});
      logError(this, JSON.stringify(error));
      showErrorNotification(error);
    });

  }

  render() {
    let loading = <>
                  <div className="loading-container">
                    <Spin indicator={<LoadingOutlined className="year-calendar-loading-icon" />}
                        tip="Loading..." />
                  </div>
                  </>
    return (

      <Router>
        <Switch>
          <Route path="/privacy">
            { this.state.loading ?  loading  : <PrivacyPage api={this.api}/>}
          </Route>

          <Route path="/profile">
            { this.state.loading ?  loading  : <ProfilePage api={this.api}/>}
          </Route>

          <Route path="/">
            <StartPage loading={this.state.loading} api={this.api}/>
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>

        </Switch>
      </Router>
  );
  }
}

export default App;
