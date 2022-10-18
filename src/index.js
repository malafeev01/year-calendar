import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';

import en_US from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import 'moment/locale/ru';  // important!

moment.locale('en');  // important!

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={en_US}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
